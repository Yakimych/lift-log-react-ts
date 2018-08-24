type Set = {
  reps: number;
};

type LiftLogEntry = {
  date: Date;
  name: string;
  weightLifted: number;
  sets: Set[];
};

type LiftLog = {
  name: string;
  title: string;
  entries: LiftLogEntry[];
};

export { LiftLog, LiftLogEntry, Set };
