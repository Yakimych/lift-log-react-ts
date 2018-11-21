import { Moment } from "moment";
import { InputMode, LiftInfoLink, LiftLogEntry } from "src/types/LiftTypes";

type NewEntry = {
  dateString: string;
  date: Moment;
  name: string;
  weigthLiftedString: string;
  weigthLifted?: number;
};

type DialogState = {
  inputMode: InputMode;

  numberOfSetsString: string;
  numberOfRepsString: string;

  numberOfSets?: number;
  numberOfReps?: number;

  customSetsStrings: ReadonlyArray<string>;
  customSets: ReadonlyArray<number>;

  commentIsShown: boolean;
  comment: string;
  links: LiftInfoLink;
  canAddLink: boolean;
};

export type StoreState = {
  title: string;
  LogEntries: ReadonlyArray<LiftLogEntry>;
  newEntry: NewEntry;
  dialogIsOpen: boolean;
  dialogState: DialogState;
};

/*
Actions:
  FetchLogEntries - Start, Success, Error
  AddLogEntry - start, Success, Error

  changeDate<string>
  changeName<string>
  changeWeightLifted<string>

  openDialog
  closeDialog

  setInputMode<InputMode>
  changeSets<string>
  changeReps<string>
  changeCustomSet<index: number, value: string>

  showComment
  addLink
  removeLink<index: number>
  changeLinkText<index: number, value: string>
  changeLinkUrl<index: number, value: string>

*/
