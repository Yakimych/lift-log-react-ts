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
  constructor(props: RouteProps) {
    super(props);
    this.state = {
      headerText: `Loading board ${this.getBoardIdentifier(this.props)}...`,
      logEntries: []
    };
  }

  public componentDidMount() {
    const liftLogService = new LiftLogService();
    const boardIdentifier = this.getBoardIdentifier(this.props);
    liftLogService.getLiftLog(boardIdentifier).then(liftLog =>
      this.setState({
        ...this.state,
        headerText: liftLog.title,
        logEntries: liftLog.entries
      })
    );
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.state.headerText}</h1>
        </header>
        <LiftLogContainer entries={this.state.logEntries} />
      </div>
    );
  }

  private getBoardIdentifier = (props: RouteProps) => {
    if (!!props.location) {
      return props.location.pathname.substr(1);
    }
    return "";
  };
}

export default App;
