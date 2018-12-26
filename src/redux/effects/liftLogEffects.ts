import { AxiosError } from "axios";
import { Dispatch } from "redux";
import LiftLogService from "../../services/LiftLogService";
import { LiftLogEntry } from "../../types/LiftTypes";
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
    .then(
      liftLog => {
        // tslint:disable-next-line:no-console
        console.log("received API call response");
        dispatch(fetchLiftLogActions.success(liftLog));
      }
      // this.setState({
      //   isLoading: false,
      //   networkErrorOccurred: false,
      //   logTitle: liftLog.title,
      //   logEntries: liftLog.entries
      // })
    )
    .catch((error: AxiosError) => {
      dispatch(fetchLiftLogActions.failure(getErrorMessage(error, logName)));

      // const errorMessage = this.getErrorMessage(error);
      // this.setState({
      //   isLoading: false,
      //   networkErrorOccurred: true,
      //   errorMessage,
      //   logEntries: []
      // });
    });
};

export const addLogEntry = (logName: string, entry: LiftLogEntry) => (
  dispatch: Dispatch,
  getState: () => StoreState,
  liftLogService: LiftLogService
) => {
  dispatch(actions.addLogEntry.request(entry));

  return liftLogService
    .addEntry(logName, entry)
    .then(() => {
      dispatch(actions.addLogEntry.success());
    })
    .catch(() =>
      actions.addLogEntry.failure(`Error while adding entry for ${entry.name}`)
    );
};
