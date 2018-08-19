import * as React from "react";
import { LiftLogEntry, Rep } from "../types/LiftTypes";
import "./AddLogEntry.css";

type Props = {
  onAddEntry: (entry: LiftLogEntry) => void;
};

type State = {
  name: string;
  date: string;
  weightLifted: number;
  repsString: string;
};

class AddLogEntry extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { date: "", name: "", weightLifted: 0, repsString: "" };
  }

  public render() {
    return (
      <div className="add-log-entry">
        <div className="row">
          <span className="col">
            <input
              type="text"
              placeholder="Date"
              onBlur={this.handleDateChanged}
            />
          </span>
          <span className="col">
            <input
              type="text"
              placeholder="Name"
              maxLength={50}
              onBlur={this.handleNameChanged}
            />
          </span>
          <span className="col">
            <input
              type="text"
              placeholder="Weight"
              onBlur={this.handleWeigthLiftedChanged}
            />
          </span>
          <span className="col">
            <input
              type="text"
              placeholder="E.g. 3x5 or 5-5-4"
              onBlur={this.handleRepsChanged}
            />
          </span>
        </div>
        <button
          className="btn btn-primary btn-add-entry"
          onClick={() => this.addLogEntry()}
        >
          Add
        </button>
      </div>
    );
  }

  private handleDateChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    // validate date
    this.setState({ date: e.target.value });
  };

  private handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.target.value });
  };

  private handleWeigthLiftedChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // validate
    const weightLifted = Number(e.target.value);
    this.setState({ weightLifted });
  };

  private handleRepsChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    // validate
    this.setState({ repsString: e.target.value });
  };

  private parseReps(repsString: string): Rep[] {
    if (repsString.indexOf("x") !== -1) {
      const [sets, reps] = repsString.split("x");
      return Array(Number(sets)).fill({ number: Number(reps) });
    }

    const repsArray = repsString.split("-");
    return repsArray.map(r => ({ number: Number(r) }));
  }

  private addLogEntry = () => {
    const newEntry = {
      date: new Date(this.state.date),
      name: this.state.name,
      weightLifted: this.state.weightLifted,
      reps: this.parseReps(this.state.repsString)
    };

    this.props.onAddEntry(newEntry);
  };
}

export default AddLogEntry;