import { Set } from "../types/liftTypes";
import { InputMode, LiftInfoLink } from "../types/liftTypes";
import { LiftLogState } from "./liftLogState";

export type NewEntryState = {
  date: Date | null;
  name: string;
  weightLiftedString: string;
  weightLifted: number | null;
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

export type AppState = {
  liftLogState: LiftLogState;
  newEntryState: NewEntryState;
  dialogState: DialogState;
};
