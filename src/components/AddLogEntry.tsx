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
  commentIsShown: boolean;
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
  onOpenComment: () => void;
};

type OwnProps = {
  disabled: boolean;
  onAddEntry: () => void;
};

type Props = StateProps & DispatchProps & OwnProps;

const canAddEntry = (name: string, weightLifted: number | null): boolean =>
  name.length > 0 && weightLifted !== null;

const AddLogEntry: React.FunctionComponent<Props> = props => (
  <div className="add-log-entry">
    <div className="row">
      <div className="col">
        <DatePicker
          disabled={props.disabled}
          dateFormat="YYYY-MM-DD"
          selected={props.date}
          onChange={props.changeDate}
          className="form-control form-control-sm log-entry-input"
        />
      </div>
      <div className="col">
        <input
          disabled={props.disabled}
          className="form-control form-control-sm log-entry-input"
          type="text"
          placeholder="Name"
          maxLength={50}
          value={props.name}
          onChange={e => props.changeName(e.target.value)}
        />
      </div>
      <div className="col">
        <input
          disabled={props.disabled}
          className="form-control form-control-sm log-entry-input"
          type="text"
          placeholder="Weight"
          value={props.weightLiftedStringValue}
          onChange={e => props.changeWeightLifted(e.target.value)}
        />
      </div>
      <div className="col d-flex align-items-center">
        <span className="mr-2">{formatRepsSets(props.liftLogReps)}</span>
        <Button
          disabled={
            props.disabled || !canAddEntry(props.name, props.weightLifted)
          }
          size="sm"
          color="primary"
          onClick={props.openDialog}
        >
          Add
        </Button>
      </div>
    </div>
    <AddRepsModal
      onInputModeChange={props.onInputModeChange}
      onLiftLogRepsChange={props.onLiftLogRepsChange}
      onAddCustomSet={props.onAddCustomSet}
      onRemoveCustomSet={props.onRemoveCustomSet}
      onNumberOfSetsChange={props.onNumberOfSetsChange}
      onNumberOfRepsChange={props.onNumberOfRepsChange}
      liftLogReps={props.liftLogReps}
      isOpen={props.addRepsModalIsOpen}
      close={props.closeDialog}
      onSave={props.onAddEntry}
      onAddLink={props.onAddLink}
      onRemoveLink={props.onRemoveLink}
      onChangeLinkText={props.onChangeLinkText}
      onChangeLinkUrl={props.onChangeLinkUrl}
      onCommentChange={props.onCommentChange}
      onOpenComment={props.onOpenComment}
      commentIsShown={props.commentIsShown}
    />
  </div>
);

const mapStateToProps = (storeState: StoreState): StateProps => {
  return {
    addRepsModalIsOpen: storeState.dialogState.isOpen,
    date: storeState.newEntryState.date,
    name: storeState.newEntryState.name,
    weightLifted: storeState.newEntryState.weightLifted,
    weightLiftedStringValue: storeState.newEntryState.weightLiftedString,
    liftLogReps: {
      mode: storeState.dialogState.inputMode,
      numberOfSets: storeState.dialogState.numberOfSets,
      numberOfReps: storeState.dialogState.numberOfReps,
      customSetsStrings: storeState.dialogState.customSetsStrings,
      comment: storeState.dialogState.comment,
      links: storeState.dialogState.links
    },
    commentIsShown: storeState.dialogState.commentIsShown
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
      dispatch(dialogActions.changeComment(newValue)),
    onOpenComment: () => dispatch(dialogActions.showComment())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddLogEntry);
