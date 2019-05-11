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
  weightLifted: number | null;
  sets: ReadonlyArray<Set>;
} & LiftInfo;

enum InputMode {
  SetsReps,
  CustomReps
}

type SetsReps = {
  mode: InputMode;
  numberOfSets: number;
  numberOfReps: number;
  customSetsStrings: ReadonlyArray<string>;
};

type LiftLog = {
  name: string;
  title: string;
  entries: LiftLogEntry[];
};

export {
  LiftLog,
  LiftLogEntry,
  Set,
  SetsReps,
  LiftInfo,
  InputMode,
  LiftInfoLink
};
