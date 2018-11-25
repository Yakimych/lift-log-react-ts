import { LiftLogEntry } from "src/types/LiftTypes";
import {
  ActionType,
  createAsyncAction,
  createStandardAction
} from "typesafe-actions";

const addLogEntry = createAsyncAction(
  "liftlogentry/ADD_START",
  "liftlogentry/ADD_SUCCESS",
  "liftlogentry/ADD_ERROR"
)<LiftLogEntry, void, string>();

export const actions = {
  changeDate: createStandardAction("liftlogentry/CHANGE_DATE")<string>(),
  changeName: createStandardAction("liftlogentry/CHANGE_NAME")<string>(),
  changeWeightLifted: createStandardAction("liftlogentry/CHANGE_WEIGHTLIFTED")<
    string
  >(),
  addLogEntry
};

export type NewEntryAction = ActionType<typeof actions>;

// TODO: thunks
