import * as React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap";
import AddReps from "./AddReps";
import "./style.css";

type Props = {
  isOpen: boolean;
  isSaving: boolean;
  close: () => void;
  onSave: () => void;
};

const AddRepsModal: React.FunctionComponent<Props> = props => {
  return (
    <Modal
      isOpen={props.isOpen}
      toggle={props.close}
      backdrop={props.isSaving ? "static" : true}
      keyboard={!props.isSaving}
    >
      <ModalHeader toggle={props.isSaving ? undefined : props.close}>
        Input sets and reps
      </ModalHeader>
      <ModalBody>
        <AddReps disabled={props.isSaving} />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={props.onSave}
          disabled={props.isSaving}
        >
          {props.isSaving && <Spinner size="sm" className="mr-2" />}
          {props.isSaving ? "Saving..." : "Save"}
        </Button>
        <Button
          color="secondary"
          onClick={props.close}
          disabled={props.isSaving}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddRepsModal;
