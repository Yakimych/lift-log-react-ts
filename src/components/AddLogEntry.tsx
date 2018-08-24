import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LiftLogEntry, Set } from "../types/LiftTypes";
import "./AddLogEntry.css";
import AddReps from "./AddReps";

type Props = {
  onAddEntry: (entry: LiftLogEntry) => void;
};

type State = {
  name: string;
  date: moment.Moment;
  weightLifted: number;
  sets: Set[];
};

class AddLogEntry extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      date: moment(),
      name: "",
      weightLifted: 0,
      sets: [{ reps: 5 }, { reps: 5 }, { reps: 5 }]
    };
  }

  public render() {
    return (
      <div className="add-log-entry">
        <div className="row">
          <div className="col">
            <DatePicker
              dateFormat="YYYY-MM-DD"
              selected={this.state.date}
              onChange={this.handleDateChanged}
              className="form-control form-control-sm log-entry-input"
            />
          </div>
          <div className="col">
            <input
              className="form-control form-control-sm log-entry-input"
              type="text"
              placeholder="Name"
              maxLength={50}
              onBlur={this.handleNameChanged}
            />
          </div>
          <div className="col">
            <input
              className="form-control form-control-sm log-entry-input"
              type="text"
              placeholder="Weight"
              onBlur={this.handleWeigthLiftedChanged}
            />
          </div>
          <div className="col">
            <AddReps onValueChange={this.handleRepsChanged} />
          </div>
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

  private handleDateChanged = (date: moment.Moment | null) => {
    if (date !== null) {
      this.setState({ date });
    }
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

  private handleRepsChanged = (sets: Set[]) => this.setState({ sets });

  private addLogEntry = () => {
    const newEntry: LiftLogEntry = {
      date: this.state.date.toDate(),
      name: this.state.name,
      weightLifted: this.state.weightLifted,
      sets: this.state.sets
    };

    this.props.onAddEntry(newEntry);
  };
}

export default AddLogEntry;
