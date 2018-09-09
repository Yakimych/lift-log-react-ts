import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "reactstrap";
import {
  InputMode,
  LiftLogEntry,
  LiftLogEntryReps,
  Set
} from "../types/LiftTypes";
import {
  DEFAULT_REP_VALUE,
  DEFAULT_SET_VALUE,
  formatRepsSets,
  getSets
} from "../utils/LiftUtils";
import "./AddLogEntry.css";
import AddRepsModal from "./AddRepsModal";

type Props = {
  onAddEntry: (entry: LiftLogEntry) => void;
};

type State = {
  name: string;
  date: moment.Moment;
  weightLifted: number;
  addRepsModalIsOpen: boolean;
  liftLogReps: LiftLogEntryReps;
  liftLogRepsUnderEdit: LiftLogEntryReps;
};

class AddLogEntry extends React.Component<Props, State> {
  public state = this.getDefaultState();
  public render() {
    const {
      date,
      addRepsModalIsOpen,
      liftLogRepsUnderEdit,
      liftLogReps
    } = this.state;

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
            <span className="mr-2">{formatRepsSets(liftLogReps)}</span>
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
          onLiftLogRepsChange={this.handleLiftLogRepsChanged}
          liftLogReps={liftLogRepsUnderEdit}
          isOpen={addRepsModalIsOpen}
          toggle={this.toggleAddRepsModal}
          onSave={this.saveRepsChanges}
        />
      </div>
    );
  }

  private getDefaultSets() {
    return Array<Set>(DEFAULT_SET_VALUE).fill({ reps: DEFAULT_REP_VALUE });
  }
  private getDefaultState() {
    const liftLogReps: LiftLogEntryReps = {
      mode: InputMode.SetsReps,
      numberOfReps: DEFAULT_REP_VALUE,
      numberOfSets: DEFAULT_SET_VALUE,
      customSets: this.getDefaultSets(),
      links: [],
      comment: ""
    };
    return {
      date: moment(),
      name: "",
      weightLifted: 0,
      liftLogReps,
      liftLogRepsUnderEdit: { ...liftLogReps },
      addRepsModalIsOpen: false
    };
  }

  private toggleAddRepsModal = () => {
    this.setState((prevState: State) => ({
      addRepsModalIsOpen: !prevState.addRepsModalIsOpen,
      liftLogRepsUnderEdit: { ...prevState.liftLogReps }
    }));
  };

  private saveRepsChanges = () => {
    this.setState((prevState: State) => ({
      liftLogReps: { ...prevState.liftLogRepsUnderEdit },
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

  private handleLiftLogRepsChanged = (liftLogReps: LiftLogEntryReps) =>
    this.setState(prevState => ({
      liftLogRepsUnderEdit: {
        ...prevState.liftLogRepsUnderEdit,
        ...liftLogReps
      }
    }));

  private addLogEntry = () => {
    const { comment, links } = this.state.liftLogReps;

    const newEntry: LiftLogEntry = {
      date: this.state.date.toDate(),
      name: this.state.name,
      weightLifted: this.state.weightLifted,
      sets: getSets(this.state.liftLogReps),
      comment,
      links: links.filter(link => !!link.url)
    };

    this.props.onAddEntry(newEntry);

    // reset state after the entry has been added.
    this.setState(this.getDefaultState());
  };
}

export default AddLogEntry;
