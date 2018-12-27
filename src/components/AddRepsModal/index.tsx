import * as React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { InputMode, LiftLogEntryReps } from "../../types/LiftTypes";
import AddReps from "./AddReps";
import "./style.css";

type Props = {
  isOpen: boolean;
  close: () => void;
  onSave: () => void;
  liftLogReps: LiftLogEntryReps;

  onInputModeChange: (inputMode: InputMode) => void;
  onLiftLogRepsChange: (index: number, newValue: string) => void;
  onAddCustomSet: () => void;
  onRemoveCustomSet: (index: number) => void;
  onNumberOfSetsChange: (newValue: string) => void;
  onNumberOfRepsChange: (newValue: string) => void;

  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
  onChangeLinkText: (index: number, newText: string) => void;
  onChangeLinkUrl: (index: number, newUrl: string) => void;
  onCommentChange: (newValue: string) => void;
};

const AddRepsModal: React.SFC<Props> = props => {
  return (
    <Modal isOpen={props.isOpen} toggle={props.close}>
      <ModalHeader toggle={props.close}>Input sets and reps</ModalHeader>
      <ModalBody>
        <AddReps
          onInputModeChange={props.onInputModeChange}
          onLiftLogRepsChange={props.onLiftLogRepsChange}
          onAddCustomSet={props.onAddCustomSet}
          onRemoveCustomSet={props.onRemoveCustomSet}
          onNumberOfSetsChange={props.onNumberOfSetsChange}
          onNumberOfRepsChange={props.onNumberOfRepsChange}
          liftLogReps={props.liftLogReps}
          onAddLink={props.onAddLink}
          onRemoveLink={props.onRemoveLink}
          onChangeLinkText={props.onChangeLinkText}
          onChangeLinkUrl={props.onChangeLinkUrl}
          onCommentChange={props.onCommentChange}
        />
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
