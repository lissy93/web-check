import { useState, useEffect, type ReactNode } from 'react';
import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import Card from 'client/components/Form/Card';
import Heading from 'client/components/Form/Heading';
import { allCardIds } from 'client/jobs/registry';

export type LoadingState = 'success' | 'loading' | 'skipped' | 'error' | 'timed-out';

export interface LoadingJob {
  name: string;
  state: LoadingState;
  error?: string;
  timeTaken?: number;
  retry?: () => void;
}

const STATUS_EMOJI: Record<LoadingState, string> = {
  success: '✅',
  loading: '🔄',
  error: '❌',
  'timed-out': '⏸️',
  skipped: '⏭️',
};

const STATE_COLOR: Record<LoadingState, string> = {
  success: colors.success,
  loading: colors.info,
  error: colors.danger,
  'timed-out': colors.warning,
  skipped: colors.neutral,
};

// Tally jobs by their loading state in a single pass
const countByState = (jobs: LoadingJob[]): Record<LoadingState, number> => {
  const counts: Record<LoadingState, number> = {
    success: 0,
    loading: 0,
    error: 0,
    skipped: 0,
    'timed-out': 0,
  };
  for (const j of jobs) counts[j.state]++;
  return counts;
};

// Convert per-state counts into percentages of the total
const stateToPercent = (jobs: LoadingJob[]): Record<LoadingState, number> => {
  const counts = countByState(jobs);
  const total = jobs.length || 1;
  return Object.fromEntries(
    Object.entries(counts).map(([k, v]) => [k, (v / total) * 100]),
  ) as Record<LoadingState, number>;
};

const LoadCard = styled(Card)`
  margin: 0 auto;
  width: 95vw;
  position: relative;
`;

