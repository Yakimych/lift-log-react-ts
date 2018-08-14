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
  id: string;
  logName: string;
  entries: ApiLiftLogEntry[];
};

// In-memory version
const liftLog: ApiLiftLog = {
  id: "anturapd",
  logName: "Bench Press: Road to 100",
  entries: [
    {
      date: "2018-01-01",
      name: "Bob",
      weightLifted: 80,
      reps: Array(3).fill({ number: 5 })
    },
    {
      date: "2018-01-02",
      name: "Alice",
      weightLifted: 60,
      reps: [{ number: 5 }, { number: 5 }, { number: 3 }]
    }
  ]
};

class LiftLogService {
  public getLiftLog(boardId: string): Promise<LiftLog> {
    return new Promise(resolve => {
      resolve(this.toLiftLog(liftLog));
    });
  }

  private toLiftLog = (apiLiftLog: ApiLiftLog): LiftLog => ({
    name: apiLiftLog.logName,
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
