import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { Dispatch } from "redux";
import { actions as dialogActions } from "../redux/dialogActions";
import { actions as newEntryActions } from "../redux/newEntryActions";
import { StoreState } from "../redux/storeState";
import { LiftLogEntry, LiftLogEntryReps } from "../types/LiftTypes";
import { formatRepsSets } from "../utils/LiftUtils";
import "./AddLogEntry.css";
import AddRepsModal from "./AddRepsModal";

type StateProps = {
  name: string;
  date: moment.Moment | null;
  weightLifted: number | null;
  weightLiftedStringValue: string;
  addRepsModalIsOpen: boolean;
  liftLogReps: LiftLogEntryReps;
};

type DispatchProps = {
  changeName: (name: string) => void;
  changeDate: (dateString: moment.Moment | null) => void;
  changeWeightLifted: (weightLiftedString: string) => void;
  openDialog: () => void;
  closeDialog: () => void;
};

type OwnProps = {
  disabled: boolean;
  onAddEntry: (entry: LiftLogEntry) => void;
};

type Props = StateProps & DispatchProps & OwnProps;

class AddLogEntry extends React.Component<Props> {
  // public state = this.getDefaultState();
  public render() {
    const {
      date,
      addRepsModalIsOpen,
      liftLogReps,
      name,
      weightLifted
    } = this.props;

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
              value={this.props.weightLiftedStringValue}
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
              onClick={this.props.openDialog}
            >
              Add
            </Button>
          </div>
        </div>
        <AddRepsModal
          onLiftLogRepsChange={this.props.handleLiftLogRepsChanged}
          liftLogReps={liftLogReps}
          isOpen={addRepsModalIsOpen}
          close={this.props.closeDialog}
          onSave={this.props.addLogEntry}
        />
      </div>
    );
  }

  private canAddEntry = (name: string, weightLifted: number | null) =>
    name.length > 0 && weightLifted !== null;

  // TODO: Remove
  // private getDefaultSets() {
  //   return Array<Set>(DEFAULT_SET_VALUE).fill({
  //     reps: DEFAULT_REP_VALUE,
  //     rpe: null
  //   });
  // }

  // TODO: Remove
  // private getDefaultLogEntryReps(): LiftLogEntryReps {
  //   return {
  //     mode: InputMode.SetsReps,
  //     numberOfReps: DEFAULT_REP_VALUE,
  //     numberOfSets: DEFAULT_SET_VALUE,
  //     customSets: this.getDefaultSets(),
  //     links: [],
  //     comment: ""
  //   };
  // }

  // private toggleAddRepsModal = () => {
  //   this.setState((prevState: State) => ({
  //     addRepsModalIsOpen: !prevState.addRepsModalIsOpen
  //   }));
  // };

  private handleDateChanged = (date: moment.Moment | null) => {
    this.props.changeDate(date);
  };

  private handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.changeName(e.target.value);
  };

  private handleWeightLiftedChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.changeWeightLifted(e.target.value);
    // this.setState({
    //   weightLiftedStringValue: value,
    //   weightLifted: toValidFloatOrNull(value)
    // });
  };

  // private handleLiftLogRepsChanged = (liftLogReps: Partial<LiftLogEntryReps>) =>
  //   this.setState((prevState: State) => ({
  //     liftLogReps: { ...prevState.liftLogReps, ...liftLogReps }
  //   }));

  // private addLogEntry = () => {
  //   const { comment, links } = this.props.liftLogReps;

  //   const newEntry: LiftLogEntry = {
  //     date: this.props.date,
  //     name: this.props.name,
  //     weightLifted: this.props.weightLifted || 0,
  //     sets: getSets(this.props.liftLogReps),
  //     comment,
  //     links: links.filter(link => !!link.url)
  //   };

  //   this.props.onAddEntry(newEntry);

  //   // reset liftLogReps and make sure the dialog is closed
  //   const liftLogReps = this.getDefaultLogEntryReps();
  //   this.setState({
  //     liftLogReps,
  //     addRepsModalIsOpen: false
  //   });
  // };
}

const mapStateToProps = (storeState: StoreState): StateProps => {
  return {
    addRepsModalIsOpen: storeState.dialogState.isOpen,
    date: storeState.newEntry.date,
    name: storeState.newEntry.name,
    weightLifted: storeState.newEntry.weightLifted,
    weightLiftedStringValue: storeState.newEntry.weightLiftedString,
    liftLogReps: {
      mode: storeState.dialogState.inputMode,
      // TODO: Model optionals correctly
      numberOfSets: storeState.dialogState.numberOfSets || 0,
      numberOfReps: storeState.dialogState.numberOfReps || 0,
      customSets: storeState.dialogState.customSets || [],
      comment: storeState.dialogState.comment,
      links: storeState.dialogState.links
    }
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    changeName: (newName: string) =>
      dispatch(newEntryActions.changeName(newName)),
    changeDate: (newDate: moment.Moment | null) =>
      dispatch(newEntryActions.changeDate(newDate)),
    changeWeightLifted: (newWeightLiftedString: string) =>
      dispatch(newEntryActions.changeWeightLifted(newWeightLiftedString)),
    openDialog: () => dispatch(dialogActions.open()),
    closeDialog: () => dispatch(dialogActions.close())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddLogEntry);
