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
import { InputMode, LiftLogEntryReps } from "../types/LiftTypes";
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

  onInputModeChange: (inputMode: InputMode) => void;
  onLiftLogRepsChange: (index: number, newValue: string) => void;
  onAddCustomSet: () => void;
  onRemoveCustomSet: (index: number) => void;
  onNumberOfSetsChange: (newValue: string) => void;
  onNumberOfRepsChange: (newValue: string) => void;

  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
  onChangeLinkText: (index: number, newText: string) => void;
  onChangeLinkUrl: (index: number, newUrl: string) => void;
  onCommentChange: (newValue: string) => void;
};

type OwnProps = {
  disabled: boolean;
  onAddEntry: () => void;
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
          onInputModeChange={this.props.onInputModeChange}
          onLiftLogRepsChange={this.props.onLiftLogRepsChange}
          onAddCustomSet={this.props.onAddCustomSet}
          onRemoveCustomSet={this.props.onRemoveCustomSet}
          onNumberOfSetsChange={this.props.onNumberOfSetsChange}
          onNumberOfRepsChange={this.props.onNumberOfRepsChange}
          liftLogReps={liftLogReps}
          isOpen={addRepsModalIsOpen}
          close={this.props.closeDialog}
          onSave={this.addLogEntry}
          onAddLink={this.props.onAddLink}
          onRemoveLink={this.props.onRemoveLink}
          onChangeLinkText={this.props.onChangeLinkText}
          onChangeLinkUrl={this.props.onChangeLinkUrl}
          onCommentChange={this.props.onCommentChange}
        />
      </div>
    );
  }

  private canAddEntry = (name: string, weightLifted: number | null) =>
    name.length > 0 && weightLifted !== null;

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

  private addLogEntry = () => {
    this.props.onAddEntry();

    // TODO: Is this handled in the reducer?
    // reset liftLogReps and make sure the dialog is closed
    // const liftLogReps = this.getDefaultLogEntryReps();

    this.props.closeDialog();
  };
}

const mapStateToProps = (storeState: StoreState): StateProps => {
  return {
    addRepsModalIsOpen: storeState.dialogState.isOpen,
    date: storeState.newEntryState.date,
    name: storeState.newEntryState.name,
    weightLifted: storeState.newEntryState.weightLifted,
    weightLiftedStringValue: storeState.newEntryState.weightLiftedString,
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
    closeDialog: () => dispatch(dialogActions.close()),

    onInputModeChange: (inputMode: InputMode) =>
      dispatch(dialogActions.setInputMode(inputMode)),
    onLiftLogRepsChange: (index: number, newValue: string) =>
      dispatch(dialogActions.changeCustomSet({ index, value: newValue })),
    onAddCustomSet: () => dispatch(dialogActions.addCustomSet()),
    onRemoveCustomSet: (index: number) =>
      dispatch(dialogActions.removeCustomSet(index)),
    onNumberOfSetsChange: (newValue: string) =>
      dispatch(dialogActions.setNumberOfSets(newValue)),
    onNumberOfRepsChange: (newValue: string) =>
      dispatch(dialogActions.setNumberOfReps(newValue)),

    onAddLink: () => dispatch(dialogActions.addLink()),
    onRemoveLink: (index: number) => dispatch(dialogActions.removeLink(index)),
    onChangeLinkText: (index: number, newText: string) =>
      dispatch(dialogActions.changeLinkText({ index, newText })),
    onChangeLinkUrl: (index: number, newUrl: string) =>
      dispatch(dialogActions.changeLinkUrl({ index, newUrl })),
    onCommentChange: (newValue: string) =>
      dispatch(dialogActions.changeComment(newValue))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddLogEntry);
