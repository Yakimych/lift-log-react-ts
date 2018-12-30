import * as React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { InputMode, SetsReps } from "../../types/LiftTypes";
import AddReps from "./AddReps";
import { CommentProps } from "./LiftInfo/Comment";
import { LinksProps } from "./LiftInfo/Links";
import "./style.css";

type Props = {
  isOpen: boolean;
  close: () => void;
  onSave: () => void;
  setsReps: SetsReps;

  onInputModeChange: (inputMode: InputMode) => void;
  onLiftLogRepsChange: (index: number, newValue: string) => void;
  canAddCustomSet: boolean;
  onAddCustomSet: () => void;
  onRemoveCustomSet: (index: number) => void;
  onNumberOfSetsChange: (newValue: string) => void;
  onNumberOfRepsChange: (newValue: string) => void;
} & LinksProps &
  CommentProps;

const AddRepsModal: React.FunctionComponent<Props> = props => {
  return (
    <Modal isOpen={props.isOpen} toggle={props.close}>
      <ModalHeader toggle={props.close}>Input sets and reps</ModalHeader>
      <ModalBody>
        <AddReps
          onInputModeChange={props.onInputModeChange}
          onLiftLogRepsChange={props.onLiftLogRepsChange}
          canAddCustomSet={props.canAddCustomSet}
          onAddCustomSet={props.onAddCustomSet}
          onRemoveCustomSet={props.onRemoveCustomSet}
          onNumberOfSetsChange={props.onNumberOfSetsChange}
          onNumberOfRepsChange={props.onNumberOfRepsChange}
          setsReps={props.setsReps}
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
