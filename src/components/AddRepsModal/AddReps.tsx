import * as React from "react";
import { InputMode, LiftLogEntryReps, Set } from "../../types/LiftTypes";
import { formatRepsSets } from "../../utils/LiftUtils";
import CustomSetsInput from "./CustomSetsInput";
import InputModeSwitch from "./InputModeSwitch";
import LiftInfoContainer from "./LiftInfo";
import SetsRepsInput from "./SetsRepsInput";

type Props = {
  onLiftLogRepsChange: (liftLogReps: Partial<LiftLogEntryReps>) => void;
  liftLogReps: LiftLogEntryReps;
};

const isSetsRepsMode = (props: Props) =>
  props.liftLogReps.mode === InputMode.SetsReps;

const getSetsFromNumberSetsReps = (sets: number, reps: number): Set[] =>
  Array<Set>(sets).fill({ reps, rpe: null });

const handleInputModeChange = (props: Props, mode: InputMode) => {
  if (mode === InputMode.SetsReps) {
    props.onLiftLogRepsChange({
      mode: InputMode.SetsReps
    } as LiftLogEntryReps);
  } else {
    const { numberOfSets, numberOfReps, customSets } = props.liftLogReps;
    const sets =
      customSets.length === 0
        ? getSetsFromNumberSetsReps(numberOfSets, numberOfReps)
        : customSets;

    props.onLiftLogRepsChange({
      mode: InputMode.CustomReps,
      customSets: sets
    } as LiftLogEntryReps);
  }
};

const handleSetsRepsChange = (
  props: Props,
  numberOfSets: number,
  numberOfReps: number
) =>
  props.onLiftLogRepsChange({
    numberOfSets,
    numberOfReps
  });

const handleCustomSetsChange = (props: Props, customSets: Set[]) =>
  props.onLiftLogRepsChange({ customSets } as LiftLogEntryReps);

const AddReps: React.SFC<Props> = props => {
  const { numberOfSets, numberOfReps, customSets, mode } = props.liftLogReps;

  const boundHandleInputModeChange = handleInputModeChange.bind(null, props);
  const boundHandleSetsRepsChange = handleSetsRepsChange.bind(null, props);
  const boundHandleCustomSetsChange = handleCustomSetsChange.bind(null, props);

  return (
    <div className="px-1">
      <div className="d-flex">
        <InputModeSwitch mode={mode} onChange={boundHandleInputModeChange} />
        <div className="lead ml-4">{formatRepsSets(props.liftLogReps)}</div>
      </div>
      <div className="my-3">
        {isSetsRepsMode(props) ? (
          <SetsRepsInput
            {...{ numberOfSets, numberOfReps }}
            onChange={boundHandleSetsRepsChange}
          />
        ) : (
          <CustomSetsInput
            customSets={customSets}
            onChange={boundHandleCustomSetsChange}
          />
        )}
      </div>
      <LiftInfoContainer
        onLiftInfoChange={props.onLiftLogRepsChange}
        liftInfo={props.liftLogReps}
      />
    </div>
  );
};

export default AddReps;
