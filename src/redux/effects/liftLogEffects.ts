import { AxiosError } from "axios";
import { Dispatch } from "redux";
import LiftLogService from "../../services/LiftLogService";
import { StoreState } from "../storeState";

export const reloadLifts = (logName: string) => (
  dispatch: Dispatch,
  getState: () => StoreState,
  liftLogService: LiftLogService
) => {
  return liftLogService
    .getLiftLog(logName)
    .then(
      liftLog => {
        // tslint:disable-next-line:no-console
        console.log("received API call response");
      }
      // this.setState({
      //   isLoading: false,
      //   networkErrorOccurred: false,
      //   logTitle: liftLog.title,
      //   logEntries: liftLog.entries
      // })
    )
    .catch((error: AxiosError) => {
      // const errorMessage = this.getErrorMessage(error);
      // this.setState({
      //   isLoading: false,
      //   networkErrorOccurred: true,
      //   errorMessage,
      //   logEntries: []
      // });
    });
};
