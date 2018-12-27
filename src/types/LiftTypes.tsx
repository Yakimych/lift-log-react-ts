import * as moment from "moment";

type Set = {
  reps: number;
  rpe: number | null;
};

type LiftInfoLink = {
  text: string;
  url: string;
};

type LiftInfo = {
  comment: string;
  links: ReadonlyArray<LiftInfoLink>;
};

type LiftLogEntry = {
  date: moment.Moment;
  name: string;
  weightLifted: number;
  sets: ReadonlyArray<Set>;
} & LiftInfo;

enum InputMode {
  SetsReps,
  CustomReps
}

type SetsRepsInput = {
  mode: InputMode;
  numberOfSets: number;
  numberOfReps: number;
  customSets: ReadonlyArray<Set>;
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
  InputMode,
  LiftInfoLink
};
