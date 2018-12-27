import { AxiosError } from "axios";
import * as moment from "moment";
import { Dispatch } from "redux";
import LiftLogService from "../../services/LiftLogService";
import { LiftLogEntry } from "../../types/LiftTypes";
import { getSets2 } from "../../utils/LiftUtils";
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

export const addLogEntry = (logName: string) => (
  dispatch: Dispatch,
  getState: () => StoreState,
  liftLogService: LiftLogService
) => {
  const state = getState();
  const {
    numberOfSets,
    numberOfReps,
    customSets,
    inputMode
  } = state.dialogState;
  const newEntry: LiftLogEntry = {
    date: state.newEntryState.date || moment(),
    name: state.newEntryState.name,
    weightLifted: state.newEntryState.weightLifted || 0,
    // sets: getSets(this.props.liftLogReps),
    sets: getSets2(numberOfSets, numberOfReps, customSets, inputMode),
    comment: state.dialogState.comment,
    links: state.dialogState.links.filter(link => !!link.url)
  };

  dispatch(actions.addLogEntry.request(newEntry));

  return liftLogService
    .addEntry(logName, newEntry)
    .then(() => {
      dispatch(actions.addLogEntry.success());
    })
    .catch(() =>
      actions.addLogEntry.failure(
        `Error while adding entry for ${newEntry.name}`
      )
    );
};
