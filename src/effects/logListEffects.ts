import { AxiosError } from "axios";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import LiftLogService from "../services/liftLogService";
import { actions, LogListAction } from "../store/logListActions";
import { AppState } from "../store/types";

type LogListThunk = ThunkAction<
  Promise<any>,
  AppState,
  LiftLogService,
  LogListAction
>;

type LogListDispatch = ThunkDispatch<AppState, LiftLogService, LogListAction>;

const getErrorMessage = (error: AxiosError, fallback: string): string => {
  const data = error.response && error.response.data;
  return typeof data === "string" && data.length > 0 ? data : fallback;
};

export const loadLogs = (): LogListThunk => (
  dispatch: LogListDispatch,
  _getState: () => AppState,
  liftLogService: LiftLogService
) => {
  dispatch(actions.fetchLogs.request());

  return liftLogService
    .getLiftLogs()
    .then(logs => dispatch(actions.fetchLogs.success(logs)))
    .catch(() =>
      dispatch(actions.fetchLogs.failure("Could not load the list of logs"))
    );
};

export const createLog = (): LogListThunk => (
  dispatch: LogListDispatch,
  getState: () => AppState,
  liftLogService: LiftLogService
) => {
  const { newLogName, newLogTitle } = getState().logListState;
  const name = newLogName.trim();
  const title = newLogTitle.trim();

  dispatch(actions.createLog.request());

  return liftLogService
    .createLiftLog(name, title)
    .then(() => {
      dispatch(actions.createLog.success());
      return dispatch(loadLogs());
    })
    .catch((error: AxiosError) =>
      dispatch(
        actions.createLog.failure(
          getErrorMessage(error, `Could not create the log ${name}`)
        )
      )
    );
};

export const saveLogTitle = (): LogListThunk => (
  dispatch: LogListDispatch,
  getState: () => AppState,
  liftLogService: LiftLogService
) => {
  const { editedLogName, editedLogTitle } = getState().logListState;
  if (editedLogName === null) {
    return Promise.resolve();
  }

  dispatch(actions.updateLog.request());

  return liftLogService
    .updateLiftLog(editedLogName, editedLogTitle.trim())
    .then(() => {
      dispatch(actions.updateLog.success());
      return dispatch(loadLogs());
    })
    .catch((error: AxiosError) =>
      dispatch(
        actions.updateLog.failure(
          getErrorMessage(error, `Could not rename the log ${editedLogName}`)
        )
      )
    );
};

export const deleteLog = (): LogListThunk => (
  dispatch: LogListDispatch,
  getState: () => AppState,
  liftLogService: LiftLogService
) => {
  const logPendingDeletion = getState().logListState.logPendingDeletion;
  if (logPendingDeletion === null) {
    return Promise.resolve();
  }

  const { name } = logPendingDeletion;
  dispatch(actions.deleteLog.request());

  return liftLogService
    .deleteLiftLog(name)
    .then(() => {
      dispatch(actions.deleteLog.success());
      return dispatch(loadLogs());
    })
    .catch((error: AxiosError) =>
      dispatch(
        actions.deleteLog.failure(
          getErrorMessage(error, `Could not delete the log ${name}`)
        )
      )
    );
};
