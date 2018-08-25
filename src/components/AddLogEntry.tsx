import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "reactstrap";
import { LiftLogEntry, Set } from "../types/LiftTypes";
import { formatSets } from "../utils/LiftUtils";
import "./AddLogEntry.css";
import AddRepsModal from "./AddRepsModal";

type Props = {
  onAddEntry: (entry: LiftLogEntry) => void;
};

type State = {
  name: string;
  date: moment.Moment;
  weightLifted: number;
  sets: Set[];
  setsUnderEdit: Set[];
  addRepsModalIsOpen: boolean;
};

class AddLogEntry extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      date: moment(),
      name: "",
      weightLifted: 0,
      sets: Array<Set>(3).fill({ reps: 5 }),
      setsUnderEdit: [],
      addRepsModalIsOpen: false
    };
  }

  public render() {
    const { date, sets, addRepsModalIsOpen } = this.state;
    return (
      <div className="add-log-entry">
        <div className="row">
          <div className="col">
            <DatePicker
              dateFormat="YYYY-MM-DD"
              selected={date}
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
          <div className="col d-flex align-items-center">
            <span className="mr-2">{formatSets(sets)}</span>
            <Button size="sm" color="primary" onClick={this.toggleAddRepsModal}>
              Edit
            </Button>
          </div>
        </div>
        <button
          className="btn btn-primary btn-add-entry"
          onClick={() => this.addLogEntry()}
        >
          Add
        </button>
        <AddRepsModal
          onValueChange={this.handleRepsChanged}
          initialSets={sets}
          isOpen={addRepsModalIsOpen}
          toggle={this.toggleAddRepsModal}
          onSave={this.saveRepsChanges}
        />
      </div>
    );
  }

  private toggleAddRepsModal = () => {
    this.setState((prevState: State) => ({
      addRepsModalIsOpen: !prevState.addRepsModalIsOpen,
      setsUnderEdit: prevState.sets.slice()
    }));
  };

  private saveRepsChanges = () => {
    this.setState((prevState: State) => ({
      sets: prevState.setsUnderEdit.slice(),
      addRepsModalIsOpen: false
    }));
  };

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

  private handleRepsChanged = (sets: Set[]) =>
    this.setState({ setsUnderEdit: sets });

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
