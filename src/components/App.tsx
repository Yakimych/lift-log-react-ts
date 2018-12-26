import { AxiosError } from "axios";
import * as React from "react";
import { RouteProps } from "react-router-dom";
import LiftLogService from "./../services/LiftLogService";
import { LiftLogEntry } from "./../types/LiftTypes";
import "./App.css";
import LiftLogContainer from "./LiftLogContainer";

type Props = {
  isLoading: true;
  loadingMessage: string;
  networkErrorOccurred: true;
  errorMessage: string;
  logTitle?: string;
  logEntries: LiftLogEntry[];
} & RouteProps;

class App extends React.Component<Props> {
  private readonly liftLogService = new LiftLogService();
  private readonly logName: string;

  constructor(props: Props) {
    super(props);
    this.logName = this.getLogNameFromRoute(props);
  }

  public componentDidMount() {
    this.reloadLifts();
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.getHeaderText(this.props)}</h1>
        </header>
        <LiftLogContainer
          disabled={this.props.isLoading || this.props.networkErrorOccurred}
          entries={this.props.logEntries}
          onAddEntry={(entry: LiftLogEntry) => this.handleAddEntry(entry)}
        />
      </div>
    );
  }

  private getHeaderText(props: Props): string {
    if (props.isLoading) {
      return props.loadingMessage;
    } else if (props.networkErrorOccurred) {
      return props.errorMessage;
    } else {
      return props.logTitle || "";
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
