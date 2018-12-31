import * as React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import AddReps from "./AddReps";
import "./style.css";

type Props = {
  isOpen: boolean;
  close: () => void;
  onSave: () => void;
};

const AddRepsModal: React.FunctionComponent<Props> = props => {
  return (
    <Modal isOpen={props.isOpen} toggle={props.close}>
      <ModalHeader toggle={props.close}>Input sets and reps</ModalHeader>
      <ModalBody>
        <AddReps />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={props.onSave}>
          Save
        </Button>
        <Button color="secondary" onClick={props.close}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddRepsModal;
