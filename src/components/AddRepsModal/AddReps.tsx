import * as React from "react";
import { InputMode, LiftLogEntryReps } from "../../types/LiftTypes";
import { formatRepsSets } from "../../utils/LiftUtils";
import CustomSetsInput from "./CustomSetsInput";
import InputModeSwitch from "./InputModeSwitch";
import LiftInfoContainer from "./LiftInfo";
import SetsRepsInput from "./SetsRepsInput";

type Props = {
  onInputModeChange: (inputMode: InputMode) => void;
  onLiftLogRepsChange: (index: number, newValue: string) => void;
  onAddCustomSet: () => void;
  onRemoveCustomSet: (index: number) => void;
  onNumberOfSetsChange: (newValue: string) => void;
  onNumberOfRepsChange: (newValue: string) => void;
  liftLogReps: LiftLogEntryReps;

  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
  onChangeLinkText: (index: number, newText: string) => void;
  onChangeLinkUrl: (index: number, newUrl: string) => void;
  onCommentChange: (newValue: string) => void;
};

const isSetsRepsMode = (props: Props) =>
  props.liftLogReps.mode === InputMode.SetsReps;

// const getSetsFromNumberSetsReps = (sets: number, reps: number): Set[] =>
//   Array<Set>(sets).fill({ reps, rpe: null });

const AddReps: React.SFC<Props> = props => {
  const { numberOfSets, numberOfReps, customSets, mode } = props.liftLogReps;

  return (
    <div className="px-1">
      <div className="d-flex">
        <InputModeSwitch mode={mode} onChange={props.onInputModeChange} />
        <div className="lead ml-4">{formatRepsSets(props.liftLogReps)}</div>
      </div>
      <div className="my-3">
        {isSetsRepsMode(props) ? (
          <SetsRepsInput
            {...{ numberOfSets, numberOfReps }}
            onNumberOfSetsChange={props.onNumberOfSetsChange}
            onNumberOfRepsChange={props.onNumberOfRepsChange}
          />
        ) : (
          <CustomSetsInput
            customSets={customSets}
            onAdd={props.onAddCustomSet}
            onRemove={props.onRemoveCustomSet}
            onChange={props.onLiftLogRepsChange}
          />
        )}
      </div>
      <LiftInfoContainer
        // onLiftInfoChange={props.onLiftLogRepsChange}
        onAddLink={props.onAddLink}
        onRemoveLink={props.onRemoveLink}
        onChangeLinkText={props.onChangeLinkText}
        onChangeLinkUrl={props.onChangeLinkUrl}
        onCommentChange={props.onCommentChange}
        liftInfo={props.liftLogReps}
      />
    </div>
  );
};

export default AddReps;
