import * as React from "react";
import { LiftLogEntry } from "../types/LiftTypes";
import "./AddLogEntry.css";
import AddReps from "./AddReps";

type Props = {
  onAddEntry: (entry: LiftLogEntry) => void;
};

type State = {
  name: string;
  date: string;
  weightLifted: number;
  reps: number[];
};

class AddLogEntry extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      date: "",
      name: "",
      weightLifted: 0,
      reps: [5, 5, 5]
    };
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
        </div>
        <AddReps onValueChange={this.handleRepsChanged} />
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

  private handleRepsChanged = (reps: number[]) => this.setState({ reps });

  private addLogEntry = () => {
    const newEntry = {
      date: new Date(this.state.date),
      name: this.state.name,
      weightLifted: this.state.weightLifted,
      reps: this.state.reps.map(r => ({ number: r }))
    };

    this.props.onAddEntry(newEntry);
  };
}

export default AddLogEntry;
