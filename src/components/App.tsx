import * as React from "react";
import { RouteProps } from "react-router-dom";
import LiftLogService from "./../services/LiftLogService";
import { LiftLogEntry } from "./../types/LiftTypes";
import "./App.css";
import LiftLogContainer from "./LiftLogContainer";

type State = {
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
          <h1 className="App-title">{this.state.headerText}</h1>
        </header>
        <LiftLogContainer
          entries={this.state.logEntries}
          onAddEntry={(entry: LiftLogEntry) => this.handleAddEntry(entry)}
        />
      </div>
    );
  }

  private reloadLifts() {
    this.liftLogService.getLiftLog(this.logName).then(liftLog =>
      this.setState({
        ...this.state,
        headerText: liftLog.title,
        logEntries: liftLog.entries
      })
    );
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
