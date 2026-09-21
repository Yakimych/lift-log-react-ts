import * as React from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { Dispatch } from "redux";
import { actions as dialogActions } from "../store/dialogActions";
import { getCanSaveEntry, getSetsReps } from "../store/selectors";
import { AppState } from "../store/types";
import { SetsReps } from "../types/liftTypes";
import { formatRepsSets } from "../utils/liftUtils";
import "./AddLogEntry.css";
import EntryFields from "./EntryFields";

export type StateProps = {
  canAddEntry: boolean;
  setsReps: SetsReps;
};

export type DispatchProps = {
  openDialog: () => void;
};

type OwnProps = {
  disabled: boolean;
};

export type AddLogEntryProps = StateProps & DispatchProps & OwnProps;

const AddLogEntry: React.FunctionComponent<AddLogEntryProps> = props => (
  <div className="add-log-entry">
    <div className="row">
      <EntryFields disabled={props.disabled} />
      <div className="col d-flex align-items-center">
        <span className="mr-2">{formatRepsSets(props.setsReps)}</span>
        <Button
          disabled={props.disabled || !props.canAddEntry}
          size="sm"
          color="primary"
          onClick={props.openDialog}
        >
          Add
        </Button>
      </div>
    </div>
  </div>
);

const mapStateToProps = (state: AppState): StateProps => ({
  setsReps: getSetsReps(state),
  canAddEntry: getCanSaveEntry(state)
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  openDialog: () => dispatch(dialogActions.open())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddLogEntry);
