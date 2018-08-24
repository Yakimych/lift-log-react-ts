import * as React from "react";
import { Set } from "../../types/LiftTypes";
import { allRepsAreEqual, formatSets } from "../../utils/LiftUtils";
import CustomSetsInput from "./CustomSetsInput";
import InputModeSwitch, { InputMode } from "./InputModeSwitch";
import SetsRepsInput from "./SetsRepsInput";

type State = {
  mode: InputMode;
  numberOfSets: number;
  numberOfReps: number;
  customSets: Set[];
};

type Props = {
  onValueChange: (sets: Set[]) => void;
  initialSets: Set[];
};

class AddReps extends React.Component<Props, State> {
  public state: State = this.getInitialState(this.props.initialSets);

  public render() {
    const { numberOfSets, numberOfReps, customSets, mode } = this.state;
    return (
      <div>
        <InputModeSwitch mode={mode} onChange={this.handleInputModeChange} />
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
        <div className="lead">{formatSets(this.getSets())}</div>
      </div>
    );
  }

  private setStateAndEmitEvent<K extends keyof State>(
    state:
      | ((prevState: State) => Pick<State, K> | State)
      | (Pick<State, K> | State)
  ) {
    return this.setState(state, () => this.props.onValueChange(this.getSets()));
  }

  private handleSetsRepsChange = (numberOfSets: number, numberOfReps: number) =>
    this.setStateAndEmitEvent({
      numberOfSets,
      numberOfReps
    });

  private handleCustomSetsChange = (customSets: Set[]) =>
    this.setStateAndEmitEvent({ customSets } as State);

  private handleInputModeChange = (mode: InputMode) => {
    if (mode === InputMode.SetsReps) {
      this.setStateAndEmitEvent({ mode: InputMode.SetsReps } as State);
    } else {
      this.setStateAndEmitEvent((prevState: State) => {
        const { numberOfSets, numberOfReps, customSets } = prevState;
        const sets =
          customSets.length === 0
            ? this.getSetsFromNumberSetsReps(numberOfSets, numberOfReps)
            : customSets;

        return {
          mode: InputMode.CustomReps,
          customSets: sets
        };
      });
    }
  };

  private isSetsRepsMode() {
    return this.state.mode === InputMode.SetsReps;
  }

  private getSetsFromNumberSetsReps(sets: number, reps: number): Set[] {
    return Array<Set>(sets).fill({ reps });
  }

  private getSets(): Set[] {
    const { numberOfSets, numberOfReps, customSets } = this.state;

    return this.isSetsRepsMode()
      ? this.getSetsFromNumberSetsReps(numberOfSets, numberOfReps)
      : customSets;
  }

  private getInitialState(initialSets: Set[]): State {
    const numberOfSets = initialSets.length || 5;
    const numberOfReps = initialSets[0] ? initialSets[0].reps : 3;

    return initialSets.length === 0 || allRepsAreEqual(initialSets)
      ? {
          mode: InputMode.SetsReps,
          numberOfSets,
          numberOfReps,
          customSets: []
        }
      : {
          mode: InputMode.CustomReps,
          numberOfSets,
          numberOfReps,
          customSets: initialSets.slice()
        };
  }
}

export default AddReps;
