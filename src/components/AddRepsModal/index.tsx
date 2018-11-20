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

const AddRepsModal: React.SFC<Props> = props => {
  const { isOpen, toggle, onSave, onLiftLogRepsChange, liftLogReps } = props;
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
};

export default AddRepsModal;
