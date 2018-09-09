import * as React from "react";
import { Set } from "../../types/LiftTypes";
import { InputMode, LiftLogEntryReps } from "../../types/LiftTypes";
import { formatRepsSets } from "../../utils/LiftUtils";
import CustomSetsInput from "./CustomSetsInput";
import InputModeSwitch from "./InputModeSwitch";
import SetsRepsInput from "./SetsRepsInput";

type Props = {
  onLiftLogRepsChange: (liftLogReps: LiftLogEntryReps) => void;
  liftLogReps: LiftLogEntryReps;
};

class AddReps extends React.Component<Props, {}> {
  public render() {
    const {
      numberOfSets,
      numberOfReps,
      customSets,
      mode
    } = this.props.liftLogReps;
    return (
      <div>
        <div className="d-flex">
          <InputModeSwitch mode={mode} onChange={this.handleInputModeChange} />
          <div className="lead ml-4">
            {formatRepsSets(this.props.liftLogReps)}
          </div>
        </div>
        <div className="my-3">
          {this.isSetsRepsMode() ? (
            <SetsRepsInput
              {...{ numberOfSets, numberOfReps }}
              onChange={this.handleSetsRepsChange}
            />
          ) : (
            <CustomSetsInput
              customSets={customSets}
              onChange={this.handleCustomSetsChange}
            />
          )}
        </div>
      </div>
    );
  }

  private handleSetsRepsChange = (numberOfSets: number, numberOfReps: number) =>
    this.props.onLiftLogRepsChange({
      numberOfSets,
      numberOfReps
    } as LiftLogEntryReps);

  private handleCustomSetsChange = (customSets: Set[]) =>
    this.props.onLiftLogRepsChange({ customSets } as LiftLogEntryReps);

  private handleInputModeChange = (mode: InputMode) => {
    if (mode === InputMode.SetsReps) {
      this.props.onLiftLogRepsChange({
        mode: InputMode.SetsReps
      } as LiftLogEntryReps);
    } else {
      const { numberOfSets, numberOfReps, customSets } = this.props.liftLogReps;
      const sets =
        customSets.length === 0
          ? this.getSetsFromNumberSetsReps(numberOfSets, numberOfReps)
          : customSets;

      this.props.onLiftLogRepsChange({
        mode: InputMode.CustomReps,
        customSets: sets
      } as LiftLogEntryReps);
    }
  };

  private isSetsRepsMode = () =>
    this.props.liftLogReps.mode === InputMode.SetsReps;

  private getSetsFromNumberSetsReps = (sets: number, reps: number): Set[] =>
    Array<Set>(sets).fill({ reps });
}

export default AddReps;
