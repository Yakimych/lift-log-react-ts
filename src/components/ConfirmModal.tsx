import * as React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap";

type Props = {
  isOpen: boolean;
  isBusy: boolean;
  title: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal: React.FunctionComponent<Props> = props => (
  <Modal
    isOpen={props.isOpen}
    toggle={props.onCancel}
    backdrop={props.isBusy ? "static" : true}
    keyboard={!props.isBusy}
  >
    <ModalHeader toggle={props.isBusy ? undefined : props.onCancel}>
      {props.title}
    </ModalHeader>
    <ModalBody>{props.children}</ModalBody>
    <ModalFooter>
      <Button color="danger" onClick={props.onConfirm} disabled={props.isBusy}>
        {props.isBusy && <Spinner size="sm" className="mr-2" />}
        {props.confirmLabel || "Delete"}
      </Button>
      <Button color="secondary" onClick={props.onCancel} disabled={props.isBusy}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
);

export default ConfirmModal;
