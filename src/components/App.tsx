import { AxiosError } from "axios";
import * as React from "react";
import { RouteProps } from "react-router-dom";
import LiftLogService from "./../services/LiftLogService";
import { LiftLogEntry } from "./../types/LiftTypes";
import "./App.css";
import LiftLogContainer from "./LiftLogContainer";

type State = {
  isLoading: boolean;
  networkErrorOccured: boolean;
  // TODO: DU?
  errorMessage: string;
  headerText: string;
  logEntries: LiftLogEntry[];
};

class App extends React.Component<RouteProps, State> {
  private readonly liftLogService = new LiftLogService();
  private readonly logName: string;

  constructor(props: RouteProps) {
    super(props);
    this.logName = this.getLogNameFromRoute(props);
    this.state = {
      isLoading: true,
      networkErrorOccured: false,
      errorMessage: "",
      headerText: `Loading board ${this.logName}...`,
      logEntries: []
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
            {this.state.networkErrorOccured
              ? this.state.errorMessage
              : this.state.headerText}
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

  private reloadLifts() {
    this.liftLogService
      .getLiftLog(this.logName)
      .then(liftLog =>
        this.setState({
          ...this.state,
          isLoading: false,
          networkErrorOccured: false,
          headerText: liftLog.title,
          logEntries: liftLog.entries
        })
      )
      .catch((error: AxiosError) => {
        this.setState({
          ...this.state,
          isLoading: false,
          networkErrorOccured: true
        });
        if (!!error.response && error.response.status === 404) {
          this.setState({
            errorMessage: `Board ${this.logName} does not exist`
          });
        } else {
          this.setState({
            errorMessage: `An unexpected network error has occured`
          });
        }
      });
  }

  private handleAddEntry = (entry: LiftLogEntry) => {
    this.liftLogService
      .addEntry(this.logName, entry)
      .then(() => this.reloadLifts());
  };

  private getLogNameFromRoute = (props: RouteProps) => {
    if (!!props.location) {
      return props.location.pathname.substr(1);
    }
    return "";
  };
}

export default App;
