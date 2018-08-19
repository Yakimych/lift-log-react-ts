import * as React from "react";
import { LiftLogEntry } from "../types/LiftTypes";
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
            <input type="text" placeholder="Date" />
          </span>
          <span className="col">
            <input type="text" placeholder="Name" />
          </span>
          <span className="col">
            <input type="text" placeholder="Weight" />
          </span>
          <span className="col">
            <input type="text" placeholder="Reps" />
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

  private addLogEntry() {
    this.props.onAddEntry({
      date: new Date(),
      name: "Test",
      weightLifted: 1,
      reps: [{ number: 5 }]
    });
  }
}

export default AddLogEntry;