// Animates height auto <-> 0 via the grid-template-rows 1fr/0fr trick, plus fade and slide
const Collapsible = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transform: translateY(0);
  transition:
    grid-template-rows 0.3s ease,
    opacity 0.25s ease,
    transform 0.3s ease;
  > .inner {
    overflow: hidden;
    min-height: 0;
  }
  &.collapsed {
    grid-template-rows: 0fr;
    opacity: 0;
    transform: translateY(-0.5rem);
    pointer-events: none;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${colors.bgShadowColor};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarSegment = styled.div<{ color: string; width: number }>`
  height: 1rem;
  display: inline-block;
  width: ${(p) => p.width}%;
  background: ${(p) => `repeating-linear-gradient(
    315deg,
    ${p.color},
    ${p.color} 3px,
    color-mix(in srgb, ${p.color} 92%, #000) 3px,
    color-mix(in srgb, ${p.color} 92%, #000) 6px
  )`};
  transition: width 0.5s ease-in-out;
`;

const Details = styled.details`
  summary {
    margin: 0.5rem 0;
    font-weight: bold;
    cursor: pointer;
    &:before {
      content: '►';
      position: absolute;
      margin-left: -1rem;
      color: ${colors.primary};
    }
  }
  &[open] summary:before {
    content: '▼';
  }
  ul {
    list-style: none;
    padding: 0.25rem;
    border-radius: 4px;
    width: fit-content;
    li {
      button.docs {
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        font-weight: 700;
        padding: 0;
        cursor: pointer;
        &:hover,
        &:focus-visible {
          color: ${colors.primary};
          outline: none;
        }
      }
      i {
        color: ${colors.textColorSecondary};
      }
    }
  }
  p.error {
    margin: 0.5rem 0;
    opacity: 0.75;
    color: ${colors.danger};
  }
`;

const StatusInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .run-status {
    color: ${colors.textColorSecondary};
    margin: 0;
  }
`;

const AboutPageLink = styled.a`
  color: ${colors.primary};
`;

const SummaryContainer = styled.div`
  margin: 0.5rem 0;
  &.error-info {
    color: ${colors.danger};
  }
  &.success-info {
    color: ${colors.success};
  }
  &.loading-info {
    color: ${colors.info};
  }
  .skipped,
  .success,
  .error,
  .timed-out {
    margin-left: 0.75rem;
  }
  .skipped {
    color: ${colors.warning};
  }
  .success {
    color: ${colors.success};
  }
  .error {
    color: ${colors.danger};
  }
  .timed-out {
    color: ${colors.error};
  }
`;

const ReShowRow = styled.div`
  margin: 0 auto;
  width: 95vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  .summary {
    color: ${colors.textColorSecondary};
    font-size: 0.9rem;
    button.extras {
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      padding: 0;
      cursor: pointer;
      &:hover,
      &:focus-visible {
        text-decoration: underline;
        color: ${colors.primary};
        outline: none;
      }
    }
  }
`;

// Re-open trigger styled to match the repo's filter buttons (shadow grows on hover)
const ShowLoadStateButton = styled.button`
  background: ${colors.backgroundLighter};
  color: ${colors.textColor};
  border: none;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 2px 2px 0px ${colors.bgShadowColor};
  transition:
    box-shadow 0.2s ease-in-out,
    color 0.2s ease-in-out;
  &:hover,
  &:focus-visible {
    color: ${colors.primary};
    box-shadow: 4px 4px 0px ${colors.bgShadowColor};
    outline: none;
  }
`;

const DismissButton = styled.button`
  width: fit-content;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  background: ${colors.background};
  color: ${colors.textColorSecondary};
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  cursor: pointer;
  &:hover {
    color: ${colors.primary};
  }
`;

const FailedJobActionButton = styled.button`
  margin: 0.1rem 0.1rem 0.1rem 0.5rem;
  background: ${colors.background};
  color: ${colors.textColorSecondary};
  border: 1px solid ${colors.textColorSecondary};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: ${colors.primary};
    border-color: ${colors.primary};
  }
`;

const ErrorModalContent = styled.div`
  p {
    margin: 0;
  }
  pre {
    color: ${colors.danger};
    &.info {
      color: ${colors.warning};
    }
  }
`;

interface JobListItemProps {
  job: LoadingJob;
  showJobDocs: (name: string) => void;
  showErrorModal: (job: LoadingJob, isInfo?: boolean) => void;
}

// One row in the details list, showing job state, time and any actions
const JobListItem = ({ job, showJobDocs, showErrorModal }: JobListItemProps): ReactNode => {
  const { name, state, timeTaken, retry, error } = job;
  const canRetry = retry && state !== 'success' && state !== 'loading';
  const canShowError = error && (state === 'error' || state === 'timed-out' || state === 'skipped');

  return (
    <li>
      <button type="button" className="docs" onClick={() => showJobDocs(name)}>
        {STATUS_EMOJI[state]} {name}
      </button>
      <span style={{ color: STATE_COLOR[state] }}> ({state})</span>.
      <i>{timeTaken && state !== 'loading' ? ` Took ${timeTaken} ms` : ''}</i>
      {canRetry && (
        <FailedJobActionButton type="button" onClick={retry}>
          ↻ Retry
        </FailedJobActionButton>
      )}
      {canShowError && (
        <FailedJobActionButton
          type="button"
          onClick={() => showErrorModal(job, state === 'skipped')}
        >
          {state === 'timed-out' ? '■ Show Timeout Reason' : '■ Show Error'}
        </FailedJobActionButton>
      )}
    </li>
  );
};

// Single-line "Running X of Y / Finished in Z" status with shared elapsed time
const RunningText = ({ jobs, elapsedMs }: { jobs: LoadingJob[]; elapsedMs: number }): ReactNode => {
  const total = allCardIds.length;
  const done = total - jobs.filter((j) => j.state === 'loading').length;
  const isDone = done >= total;
  return (
    <p className="run-status">
      {isDone ? 'Finished in ' : `Running ${done} of ${total} jobs - `}
      {elapsedMs >= 10_000 ? `${(elapsedMs / 1000).toFixed(1)} s` : `${elapsedMs} ms`}
    </p>
  );
};

// Compact one-liner shown alongside the "Show Load State" button when collapsed
const LoadSummary = ({
  jobs,
  elapsedMs,
  onOpen,
}: {
  jobs: LoadingJob[];
  elapsedMs: number;
  onOpen: () => void;
}): ReactNode => {
  const total = allCardIds.length;
  const counts = countByState(jobs);
  const extras: string[] = [];
  if (counts.error) extras.push(`${counts.error} failed`);
  if (counts['timed-out']) extras.push(`${counts['timed-out']} timed out`);
  if (counts.skipped) extras.push(`${counts.skipped} skipped`);
  return (
    <span className="summary">
      {counts.success}/{total} lookups complete
      {extras.length > 0 && (
        <>
          {' '}
          <button type="button" className="extras" onClick={onOpen}>
            ({extras.join(', ')})
          </button>
        </>
      )}
      {elapsedMs ? `, took ${(elapsedMs / 1000).toFixed(1)}s` : ''}
    </span>
  );
};

const pluralJobs = (n: number) => `${n} ${n === 1 ? 'job' : 'jobs'}`;

type ChipKey = 'success' | 'skipped' | 'timed-out' | 'error';

const CHIPS: Record<ChipKey, { cls: string; label: string }> = {
  success: { cls: 'success', label: 'successful' },
  skipped: { cls: 'skipped', label: 'skipped' },
  'timed-out': { cls: 'timed-out', label: 'timed out' },
  error: { cls: 'error', label: 'failed' },
};

// Inline tally chip; renders nothing for zero so callers can always include it
const Chip = ({ count, cls, label }: { count: number; cls: string; label: string }) =>
  count > 0 ? (
    <span className={cls}>
      {pluralJobs(count)} {label}{' '}
    </span>
  ) : null;

// Heading-style summary that adapts to loading, all-success and partial-failure
const SummaryText = ({ jobs }: { jobs: LoadingJob[] }): ReactNode => {
  const total = allCardIds.length;
  const counts = countByState(jobs);
  const chips = (keys: ChipKey[]) =>
    keys.map((k) => <Chip key={k} count={counts[k]} {...CHIPS[k]} />);

  if (counts.loading > 0) {
    return (
      <SummaryContainer className="loading-info">
        <b>
          Loading {total - counts.loading} / {total} Jobs
        </b>
        {chips(['skipped', 'timed-out', 'error'])}
      </SummaryContainer>
    );
  }
  const hasIssues = counts.error > 0 || counts['timed-out'] > 0;
  if (!hasIssues) {
    return (
      <SummaryContainer className="success-info">
        <b>{counts.success} Jobs Completed Successfully</b>
        {chips(['skipped'])}
      </SummaryContainer>
    );
  }
  return (
    <SummaryContainer className="error-info">
      {chips(['success', 'skipped', 'timed-out', 'error'])}
    </SummaryContainer>
  );
};

interface ProgressLoaderProps {
  loadStatus: LoadingJob[];
  showModal: (err: ReactNode) => void;
  showJobDocs: (job: string) => void;
}

// Top-of-results progress bar with collapsible per-job detail and error modals
const ProgressLoader = ({ loadStatus, showModal, showJobDocs }: ProgressLoaderProps): ReactNode => {
  const [hideLoader, setHideLoader] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const percentages = stateToPercent(loadStatus);
  const isDone = !loadStatus.some((j) => j.state === 'loading');

  // Tick elapsed-time while loading, freeze on done so summary shows final duration
  useEffect(() => {
    if (isDone) return;
    const id = setInterval(() => setElapsedMs((v) => v + 100), 100);
    return () => clearInterval(id);
  }, [isDone]);

  // Auto-collapse once all jobs finish, leaving the "Finished in" line briefly visible
  useEffect(() => {
    if (!isDone) return;
    const t = setTimeout(() => setHideLoader(true), 1500);
    return () => clearTimeout(t);
  }, [isDone]);

  const colorFor = (state: LoadingState) =>
    state === 'success' && isDone ? colors.primary : STATE_COLOR[state];

  const showErrorModal = (job: LoadingJob, isInfo?: boolean) => {
    showModal(
      <ErrorModalContent>
        <Heading as="h3">Error Details for {job.name}</Heading>
        <p>
          The {job.name} job failed with an {job.state} state
          {job.timeTaken !== undefined ? ` after ${job.timeTaken} ms` : ''}. The server responded
          with the following error:
        </p>
        <pre className={isInfo ? 'info' : 'error'}>{job.error}</pre>
      </ErrorModalContent>,
    );
  };

  return (
    <div>
      <Collapsible className={!hideLoader ? 'collapsed' : ''} aria-hidden={!hideLoader}>
        <div className="inner">
          <ReShowRow>
            <LoadSummary
              jobs={loadStatus}
              elapsedMs={elapsedMs}
              onOpen={() => setHideLoader(false)}
            />
            <ShowLoadStateButton type="button" onClick={() => setHideLoader(false)}>
              Show Load State
            </ShowLoadStateButton>
          </ReShowRow>
        </div>
      </Collapsible>
      <Collapsible className={hideLoader ? 'collapsed' : ''} aria-hidden={hideLoader}>
        <div className="inner">
          <LoadCard>
            <ProgressBarContainer>
              {(Object.keys(percentages) as LoadingState[]).map((state) => (
                <ProgressBarSegment
                  key={`progress-bar-${state}`}
                  color={colorFor(state)}
                  width={percentages[state]}
                  title={`${state} (${Math.round(percentages[state])}%)`}
                />
              ))}
            </ProgressBarContainer>
            <StatusInfoWrapper>
              <SummaryText jobs={loadStatus} />
              <RunningText jobs={loadStatus} elapsedMs={elapsedMs} />
            </StatusInfoWrapper>
            <Details>
              <summary>Show Details</summary>
              <ul>
                {loadStatus.map((job) => (
                  <JobListItem
                    key={job.name}
                    job={job}
                    showJobDocs={showJobDocs}
                    showErrorModal={showErrorModal}
                  />
                ))}
              </ul>
              {loadStatus.some((j) => j.state === 'error') && (
                <p className="error">
                  <b>Check the browser console for logs and more info</b>
                  <br />
                  It's normal for some jobs to fail, either because the host doesn't return the
                  required info, or restrictions in the lambda function, or hitting an API limit.
                </p>
              )}
              <AboutPageLink href="/check/about" target="_blank" rel="noreferrer">
                Learn More about Web-Check
              </AboutPageLink>
            </Details>
            <DismissButton type="button" onClick={() => setHideLoader(true)}>
              Dismiss
            </DismissButton>
          </LoadCard>
        </div>
      </Collapsible>
    </div>
  );
};

export default ProgressLoader;
