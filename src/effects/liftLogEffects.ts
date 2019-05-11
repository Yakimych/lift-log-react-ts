import { AxiosError } from "axios";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import LiftLogService from "../services/liftLogService";
import { fetchLiftLogActions, LiftLogAction } from "../store/liftLogActions";
import { AppState } from "../store/types";

const getErrorMessage = (error: AxiosError, logName: string) =>
  !!error.response && error.response.status === 404
    ? `Board ${logName} does not exist`
    : `An unexpected network error has occured`;

export const reloadLifts = (
  logName: string
): ThunkAction<void, AppState, LiftLogService, LiftLogAction> => (
  dispatch: ThunkDispatch<AppState, LiftLogService, LiftLogAction>,
  getState: () => AppState,
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
