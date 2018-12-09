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
import { toValidFloatOrNull } from "../utils/NumberUtils";
import "./AddLogEntry.css";
import AddRepsModal from "./AddRepsModal";

type Props = {
  disabled: boolean;
  onAddEntry: (entry: LiftLogEntry) => void;
};

type State = {
  name: string;
  date: moment.Moment;
  weightLifted: number | null;
  weightLiftedStringValue: string;
  addRepsModalIsOpen: boolean;
  liftLogReps: LiftLogEntryReps;
};

class AddLogEntry extends React.Component<Props, State> {
  public state = this.getDefaultState();
  public render() {
    const {
      date,
      addRepsModalIsOpen,
      liftLogReps,
      name,
      weightLifted
    } = this.state;

    return (
      <div className="add-log-entry">
        <div className="row">
          <div className="col">
            <DatePicker
              disabled={this.props.disabled}
              dateFormat="YYYY-MM-DD"
              selected={date}
              onChange={this.handleDateChanged}
              className="form-control form-control-sm log-entry-input"
            />
          </div>
          <div className="col">
            <input
              disabled={this.props.disabled}
              className="form-control form-control-sm log-entry-input"
              type="text"
              placeholder="Name"
              maxLength={50}
              value={name}
              onChange={this.handleNameChanged}
            />
          </div>
          <div className="col">
            <input
              disabled={this.props.disabled}
              className="form-control form-control-sm log-entry-input"
              type="text"
              placeholder="Weight"
              value={this.state.weightLiftedStringValue}
              onChange={this.handleWeightLiftedChanged}
            />
          </div>
          <div className="col d-flex align-items-center">
            <span className="mr-2">{formatRepsSets(liftLogReps)}</span>
            <Button
              disabled={
                this.props.disabled || !this.canAddEntry(name, weightLifted)
              }
              size="sm"
              color="primary"
              onClick={this.toggleAddRepsModal}
            >
              Add
            </Button>
          </div>
        </div>
        <AddRepsModal
          onLiftLogRepsChange={this.handleLiftLogRepsChanged}
          liftLogReps={liftLogReps}
          isOpen={addRepsModalIsOpen}
          toggle={this.toggleAddRepsModal}
          onSave={this.addLogEntry}
        />
      </div>
    );
  }

  private canAddEntry = (name: string, weightLifted: number | null) =>
    name.length > 0 && weightLifted !== null;

  private getDefaultSets() {
    return Array<Set>(DEFAULT_SET_VALUE).fill({
      reps: DEFAULT_REP_VALUE,
      rpe: null
    });
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
      weightLifted: null,
      weightLiftedStringValue: "",
      liftLogReps,
      addRepsModalIsOpen: false
    };
  }

  private toggleAddRepsModal = () => {
    this.setState((prevState: State) => ({
      addRepsModalIsOpen: !prevState.addRepsModalIsOpen
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

  private handleWeightLiftedChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    this.setState({
      weightLiftedStringValue: value,
      weightLifted: toValidFloatOrNull(value)
    });
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
      weightLifted: this.state.weightLifted || 0,
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
