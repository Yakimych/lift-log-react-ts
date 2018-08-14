import * as React from "react";
import { LiftLog } from "./../types/LiftTypes";
import "./App.css";
import LiftLogContainer from "./LiftLogContainer";

class App extends React.Component<any, LiftLog> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: `Loading board ${this.getBoardIdentifier(this.props)}...`,
      entries: []
    };
    this.state.entries.push({
      date: new Date("2018-01-01"),
      name: "Bob",
      weightLifted: 80,
      reps: Array(3).fill({ number: 5 })
    });
    this.state.entries.push({
      date: new Date("2018-01-02"),
      name: "Alice",
      weightLifted: 60,
      reps: [{ number: 5 }, { number: 5 }, { number: 3 }]
    });
  }

  public componentDidMount() {
    // TODO: Fetch name and entries from service
    this.setState({ ...this.state, name: "Bench Press: Road to 100" });
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            {this.state.name} (Board Id: {this.getBoardIdentifier(this.props)})
          </h1>
        </header>
        <LiftLogContainer entries={this.state.entries} />
      </div>
    );
  }

  private getBoardIdentifier = (props: any) =>
    props.location.pathname.substr(1);
}

export default App;
