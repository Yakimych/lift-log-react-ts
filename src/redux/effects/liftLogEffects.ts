import { AxiosError } from "axios";
import * as moment from "moment";
import { Dispatch } from "redux";
import LiftLogService from "../../services/LiftLogService";
import { LiftLogEntry, SetsRepsInput } from "../../types/LiftTypes";
import { getSets } from "../../utils/LiftUtils";
import { fetchLiftLogActions } from "../liftLogActions";
import { actions } from "../newEntryActions";
import { StoreState } from "../storeState";

const getErrorMessage = (error: AxiosError, logName: string) =>
  !!error.response && error.response.status === 404
    ? `Board ${logName} does not exist`
    : `An unexpected network error has occured`;

export const reloadLifts = (logName: string) => (
  dispatch: Dispatch,
  getState: () => StoreState,
  liftLogService: LiftLogService
) => {
  dispatch(fetchLiftLogActions.request());
  return liftLogService
    .getLiftLog(logName)
    .then(liftLog => dispatch(fetchLiftLogActions.success(liftLog)))
    .catch((error: AxiosError) =>
      dispatch(fetchLiftLogActions.failure(getErrorMessage(error, logName)))
    );
};

export const addLogEntry = (logName: string) => (
  dispatch: Dispatch,
  getState: () => StoreState,
  liftLogService: LiftLogService
) => {
  const state = getState();

  const setsRepsInput: SetsRepsInput = {
    mode: state.dialogState.inputMode,
    numberOfSets: state.dialogState.numberOfSets,
    numberOfReps: state.dialogState.numberOfReps,
    customSetsStrings: state.dialogState.customSetsStrings
  };

  const newEntry: LiftLogEntry = {
    date: state.newEntryState.date || moment(),
    name: state.newEntryState.name,
    weightLifted: state.newEntryState.weightLifted,
    sets: getSets(setsRepsInput),
    comment: state.dialogState.comment,
    links: state.dialogState.links.filter(link => !!link.url)
  };

  dispatch(actions.addLogEntry.request(newEntry));

  return liftLogService
    .addEntry(logName, newEntry)
    .then(() => dispatch(actions.addLogEntry.success()))
    .catch(() =>
      actions.addLogEntry.failure(
        `Error while adding entry for ${newEntry.name}`
      )
    );
};
