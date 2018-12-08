import { Moment } from "moment";
import { Set } from "../types/LiftTypes";
import { InputMode, LiftInfoLink } from "../types/LiftTypes";
import { LiftLogState } from "./liftLogState";

export type NewEntryState = {
  dateString: string;
  date: Moment | null;
  name: string;
  weightLiftedString: string;
  weightLifted: number | null;
};

export type DialogState = {
  isOpen: boolean;

  inputMode: InputMode;

  numberOfSetsString: string;
  numberOfRepsString: string;

  numberOfSets?: number;
  numberOfReps?: number;

  customSetsStrings: ReadonlyArray<string>;
  customSets: ReadonlyArray<Set>;

  commentIsShown: boolean;
  comment: string;
  links: ReadonlyArray<LiftInfoLink>;
  canAddLink: boolean;
};

export type StoreState = {
  liftLogState: LiftLogState;
  newEntry: NewEntryState;
  dialogState: DialogState;
};
