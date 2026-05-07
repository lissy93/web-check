import { useReducer, useEffect, useRef, useCallback, useState } from 'react';
import { logJobOutcome } from 'web-check-live/utils/logger';
import keys from 'web-check-live/utils/get-keys';
import type { AddressType } from 'web-check-live/utils/address-type-checker';
import type { LoadingState } from 'web-check-live/components/misc/ProgressBar';
import type { JobSpec, JobContext, JobsState } from 'web-check-live/jobs/types';
import { allCardIds } from 'web-check-live/jobs/registry';

type Action =
  | { type: 'start'; cardIds: string[] }
  | { type: 'success'; cardIds: string[]; raw: any; timeTaken: number }
  | {
      type: 'error';
      cardIds: string[];
      outcome: 'error' | 'timed-out';
      error: string;
      timeTaken: number;
    }
  | { type: 'skipped'; cardIds: string[]; reason?: string }
  | { type: 'force'; cardId: string; state: LoadingState };

const initialState: JobsState = Object.fromEntries(
  allCardIds.map((id) => [id, { state: 'loading' as LoadingState }]),
);

const setMany = (s: JobsState, ids: string[], patch: Partial<JobsState[string]>) =>
  ids.reduce((acc, id) => ({ ...acc, [id]: { ...acc[id], ...patch } }), s);

const reducer = (s: JobsState, a: Action): JobsState => {
  switch (a.type) {
    case 'start':
      return setMany(s, a.cardIds, { state: 'loading', error: undefined });
    case 'success':
      return setMany(s, a.cardIds, {
        state: 'success',
        raw: a.raw,
        timeTaken: a.timeTaken,
        error: undefined,
      });
    case 'error':
      return setMany(s, a.cardIds, {
        state: a.outcome,
        error: a.error,
        timeTaken: a.timeTaken,
      });
    case 'skipped':
      return setMany(s, a.cardIds, { state: 'skipped', error: a.reason });
    case 'force':
      return { ...s, [a.cardId]: { ...s[a.cardId], state: a.state } };
  }
};

const isTimeout = (msg = '') => /timed[- ]?out/i.test(msg);

const apiBase = (import.meta.env.PUBLIC_API_ENDPOINT || '/api') as string;

