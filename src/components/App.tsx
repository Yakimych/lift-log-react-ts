import { AxiosError } from "axios";
import * as React from "react";
import { RouteProps } from "react-router-dom";
import LiftLogService from "./../services/LiftLogService";
import { LiftLogEntry } from "./../types/LiftTypes";
import "./App.css";
import LiftLogContainer from "./LiftLogContainer";

type LoadingState = {
  isLoading: true;
  loadingMessage: string;
};

type ErrorState = {
  isLoading: false;
  networkErrorOccurred: true;
  errorMessage: string;
};

type SuccessState = {
  isLoading: false;
  networkErrorOccurred: false;
};

// This has become rather verbose...
type State = (LoadingState | ErrorState | SuccessState) & {
  logTitle?: string;
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
      loadingMessage: `Loading board ${this.logName}...`,
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
          <h1 className="App-title">{this.getHeaderText(this.state)}</h1>
        </header>
        <LiftLogContainer
          disabled={this.state.isLoading || this.state.networkErrorOccurred}
          entries={this.state.logEntries}
          onAddEntry={(entry: LiftLogEntry) => this.handleAddEntry(entry)}
        />
      </div>
    );
  }

  private getHeaderText(state: State): string {
    if (state.isLoading) {
      return state.loadingMessage;
    } else if (state.networkErrorOccurred) {
      return state.errorMessage;
    } else {
      return state.logTitle || "";
    }
  }

  private getErrorMessage = (error: AxiosError) =>
    !!error.response && error.response.status === 404
      ? `Board ${this.logName} does not exist`
      : `An unexpected network error has occured`;

  private reloadLifts = () =>
    this.liftLogService
      .getLiftLog(this.logName)
      .then(liftLog =>
        this.setState({
          isLoading: false,
          networkErrorOccurred: false,
          logTitle: liftLog.title,
          logEntries: liftLog.entries
        })
      )
      .catch((error: AxiosError) => {
        const errorMessage = this.getErrorMessage(error);
        this.setState({
          isLoading: false,
          networkErrorOccurred: true,
          errorMessage,
          logEntries: []
        });
      });

  private async handleAddEntry(entry: LiftLogEntry) {
    this.setState(prevState => ({
      ...prevState,
      isLoading: true,
      loadingMessage: `Adding entry for ${entry.name}...`
    }));

    try {
      await this.liftLogService.addEntry(this.logName, entry);
      await this.reloadLifts();
    } catch (error) {
      this.setState(prevState => ({
        ...prevState,
        isLoading: false,
        networkErrorOccurred: true,
        errorMessage: `Error while adding entry for ${entry.name}`
      }));
    }
  }

  private getLogNameFromRoute = (props: RouteProps) =>
    !!props.location ? props.location.pathname.substr(1) : "";
}

export default App;
