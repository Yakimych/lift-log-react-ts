import { LiftLog } from "src/types/LiftTypes";
import { ActionType, createAsyncAction } from "typesafe-actions";

export const fetchLiftLogActions = createAsyncAction(
  "liftlog/FETCH_START",
  "liftlog/FETCH_SUCCESS",
  "liftlog/FETCH_ERROR"
)<void, LiftLog, string>();

export type LiftLogAction = ActionType<typeof fetchLiftLogActions>;
