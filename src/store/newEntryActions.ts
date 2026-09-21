import { LiftLogEntry, StoredLiftLogEntry } from "src/types/liftTypes";
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

const updateLogEntry = createAsyncAction(
  "liftlogentry/UPDATE_START",
  "liftlogentry/UPDATE_SUCCESS",
  "liftlogentry/UPDATE_ERROR"
)<LiftLogEntry, void, string>();

const deleteLogEntry = createAsyncAction(
  "liftlogentry/DELETE_START",
  "liftlogentry/DELETE_SUCCESS",
  "liftlogentry/DELETE_ERROR"
)<number, void, string>();

export const actions = {
  changeDate: createStandardAction("liftlogentry/CHANGE_DATE")<Date | null>(),
  changeName: createStandardAction("liftlogentry/CHANGE_NAME")<string>(),
  changeWeightLifted: createStandardAction("liftlogentry/CHANGE_WEIGHTLIFTED")<
    string
  >(),
  startEdit: createStandardAction("liftlogentry/START_EDIT")<
    StoredLiftLogEntry
  >(),
  stopEdit: createStandardAction("liftlogentry/STOP_EDIT")(),
  addLogEntry,
  updateLogEntry,
  deleteLogEntry
};

export type NewEntryAction = ActionType<typeof actions>;
