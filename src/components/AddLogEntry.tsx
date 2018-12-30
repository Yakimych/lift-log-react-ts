import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "reactstrap";
import { InputMode, SetsReps } from "../types/LiftTypes";
import { formatRepsSets } from "../utils/LiftUtils";
import "./AddLogEntry.css";
import AddRepsModal from "./AddRepsModal";
import {
  CommentDispatchProps,
  CommentStateProps
} from "./AddRepsModal/LiftInfo/Comment";
import {
  LinksDispatchProps,
  LinksStateProps
} from "./AddRepsModal/LiftInfo/Links";

export type AddLogEntryStateProps = {
  name: string;
  date: moment.Moment | null;
  weightLifted: number | null;
  weightLiftedStringValue: string;
  addRepsModalIsOpen: boolean;
  setsReps: SetsReps;
  canAddCustomSet: boolean;
} & LinksStateProps &
  CommentStateProps;

export type AddLogEntryDispatchProps = {
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
} & LinksDispatchProps &
  CommentDispatchProps;

type OwnProps = {
  disabled: boolean;
  onAddEntry: () => void;
};

export type AddLogEntryProps = AddLogEntryStateProps &
  AddLogEntryDispatchProps &
  OwnProps;

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
      onInputModeChange={props.onInputModeChange}
      onLiftLogRepsChange={props.onLiftLogRepsChange}
      canAddCustomSet={props.canAddCustomSet}
      onAddCustomSet={props.onAddCustomSet}
      onRemoveCustomSet={props.onRemoveCustomSet}
      onNumberOfSetsChange={props.onNumberOfSetsChange}
      onNumberOfRepsChange={props.onNumberOfRepsChange}
      setsReps={props.setsReps}
      isOpen={props.addRepsModalIsOpen}
      close={props.closeDialog}
      onSave={props.onAddEntry}
      links={props.links}
      canAddLink={props.canAddLink}
      onAddLink={props.onAddLink}
      onRemoveLink={props.onRemoveLink}
      onChangeLinkText={props.onChangeLinkText}
      onChangeLinkUrl={props.onChangeLinkUrl}
      comment={props.comment}
      hasComment={props.hasComment}
      onCommentChange={props.onCommentChange}
      onOpenComment={props.onOpenComment}
    />
  </div>
);

export default AddLogEntry;
