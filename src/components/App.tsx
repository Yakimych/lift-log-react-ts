import * as React from "react";
import { RouteProps } from "react-router-dom";
import LiftLogService from "./../services/LiftLogService";
import { LiftLog } from "./../types/LiftTypes";
import "./App.css";
import LiftLogContainer from "./LiftLogContainer";

class App extends React.Component<RouteProps, LiftLog> {
  constructor(props: RouteProps) {
    super(props);
    this.state = {
      name: `Loading board ${this.getBoardIdentifier(this.props)}...`,
      entries: []
    };
  }

  public componentDidMount() {
    const liftLogService = new LiftLogService();
    const boardIdentifier = this.getBoardIdentifier(this.props);
    liftLogService.getLiftLog(boardIdentifier).then(liftLog =>
      this.setState({
        ...this.state,
        name: liftLog.name,
        entries: liftLog.entries
      })
    );
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.state.name}</h1>
        </header>
        <LiftLogContainer entries={this.state.entries} />
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
