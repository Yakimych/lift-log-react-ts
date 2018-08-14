type Rep = {
  number: number;
};

type LiftLogEntry = {
  date: Date;
  name: string;
  weightLifted: number;
  reps: Rep[];
};

export { LiftLogEntry, Rep };