// Drives every job's lifecycle: fetch, retry, abort, fallback promotion
const useJobs = (address: string, addressType: AddressType, jobs: JobSpec[]) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [ipAddress, setIpAddress] = useState<string | undefined>();
  const startTime = useRef(Date.now()).current;
  const controllers = useRef<Record<string, AbortController>>({});
  const fired = useRef<Set<string>>(new Set());
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const runJob = useCallback(
    (job: JobSpec, ip?: string) => {
      const cardIds = job.cards.map((c) => c.id);
      controllers.current[job.id]?.abort();
      const controller = new AbortController();
      controllers.current[job.id] = controller;
      fired.current.add(job.id);

      if (cardIds.length) dispatch({ type: 'start', cardIds });

      const ctx: JobContext = { address, ipAddress: ip, api: apiBase, signal: controller.signal };
      job
        .fetcher(ctx)
        .then((raw: any) => {
          if (controller.signal.aborted) return;
          const timeTaken = Date.now() - startTime;
          if (job.id === 'get-ip' && typeof raw === 'string') {
            setIpAddress(raw);
            return;
          }
          if (raw?.skipped) {
            dispatch({ type: 'skipped', cardIds, reason: raw.skipped });
            cardIds.forEach((id) => logJobOutcome('error', id, timeTaken, raw.skipped));
            return;
          }
          if (raw?.error) {
            const outcome = isTimeout(raw.error) ? 'timed-out' : 'error';
            dispatch({ type: 'error', cardIds, outcome, error: raw.error, timeTaken });
            cardIds.forEach((id) => logJobOutcome(outcome, id, timeTaken, raw.error));
            return;
          }
          dispatch({ type: 'success', cardIds, raw, timeTaken });
          cardIds.forEach((id) => logJobOutcome('success', id, timeTaken));
        })
        .catch((err: any) => {
          if (controller.signal.aborted || err?.name === 'AbortError') return;
          const timeTaken = Date.now() - startTime;
          const message = err?.message || 'Unknown error';
          const outcome = isTimeout(message) ? 'timed-out' : 'error';
          dispatch({ type: 'error', cardIds, outcome, error: message, timeTaken });
          cardIds.forEach((id) => logJobOutcome(outcome, id, timeTaken, message));
        });
    },
    [address, startTime],
  );

  const skipJob = useCallback((job: JobSpec) => {
    const cardIds = job.cards.map((c) => c.id);
    if (cardIds.length) dispatch({ type: 'skipped', cardIds });
  }, []);

  // Decide which jobs are eligible for the current input
  const eligible = useCallback(
    (job: JobSpec) => {
      if (job.needsIp) {
        return addressType === 'url' || addressType === 'ipV4' || addressType === 'ipV6';
      }
      if (!job.expectedAddressTypes) return true;
      return job.expectedAddressTypes.includes(addressType);
    },
    [addressType],
  );

  // Initial fan-out: fire non-IP jobs immediately, mark unsupported as skipped
  useEffect(() => {
    if (keys.disableEverything) {
      jobs.forEach((j) => skipJob(j));
      return;
    }
    if (!address || addressType === 'empt' || addressType === 'err') return;

    fired.current.clear();
    if (addressType === 'ipV4' || addressType === 'ipV6') setIpAddress(address);
    else setIpAddress(undefined);

    jobs.forEach((job) => {
      if (!eligible(job)) {
        skipJob(job);
        return;
      }
      if (job.needsIp) return;
      runJob(job);
    });

    return () => {
      Object.values(controllers.current).forEach((c) => c.abort());
      controllers.current = {};
    };
  }, [address, addressType, jobs, runJob, skipJob, eligible]);

  // Fire IP-dependent jobs the moment we have an IP, but only once each
  useEffect(() => {
    if (!ipAddress) return;
    jobs.forEach((job) => {
      if (!job.needsIp || fired.current.has(job.id)) return;
      if (!eligible(job)) {
        skipJob(job);
        return;
      }
      runJob(job, ipAddress);
    });
  }, [ipAddress, jobs, runJob, skipJob, eligible]);

  // Promote any card whose fallback resolves after the primary failed
  useEffect(() => {
    jobs.forEach((job) =>
      job.cards.forEach((card) => {
        if (!card.fallback) return;
        const entry = state[card.id];
        if (!entry || entry.state === 'success' || entry.state === 'loading') return;
        if (card.fallback(state)) dispatch({ type: 'force', cardId: card.id, state: 'success' });
      }),
    );
  }, [state, jobs]);

  // Single client-side budget for stuck jobs, resets on new input
  useEffect(() => {
    if (!address) return;
    const budget = parseInt((import.meta.env.PUBLIC_API_TIMEOUT_LIMIT as string) || '45000', 10);
    const timer = setTimeout(() => {
      const stuck = Object.entries(stateRef.current)
        .filter(([_, e]) => e?.state === 'loading')
        .map(([id]) => id);
      if (!stuck.length) return;
      dispatch({
        type: 'error',
        cardIds: stuck,
        outcome: 'timed-out',
        error: 'Client-side timeout reached',
        timeTaken: Date.now() - startTime,
      });
      stuck.forEach((id) => {
        const owner = jobs.find((j) => j.cards.some((c) => c.id === id));
        if (owner) controllers.current[owner.id]?.abort();
      });
    }, budget);
    return () => clearTimeout(timer);
  }, [address, addressType, jobs, startTime]);

  const retry = useCallback(
    (cardId: string) => {
      if (state[cardId]?.state === 'loading') return;
      const job = jobs.find((j) => j.cards.some((c) => c.id === cardId));
      if (!job) return;
      runJob(job, ipAddress);
    },
    [jobs, runJob, state, ipAddress],
  );

  return { state, retry };
};

export default useJobs;
