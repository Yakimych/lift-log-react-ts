import * as React from "react";
import { connect } from "react-redux";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap";
import { getCanSaveEntry, getIsEditingEntry } from "../../store/selectors";
import { AppState } from "../../store/types";
import EntryFields from "../EntryFields";
import AddReps from "./AddReps";
import "./style.css";

type StateProps = {
  isOpen: boolean;
  isSaving: boolean;
  isEditing: boolean;
  canSave: boolean;
  errorMessage: string | null;
};

type OwnProps = {
  close: () => void;
  onSave: () => void;
};

type Props = StateProps & OwnProps;

const EntryModal: React.FunctionComponent<Props> = props => (
  <Modal
    isOpen={props.isOpen}
    toggle={props.close}
    backdrop={props.isSaving ? "static" : true}
    keyboard={!props.isSaving}
  >
    <ModalHeader toggle={props.isSaving ? undefined : props.close}>
      {props.isEditing ? "Edit entry" : "Input sets and reps"}
    </ModalHeader>
    <ModalBody>
      {/* When adding, the date/name/weight fields are already on the log row. */}
      {props.isEditing && (
        <div className="mb-3">
          <EntryFields disabled={props.isSaving} stacked={true} />
        </div>
      )}
      <AddReps disabled={props.isSaving} />
      {props.errorMessage && (
        <Alert color="danger" className="mt-3 mb-0">
          {props.errorMessage}
        </Alert>
      )}
    </ModalBody>
    <ModalFooter>
      <Button
        color="primary"
        onClick={props.onSave}
        disabled={props.isSaving || !props.canSave}
      >
        {props.isSaving && <Spinner size="sm" className="mr-2" />}
        {props.isSaving ? "Saving..." : "Save"}
      </Button>
      <Button color="secondary" onClick={props.close} disabled={props.isSaving}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
);

const mapStateToProps = (state: AppState): StateProps => ({
  isOpen: state.dialogState.isOpen,
  isSaving: state.newEntryState.isSaving,
  isEditing: getIsEditingEntry(state),
  canSave: getCanSaveEntry(state),
  errorMessage: state.newEntryState.errorMessage
});

export default connect(mapStateToProps)(EntryModal);
