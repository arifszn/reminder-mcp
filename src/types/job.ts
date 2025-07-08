export enum JobStatus {
  Unknown = 0,
  OK = 1,
  FailedDns = 2,
  FailedConnect = 3,
  FailedHttp = 4,
  FailedTimeout = 5,
  FailedTooMuchData = 6,
  FailedInvalidUrl = 7,
  FailedInternal = 8,
  FailedUnknown = 9,
}

export enum JobType {
  Default = 0,
  Monitoring = 1,
}

export enum RequestMethod {
  GET = 0,
  POST = 1,
  OPTIONS = 2,
  HEAD = 3,
  PUT = 4,
  DELETE = 5,
  TRACE = 6,
  CONNECT = 7,
  PATCH = 8,
}

export enum DeletionType {
  Title = 'title',
  Processed = 'processed',
  All = 'all',
}

export interface JobSchedule {
  timezone?: string;
  expiresAt?: number;
  hours?: number[];
  mdays?: number[];
  minutes?: number[];
  months?: number[];
  wdays?: number[];
}

export interface Job {
  jobId?: number;
  enabled?: boolean;
  title?: string;
  saveResponses?: boolean;
  url: string;
  lastStatus?: JobStatus;
  lastDuration?: number;
  lastExecution?: number;
  nextExecution?: number | null;
  type?: JobType;
  requestTimeout?: number;
  redirectSuccess?: boolean;
  folderId?: number;
  schedule?: JobSchedule;
  requestMethod?: RequestMethod;
  extendedData?: {
    headers: Record<string, string>;
    body: string;
  };
}
