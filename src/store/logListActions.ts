import { LiftLogSummary } from "src/types/liftTypes";
import {
  ActionType,
  createAsyncAction,
  createStandardAction
} from "typesafe-actions";

const fetchLogs = createAsyncAction(
  "loglist/FETCH_START",
  "loglist/FETCH_SUCCESS",
  "loglist/FETCH_ERROR"
)<void, ReadonlyArray<LiftLogSummary>, string>();

const createLog = createAsyncAction(
  "loglist/CREATE_START",
  "loglist/CREATE_SUCCESS",
  "loglist/CREATE_ERROR"
)<void, void, string>();

const updateLog = createAsyncAction(
  "loglist/UPDATE_START",
  "loglist/UPDATE_SUCCESS",
  "loglist/UPDATE_ERROR"
)<void, void, string>();

const deleteLog = createAsyncAction(
  "loglist/DELETE_START",
  "loglist/DELETE_SUCCESS",
  "loglist/DELETE_ERROR"
)<void, void, string>();

export const actions = {
  changeNewLogName: createStandardAction("loglist/CHANGE_NEW_NAME")<string>(),
  changeNewLogTitle: createStandardAction("loglist/CHANGE_NEW_TITLE")<string>(),

  startEditLog: createStandardAction("loglist/START_EDIT")<LiftLogSummary>(),
  changeEditedTitle: createStandardAction("loglist/CHANGE_EDITED_TITLE")<
    string
  >(),
  cancelEditLog: createStandardAction("loglist/CANCEL_EDIT")(),

  confirmDeleteLog: createStandardAction("loglist/CONFIRM_DELETE")<
    LiftLogSummary
  >(),
  cancelDeleteLog: createStandardAction("loglist/CANCEL_DELETE")(),

  dismissError: createStandardAction("loglist/DISMISS_ERROR")(),

  fetchLogs,
  createLog,
  updateLog,
  deleteLog
};

export type LogListAction = ActionType<typeof actions>;
