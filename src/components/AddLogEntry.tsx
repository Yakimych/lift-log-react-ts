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
};

class AddLogEntry extends React.Component<Props, State> {
  public state = this.getDefaultState();
  public render() {
    const { date, addRepsModalIsOpen, liftLogReps } = this.state;

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
              Add
            </Button>
          </div>
        </div>
        <AddRepsModal
          onLiftLogRepsChange={this.handleLiftLogRepsChanged}
          liftLogReps={liftLogReps}
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

  private getDefaultLogEntryReps(): LiftLogEntryReps {
    return {
      mode: InputMode.SetsReps,
      numberOfReps: DEFAULT_REP_VALUE,
      numberOfSets: DEFAULT_SET_VALUE,
      customSets: this.getDefaultSets(),
      links: [],
      comment: ""
    };
  }

  private getDefaultState(): State {
    const liftLogReps = this.getDefaultLogEntryReps();
    return {
      date: moment(),
      name: "",
      weightLifted: 0,
      liftLogReps,
      addRepsModalIsOpen: false
    };
  }

  private toggleAddRepsModal = () => {
    this.setState((prevState: State) => ({
      addRepsModalIsOpen: !prevState.addRepsModalIsOpen
    }));
  };

  private saveRepsChanges = () => {
    this.setState(
      (prevState: State) => ({
        addRepsModalIsOpen: false
      }),
      this.addLogEntry
    );
    // this.setState({ })
    // liftLogReps: this.getDefaultLogEntryReps(),
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

  private handleLiftLogRepsChanged = (liftLogReps: Partial<LiftLogEntryReps>) =>
    this.setState((prevState: State) => ({
      liftLogReps: { ...prevState.liftLogReps, ...liftLogReps }
    }));

  private addLogEntry = () => {
    const { comment, links } = this.state.liftLogReps;

    const newEntry: LiftLogEntry = {
      date: this.state.date,
      name: this.state.name,
      weightLifted: this.state.weightLifted,
      sets: getSets(this.state.liftLogReps),
      comment,
      links: links.filter(link => !!link.url)
    };

    this.props.onAddEntry(newEntry);

    // reset liftLogReps and make sure the dialog is closed
    const liftLogReps = this.getDefaultLogEntryReps();
    this.setState({
      liftLogReps,
      addRepsModalIsOpen: false
    });
  };
}

export default AddLogEntry;
