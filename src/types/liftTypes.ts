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
  date: Date;
  name: string;
  weightLifted: number | null;
  sets: ReadonlyArray<Set>;
} & LiftInfo;

/** An entry that has been saved, and can therefore be edited or deleted. */
type StoredLiftLogEntry = LiftLogEntry & {
  id: number;
};

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
  entries: StoredLiftLogEntry[];
};

/** A lift log without its entries, as shown on the list of all logs. */
type LiftLogSummary = {
  name: string;
  title: string;
  entryCount: number;
};

export { InputMode };
export type {
  LiftLog,
  LiftLogEntry,
  LiftLogSummary,
  Set,
  SetsReps,
  StoredLiftLogEntry,
  LiftInfo,
  LiftInfoLink
};
