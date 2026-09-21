export type ApiSet = {
  numberOfReps: number;
  rpe: number | null;
};

export type ApiLink = {
  text: string;
  url: string;
};

export type ApiLiftLogEntry = {
  name: string;
  weightLifted: number;
  date: string;
  sets: ApiSet[];
  comment: string | null;
  links: ApiLink[] | null;
};

/**
 * Entries are addressable by their per-log ordinal, which is what edit and
 * delete requests refer to.
 */
export type ApiStoredLiftLogEntry = ApiLiftLogEntry & {
  id: number;
};

export type ApiLiftLog = {
  name: string;
  title: string;
  entries: ApiStoredLiftLogEntry[];
};

export type CreateLiftLog = {
  name: string;
  title: string;
};

export type UpdateLiftLog = {
  title: string;
};

export interface LiftLogRepository {
  createLog(log: CreateLiftLog): Promise<void>;
  getAllLogs(): Promise<ApiLiftLog[]>;
  getLog(logName: string): Promise<ApiLiftLog | null>;
  updateLog(logName: string, log: UpdateLiftLog): Promise<boolean>;
  deleteLog(logName: string): Promise<boolean>;
  addEntry(logName: string, entry: ApiLiftLogEntry): Promise<boolean>;
  updateEntry(
    logName: string,
    entryId: number,
    entry: ApiLiftLogEntry,
  ): Promise<boolean>;
  deleteEntry(logName: string, entryId: number): Promise<boolean>;
  ping(): Promise<void>;
}

export class DuplicateLogError extends Error {
  public readonly logName: string;

  public constructor(logName: string) {
    super(`Lift Log with name '${logName}' already exists`);
    this.name = "DuplicateLogError";
    this.logName = logName;
  }
}
