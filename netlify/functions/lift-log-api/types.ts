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

export type ApiLiftLog = {
  name: string;
  title: string;
  entries: ApiLiftLogEntry[];
};

export type CreateLiftLog = {
  name: string;
  title: string;
};

export interface LiftLogRepository {
  createLog(log: CreateLiftLog): Promise<void>;
  getAllLogs(): Promise<ApiLiftLog[]>;
  getLog(logName: string): Promise<ApiLiftLog | null>;
  addEntry(logName: string, entry: ApiLiftLogEntry): Promise<boolean>;
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
