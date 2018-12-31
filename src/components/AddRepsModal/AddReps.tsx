import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { actions as dialogActions } from "../../store/dialogActions";
import { getCanAddCustomSet, getSetsReps } from "../../store/selectors";
import { AppState } from "../../store/types";
import { InputMode, SetsReps } from "../../types/LiftTypes";
import { formatRepsSets } from "../../utils/LiftUtils";
import CustomSetsInput from "./CustomSetsInput";
import InputModeSwitch from "./InputModeSwitch";
import LiftInfoContainer from "./LiftInfo";
import SetsRepsInput from "./SetsRepsInput";

type StateProps = {
  canAddCustomSet: boolean;
  setsReps: SetsReps;
};

type DispatchProps = {
  onInputModeChange: (inputMode: InputMode) => void;
  onLiftLogRepsChange: (index: number, newValue: string) => void;
  onAddCustomSet: () => void;
  onRemoveCustomSet: (index: number) => void;
  onNumberOfSetsChange: (newValue: string) => void;
  onNumberOfRepsChange: (newValue: string) => void;
};

type Props = StateProps & DispatchProps;

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
    <LiftInfoContainer />
  </div>
);

const mapStateToProps = (state: AppState): StateProps => ({
  setsReps: getSetsReps(state),
  canAddCustomSet: getCanAddCustomSet(state)
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  onInputModeChange: (inputMode: InputMode) =>
    dispatch(dialogActions.setInputMode(inputMode)),
  onLiftLogRepsChange: (index: number, newValue: string) =>
    dispatch(dialogActions.changeCustomSet({ index, value: newValue })),
  onAddCustomSet: () => dispatch(dialogActions.addCustomSet()),
  onRemoveCustomSet: (index: number) =>
    dispatch(dialogActions.removeCustomSet(index)),
  onNumberOfSetsChange: (newValue: string) =>
    dispatch(dialogActions.setNumberOfSets(newValue)),
  onNumberOfRepsChange: (newValue: string) =>
    dispatch(dialogActions.setNumberOfReps(newValue))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReps);
