import * as React from "react";
import { InputMode, SetsReps } from "../../types/LiftTypes";
import { formatRepsSets } from "../../utils/LiftUtils";
import CustomSetsInput from "./CustomSetsInput";
import InputModeSwitch from "./InputModeSwitch";
import LiftInfoContainer from "./LiftInfo";
import { CommentProps } from "./LiftInfo/Comment";
import { LinksProps } from "./LiftInfo/Links";
import SetsRepsInput from "./SetsRepsInput";

type Props = {
  onInputModeChange: (inputMode: InputMode) => void;
  onLiftLogRepsChange: (index: number, newValue: string) => void;
  canAddCustomSet: boolean;
  onAddCustomSet: () => void;
  onRemoveCustomSet: (index: number) => void;
  onNumberOfSetsChange: (newValue: string) => void;
  onNumberOfRepsChange: (newValue: string) => void;
  setsReps: SetsReps;
} & LinksProps &
  CommentProps;

const isSetsRepsMode = (props: Props) =>
  props.setsReps.mode === InputMode.SetsReps;

const AddReps: React.FunctionComponent<Props> = props => (
  <div className="px-1">
    <div className="d-flex">
      <InputModeSwitch
        mode={props.setsReps.mode}
        onChange={props.onInputModeChange}
      />
      <div className="lead ml-4">{formatRepsSets(props.setsReps)}</div>
    </div>
    <div className="my-3">
      {isSetsRepsMode(props) ? (
        <SetsRepsInput
          numberOfSets={props.setsReps.numberOfSets}
          numberOfReps={props.setsReps.numberOfReps}
          onNumberOfSetsChange={props.onNumberOfSetsChange}
          onNumberOfRepsChange={props.onNumberOfRepsChange}
        />
      ) : (
        <CustomSetsInput
          customSetsStrings={props.setsReps.customSetsStrings}
          canAddSet={props.canAddCustomSet}
          onAdd={props.onAddCustomSet}
          onRemove={props.onRemoveCustomSet}
          onChange={props.onLiftLogRepsChange}
        />
      )}
    </div>
    <LiftInfoContainer
      links={props.links}
      canAddLink={props.canAddLink}
      onAddLink={props.onAddLink}
      onRemoveLink={props.onRemoveLink}
      onChangeLinkText={props.onChangeLinkText}
      onChangeLinkUrl={props.onChangeLinkUrl}
      hasComment={props.hasComment}
      comment={props.comment}
      onCommentChange={props.onCommentChange}
      onOpenComment={props.onOpenComment}
    />
  </div>
);

export default AddReps;
