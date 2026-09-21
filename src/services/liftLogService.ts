import axios, { AxiosResponse } from "axios";
import {
  LiftInfoLink,
  LiftLog,
  LiftLogEntry,
  LiftLogSummary,
  Set,
  StoredLiftLogEntry
} from "./../types/liftTypes";

type ApiSet = {
  numberOfReps: number;
  rpe: number | null;
};

type ApiLiftLogEntry = {
  date: string;
  name: string;
  weightLifted: number;
  sets: ApiSet[];
  comment: string;
  links: ReadonlyArray<LiftInfoLink>;
};

type ApiStoredLiftLogEntry = ApiLiftLogEntry & {
  id: number;
};

type ApiLiftLog = {
  name: string;
  title: string;
  entries: ApiStoredLiftLogEntry[];
};

class LiftLogService {
  private readonly liftLogsUrl: string;
  // Every route is behind a session cookie, which has to travel even when the
  // API is served from a different origin than the app.
  private readonly http = axios.create({ withCredentials: true });

  constructor(url: string) {
    this.liftLogsUrl = url;
  }

  public getLiftLogs(): Promise<ReadonlyArray<LiftLogSummary>> {
    return this.http
      .get(this.liftLogsUrl)
      .then((result: AxiosResponse<ApiLiftLog[]>) =>
        result.data.map(this.toLiftLogSummary)
      );
  }

  public getLiftLog(logName: string): Promise<LiftLog> {
    return this.http
      .get(this.getLogUrl(logName))
      .then((result: AxiosResponse<ApiLiftLog>) => this.toLiftLog(result.data));
  }

  public createLiftLog(name: string, title: string): Promise<any> {
    return this.http.post(this.liftLogsUrl, { name, title });
  }

  public updateLiftLog(logName: string, title: string): Promise<any> {
    return this.http.put(this.getLogUrl(logName), { title });
  }

  public deleteLiftLog(logName: string): Promise<any> {
    return this.http.delete(this.getLogUrl(logName));
  }

  public addEntry(logName: string, entry: LiftLogEntry): Promise<any> {
    return this.http.post(this.entriesUrl(logName), this.toApiLiftLogEntry(entry));
  }

  public updateEntry(
    logName: string,
    entryId: number,
    entry: LiftLogEntry
  ): Promise<any> {
    return this.http.put(
      this.entryUrl(logName, entryId),
      this.toApiLiftLogEntry(entry)
    );
  }

  public deleteEntry(logName: string, entryId: number): Promise<any> {
    return this.http.delete(this.entryUrl(logName, entryId));
  }

  private getLogUrl = (logName: string) =>
    `${this.liftLogsUrl}/${encodeURIComponent(logName)}`;
  private entriesUrl = (logName: string) => `${this.getLogUrl(logName)}/lifts`;
  private entryUrl = (logName: string, entryId: number) =>
    `${this.entriesUrl(logName)}/${entryId}`;

  private toLiftLog = (apiLiftLog: ApiLiftLog): LiftLog => ({
    name: apiLiftLog.name,
    title: apiLiftLog.title,
    entries: apiLiftLog.entries.map(this.toLiftLogEntry)
  });

  private toLiftLogSummary = (apiLiftLog: ApiLiftLog): LiftLogSummary => ({
    name: apiLiftLog.name,
    title: apiLiftLog.title,
    entryCount: apiLiftLog.entries.length
  });

  private toApiLiftLogEntry = (entry: LiftLogEntry): ApiLiftLogEntry => ({
    date: entry.date.toISOString(),
    name: entry.name,
    weightLifted: entry.weightLifted || 0,
    sets: entry.sets.map(this.toApiSet),
    comment: entry.comment,
    links: entry.links
  });

  private toApiSet = (set: Set): ApiSet => ({
    numberOfReps: set.reps,
    rpe: set.rpe
  });

  private toLiftLogEntry = (
    apiLiftLogEntry: ApiStoredLiftLogEntry
  ): StoredLiftLogEntry => ({
    id: apiLiftLogEntry.id,
    date: new Date(apiLiftLogEntry.date),
    name: apiLiftLogEntry.name,
    weightLifted: apiLiftLogEntry.weightLifted,
    sets: apiLiftLogEntry.sets.map(set => ({
      reps: set.numberOfReps,
      rpe: set.rpe
    })),
    comment: apiLiftLogEntry.comment,
    links: apiLiftLogEntry.links
  });
}

export default LiftLogService;
