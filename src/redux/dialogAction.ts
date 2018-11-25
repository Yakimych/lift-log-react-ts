import { InputMode } from "src/types/LiftTypes";
import { ActionType, createStandardAction } from "typesafe-actions";

// TODO: Rename to SetsRepsInputActions?
export const actions = {
  open: createStandardAction("dialog/OPEN")(),
  close: createStandardAction("dialog/CLOSE")(),

  setInputMode: createStandardAction("dialog/SET_INPUT_MODE")<InputMode>(),
  // TODO: Show/hide tooltip?

  setNumberOfSets: createStandardAction("dialog/SET_NUMBER_OF_SETS")<string>(),
  setNumberOfReps: createStandardAction("dialog/SET_NUMBER_OF_REPS")<string>(),

  addCustomSet: createStandardAction("dialog/ADD_CUSTOM_SET")(),
  removeCustomSet: createStandardAction("dialog/REMOVE_CUSTOM_SET")<number>(),
  changeCustomSet: createStandardAction("dialog/CHANGE_CUSTOM_SET")<{
    index: number;
    value: string;
  }>(),

  showComment: createStandardAction("dialog/SHOW_COMMENT")(),
  changeComment: createStandardAction("dialog/CHANGE_COMMENT")(),

  addLink: createStandardAction("dialog/ADD_LINK")(),
  removeLink: createStandardAction("dialog/REMOVE_LINK")<number>(),
  changeLinkText: createStandardAction("dialog/CHANGE_LINK_TEXT")<
    number,
    string
  >(),
  changeLinkUrl: createStandardAction("dialog/CHANGE_LINK_URL")<
    number,
    string
  >()
};

export type DialogAction = ActionType<typeof actions>;
