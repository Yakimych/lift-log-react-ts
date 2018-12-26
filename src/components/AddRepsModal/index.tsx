import * as React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { LiftLogEntryReps } from "../../types/LiftTypes";
import AddReps from "./AddReps";
import "./style.css";

type Props = {
  isOpen: boolean;
  close: () => void;
  onLiftLogRepsChange: (liftLogReps: LiftLogEntryReps) => void;
  onSave: () => void;
  liftLogReps: LiftLogEntryReps;
};

const AddRepsModal: React.SFC<Props> = props => {
  const { isOpen, close, onSave, onLiftLogRepsChange, liftLogReps } = props;
  return (
    <Modal isOpen={isOpen} toggle={close}>
      <ModalHeader toggle={close}>Input sets and reps</ModalHeader>
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
        <Button color="secondary" onClick={close}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddRepsModal;
