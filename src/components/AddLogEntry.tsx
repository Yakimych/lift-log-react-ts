import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { Dispatch } from "redux";
import { actions as dialogActions } from "../store/dialogActions";
import { actions as newEntryActions } from "../store/newEntryActions";
import { getSetsReps } from "../store/selectors";
import { AppState } from "../store/types";
import { SetsReps } from "../types/LiftTypes";
import { formatRepsSets } from "../utils/LiftUtils";
import "./AddLogEntry.css";
import AddRepsModal from "./AddRepsModal";

export type StateProps = {
  name: string;
  date: moment.Moment | null;
  weightLifted: number | null;
  weightLiftedStringValue: string;
  addRepsModalIsOpen: boolean;
  setsReps: SetsReps;
};

export type DispatchProps = {
  changeName: (name: string) => void;
  changeDate: (dateString: moment.Moment | null) => void;
  changeWeightLifted: (weightLiftedString: string) => void;
  openDialog: () => void;
  closeDialog: () => void;
};

type OwnProps = {
  disabled: boolean;
  onAddEntry: () => void;
};

export type AddLogEntryProps = StateProps & DispatchProps & OwnProps;

const canAddEntry = (name: string, weightLifted: number | null): boolean =>
  name.length > 0 && weightLifted !== null;

const AddLogEntry: React.FunctionComponent<AddLogEntryProps> = props => (
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
        <span className="mr-2">{formatRepsSets(props.setsReps)}</span>
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
      isOpen={props.addRepsModalIsOpen}
      close={props.closeDialog}
      onSave={props.onAddEntry}
    />
  </div>
);

const mapStateToProps = (state: AppState): StateProps => ({
  setsReps: getSetsReps(state),
  addRepsModalIsOpen: state.dialogState.isOpen,
  date: state.newEntryState.date,
  name: state.newEntryState.name,
  weightLifted: state.newEntryState.weightLifted,
  weightLiftedStringValue: state.newEntryState.weightLiftedString
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  changeName: (newName: string) =>
    dispatch(newEntryActions.changeName(newName)),
  changeDate: (newDate: moment.Moment | null) =>
    dispatch(newEntryActions.changeDate(newDate)),
  changeWeightLifted: (newWeightLiftedString: string) =>
    dispatch(newEntryActions.changeWeightLifted(newWeightLiftedString)),
  openDialog: () => dispatch(dialogActions.open()),
  closeDialog: () => dispatch(dialogActions.close())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddLogEntry);
