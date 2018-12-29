import axios, { AxiosResponse } from "axios";
import * as moment from "moment";
import { LiftInfoLink, LiftLog, LiftLogEntry, Set } from "./../types/LiftTypes";

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

type ApiLiftLog = {
  name: string;
  title: string;
  entries: ApiLiftLogEntry[];
};

class LiftLogService {
  // TODO: Take in url as constructor parameter instead
  private liftLogsUrl = `${process.env.REACT_APP_API_BASE_URL}/liftlogs`;

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
    apiLiftLogEntry: ApiLiftLogEntry
  ): LiftLogEntry => ({
    date: moment(apiLiftLogEntry.date),
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
