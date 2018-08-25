import * as React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Set } from "../../types/LiftTypes";
import AddReps from "./AddReps";
import "./style.css";

type Props = {
  initialSets: Set[];
  isOpen: boolean;
  toggle: () => void;
  onValueChange: (sets: Set[]) => void;
  onSave: () => void;
};

class AddRepsModal extends React.Component<Props> {
  public render() {
    const { isOpen, toggle, onSave } = this.props;
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Input sets and reps</ModalHeader>
        <ModalBody>
          <AddReps
            onValueChange={this.props.onValueChange}
            initialSets={this.props.initialSets}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onSave}>
            Save
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AddRepsModal;
