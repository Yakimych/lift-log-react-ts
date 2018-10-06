import { AxiosError } from "axios";
import * as React from "react";
import { RouteProps } from "react-router-dom";
import LiftLogService from "./../services/LiftLogService";
import { LiftLogEntry } from "./../types/LiftTypes";
import "./App.css";
import LiftLogContainer from "./LiftLogContainer";

type LoadingState = {
  isLoading: true;
};

type ErrorState = {
  isLoading: false;
  networkErrorOccured: true;
  errorMessage: string;
};

type SuccessState = {
  isLoading: false;
  networkErrorOccured: false;
  headerText: string;
  logEntries: LiftLogEntry[];
};

type State = StrictUnion<LoadingState | ErrorState | SuccessState>;

class App extends React.Component<RouteProps, State> {
  private readonly liftLogService = new LiftLogService();
  private readonly logName: string;

  constructor(props: RouteProps) {
    super(props);
    this.logName = this.getLogNameFromRoute(props);
    this.state = {
      isLoading: true
    };
  }

  public componentDidMount() {
    this.reloadLifts();
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            {this.getHeaderText(this.state, this.logName)}
          </h1>
        </header>
        {this.state.isLoading || this.state.networkErrorOccured ? null : (
          <LiftLogContainer
            entries={this.state.logEntries}
            onAddEntry={(entry: LiftLogEntry) => this.handleAddEntry(entry)}
          />
        )}
      </div>
    );
  }

  private getHeaderText(state: State, logName: string) {
    if (state.isLoading) {
      return `Loading board ${logName}...`;
    } else if (state.networkErrorOccured) {
      return state.errorMessage;
    } else {
      return state.headerText;
    }
  }

  private getErrorMessage = (error: AxiosError) =>
    !!error.response && error.response.status === 404
      ? `Board ${this.logName} does not exist`
      : `An unexpected network error has occured`;

  private reloadLifts() {
    this.liftLogService
      .getLiftLog(this.logName)
      .then(liftLog =>
        this.setState({
          isLoading: false,
          networkErrorOccured: false,
          headerText: liftLog.title,
          logEntries: liftLog.entries
        })
      )
      .catch((error: AxiosError) => {
        const errorMessage = this.getErrorMessage(error);
        this.setState({
          isLoading: false,
          networkErrorOccured: true,
          errorMessage
        });
      });
  }

  private handleAddEntry = (entry: LiftLogEntry) =>
    this.liftLogService
      .addEntry(this.logName, entry)
      .then(() => this.reloadLifts());

  private getLogNameFromRoute = (props: RouteProps) =>
    !!props.location ? props.location.pathname.substr(1) : "";
}

export default App;
