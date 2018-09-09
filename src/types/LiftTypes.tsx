type Set = {
  reps: number;
};

type LiftInfo = {
  comment: string;
};

type LiftLogEntry = {
  date: Date;
  name: string;
  weightLifted: number;
  sets: Set[];
} & LiftInfo;

enum InputMode {
  SetsReps,
  CustomReps
}

type SetsRepsInput = {
  mode: InputMode;
  numberOfSets: number;
  numberOfReps: number;
  customSets: Set[];
};

type LiftLogEntryReps = SetsRepsInput & LiftInfo;

type LiftLog = {
  name: string;
  title: string;
  entries: LiftLogEntry[];
};

export {
  LiftLog,
  LiftLogEntry,
  Set,
  LiftLogEntryReps,
  SetsRepsInput,
  LiftInfo,
  InputMode
};
