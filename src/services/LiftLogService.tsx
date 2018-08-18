import axios, { AxiosResponse } from "axios";
import { LiftLog, LiftLogEntry } from "./../types/LiftTypes";

type ApiRep = {
  number: number;
  rpe: number;
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
  private getLogUrl = (logName: string) => `${this.liftLogsUrl}/${logName}`;

  private toLiftLog = (apiLiftLog: ApiLiftLog): LiftLog => ({
    name: apiLiftLog.name,
    title: apiLiftLog.title,
    entries: apiLiftLog.entries.map(this.toLiftLogEntry)
  });

  private toLiftLogEntry = (
    apiLiftLogEntry: ApiLiftLogEntry
  ): LiftLogEntry => ({
    date: new Date(apiLiftLogEntry.date),
    name: apiLiftLogEntry.name,
    weightLifted: apiLiftLogEntry.weightLifted,
    reps: apiLiftLogEntry.reps
  });
}

export default LiftLogService;
