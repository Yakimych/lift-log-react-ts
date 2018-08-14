type Rep = {
  number: number;
};

type LiftLogEntry = {
  date: Date;
  name: string;
  weightLifted: number;
  reps: Rep[];
};

type LiftLog = {
  name: string;
  entries: LiftLogEntry[];
};

export { LiftLog, LiftLogEntry, Rep };
