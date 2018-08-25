import axios, { AxiosResponse } from "axios";
import { LiftLog, LiftLogEntry, Set } from "./../types/LiftTypes";

type ApiRep = {
  number: number;
  rpe: number | null;
};

type ApiLiftLogEntry = {
  date: string;
  name: string;
  weightLifted: number;
  reps: ApiRep[];
};

type ApiLiftLog = {
  name: string;
  title: string;
  entries: ApiLiftLogEntry[];
};

class LiftLogService {
  private liftLogsUrl = "http://localhost:5000/api/liftlogs";

  public getLiftLog(logName: string): Promise<LiftLog> {
    return axios
      .get(this.getLogUrl(logName))
      .then((result: AxiosResponse<ApiLiftLog>) => this.toLiftLog(result.data));
  }

  public addEntry(logName: string, entry: LiftLogEntry): Promise<any> {
    return axios.post(this.addEntryUrl(logName), this.toApiLiftLogEntry(entry));
  }

  private getLogUrl = (logName: string) => `${this.liftLogsUrl}/${logName}`;
  private addEntryUrl = (logName: string) => `${this.getLogUrl(logName)}/lifts`;

  private toLiftLog = (apiLiftLog: ApiLiftLog): LiftLog => ({
    name: apiLiftLog.name,
    title: apiLiftLog.title,
    entries: apiLiftLog.entries.map(this.toLiftLogEntry)
  });

  private toApiLiftLogEntry = (entry: LiftLogEntry): ApiLiftLogEntry => ({
    date: entry.date.toISOString(),
    name: entry.name,
    weightLifted: entry.weightLifted,
    reps: entry.sets.map(this.toApiRep)
  });

  private toApiRep = (set: Set): ApiRep => ({
    number: set.reps,
    rpe: null
  });

  private toLiftLogEntry = (
    apiLiftLogEntry: ApiLiftLogEntry
  ): LiftLogEntry => ({
    date: new Date(apiLiftLogEntry.date),
    name: apiLiftLogEntry.name,
    weightLifted: apiLiftLogEntry.weightLifted,
    sets: apiLiftLogEntry.reps.map(rep => ({ reps: rep.number }))
  });
}

export default LiftLogService;
