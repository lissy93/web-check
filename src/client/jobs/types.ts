import type { ComponentType } from 'react';
import type { AddressType } from 'client/utils/address-type-checker';
import type { LoadingState } from 'client/components/misc/ProgressBar';
import type { CategoryId } from '@/data/categories';
import type { CheckId } from '@/data/checks';

export interface JobContext {
  address: string;
  ipAddress?: string;
  api: string;
  signal: AbortSignal;
}

export interface CardSpec {
  id: CheckId;
  title: string;
  categories: CategoryId[];
  Component: ComponentType<any>;
  pick?: (raw: any) => any;
  fallback?: (state: JobsState) => any;
}

export interface JobSpec {
  id: string;
  cards: CardSpec[];
  fetcher: (ctx: JobContext) => Promise<any>;
  expectedAddressTypes?: AddressType[];
  needsIp?: boolean;
  noClientTimeout?: boolean;
}

export interface JobEntry {
  state: LoadingState;
  raw?: any;
  error?: string;
  timeTaken?: number;
}

export type JobsState = Record<string, JobEntry>;
