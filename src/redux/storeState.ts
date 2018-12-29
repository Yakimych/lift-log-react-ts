import { Moment } from "moment";
import { Set } from "../types/LiftTypes";
import { InputMode, LiftInfoLink } from "../types/LiftTypes";
import { LiftLogState } from "./liftLogState";

export type NewEntryState = {
  // dateString: string;
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

  // TODO: Why is this optional?
  numberOfSets?: number;
  numberOfReps?: number;

  customSetsStrings: ReadonlyArray<string>;
  customSets: ReadonlyArray<Set>;

  commentIsShown: boolean;
  comment: string;
  canAddLink: boolean;
  links: ReadonlyArray<LiftInfoLink>;
};

export type StoreState = {
  liftLogState: LiftLogState;
  newEntryState: NewEntryState;
  dialogState: DialogState;
};
