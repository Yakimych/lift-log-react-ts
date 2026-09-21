import { Set } from "../types/liftTypes";
import { InputMode, LiftInfoLink, LiftLogSummary } from "../types/liftTypes";
import { LiftLogState } from "./liftLogState";

export type NewEntryFormValues = {
  date: Date | null;
  name: string;
  weightLiftedString: string;
  weightLifted: number | null;
};

export type NewEntryState = NewEntryFormValues & {
  isSaving: boolean;
  errorMessage: string | null;
  /** Set while an existing entry is being edited instead of a new one added. */
  editingEntryId: number | null;
  parkedEntry: NewEntryFormValues | null;
};

export type DialogState = {
  isOpen: boolean;

  inputMode: InputMode;

  numberOfSetsString: string;
  numberOfRepsString: string;

  numberOfSets: number;
  numberOfReps: number;

  customSetsStrings: ReadonlyArray<string>;
  customSets: ReadonlyArray<Set>;

  commentIsShown: boolean;
  comment: string;
  canAddLink: boolean;
  links: ReadonlyArray<LiftInfoLink>;
};

export type LogListState = {
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  logs: ReadonlyArray<LiftLogSummary>;

  newLogName: string;
  newLogTitle: string;

  editedLogName: string | null;
  editedLogTitle: string;

  logPendingDeletion: LiftLogSummary | null;
};

export type AppState = {
  liftLogState: LiftLogState;
  newEntryState: NewEntryState;
  dialogState: DialogState;
  logListState: LogListState;
};
