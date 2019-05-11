import * as moment from "moment";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import LiftLogService from "../services/liftLogService";
import { actions as dialogActions, DialogAction } from "../store/dialogActions";
import { actions, NewEntryAction } from "../store/newEntryActions";
import { AppState } from "../store/types";
import { LiftLogEntry, SetsReps } from "../types/liftTypes";
import { getSets } from "../utils/liftUtils";

export const addLogEntry = (
  logName: string
): ThunkAction<
  Promise<any>,
  AppState,
  LiftLogService,
  NewEntryAction | DialogAction
> => (
  dispatch: ThunkDispatch<
    AppState,
    LiftLogService,
    NewEntryAction | DialogAction
  >,
  getState: () => AppState,
  liftLogService: LiftLogService
) => {
  const state = getState();

  const setsReps: SetsReps = {
    mode: state.dialogState.inputMode,
    numberOfSets: state.dialogState.numberOfSets,
    numberOfReps: state.dialogState.numberOfReps,
    customSetsStrings: state.dialogState.customSetsStrings
  };

  const newEntry: LiftLogEntry = {
    date: state.newEntryState.date || moment(),
    name: state.newEntryState.name,
    weightLifted: state.newEntryState.weightLifted,
    sets: getSets(setsReps),
    comment: state.dialogState.comment,
    links: state.dialogState.links.filter(link => !!link.url)
  };

  dispatch(actions.addLogEntry.request(newEntry));

  return liftLogService
    .addEntry(logName, newEntry)
    .then(() => {
      dispatch(actions.addLogEntry.success());
      dispatch(dialogActions.reset());
    })
    .catch(() =>
      actions.addLogEntry.failure(
        `Error while adding entry for ${newEntry.name}`
      )
    );
};
