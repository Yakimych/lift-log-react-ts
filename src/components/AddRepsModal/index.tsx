import * as React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { LiftLogEntryReps } from "../../types/LiftTypes";
import AddReps from "./AddReps";
import "./style.css";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  onLiftLogRepsChange: (liftLogReps: LiftLogEntryReps) => void;
  onSave: () => void;
  liftLogReps: LiftLogEntryReps;
};

class AddRepsModal extends React.Component<Props> {
  public render() {
    const {
      isOpen,
      toggle,
      onSave,
      onLiftLogRepsChange,
      liftLogReps
    } = this.props;
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Input sets and reps</ModalHeader>
        <ModalBody>
          <AddReps
            onLiftLogRepsChange={onLiftLogRepsChange}
            liftLogReps={liftLogReps}
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
