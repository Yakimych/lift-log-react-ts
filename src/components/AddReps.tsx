import * as React from "react";

enum InputMode {
  SetsReps,
  CustomReps
}

type State = {
  mode: InputMode;
  numberOfSets: number;
  numberOfReps: number;
  customReps: number[];
};

type Props = {
  onValueChange: (reps: number[]) => void;
};

class AddReps extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      mode: InputMode.SetsReps,
      numberOfSets: 3,
      numberOfReps: 5,
      customReps: []
    };
  }

  public render() {
    return (
      <div>
        <span>{this.getRepsString()}</span>
        <div className={!this.showSetsReps() ? "hidden" : ""}>
          <input
            type="text"
            value={this.state.numberOfSets}
            onChange={this.handleSetsChanged}
          />
          x
          <input
            type="text"
            value={this.state.numberOfReps}
            onChange={this.handleRepsChanged}
          />
          <button onClick={this.handleCustomClick}>Custom</button>
        </div>
        <div className={!this.showCustomReps() ? "hidden" : "custom-reps"}>
          <button onClick={this.handleStandardClick}>Standard</button>
          {this.state.customReps.map((rep, index) => (
            <div key={index}>
              <input
                type="text"
                value={rep}
                onChange={e => this.handleRepValueChanged(e, index)}
              />
              {index !== 0 ? (
                <button onClick={() => this.handleRemoveSetClick(index)}>
                  x
                </button>
              ) : null}
            </div>
          ))}
          <button onClick={this.handleAddSetClick}>+</button>
        </div>
      </div>
    );
  }

  // TODO: any
  private setStateAndEmitEvent = (state: any) =>
    this.setState(state, () => this.props.onValueChange(this.getReps()));

  private toValidPositiveInteger(numericString: string) {
    const validInt = Number(numericString.replace(/[^0-9]+/g, ""));
    return validInt < 1 ? 1 : validInt;
  }

  private handleSetsChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setStateAndEmitEvent({
      mode: InputMode.SetsReps,
      numberOfSets: this.toValidPositiveInteger(e.target.value)
    } as State);
  };

  private handleRepsChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setStateAndEmitEvent({
      mode: InputMode.SetsReps,
      numberOfReps: this.toValidPositiveInteger(e.target.value)
    } as State);
  };

  private handleAddSetClick = () => {
    this.setStateAndEmitEvent((prevState: State) => {
      if (prevState.mode === InputMode.CustomReps) {
        const reps = [
          ...prevState.customReps,
          prevState.customReps[prevState.customReps.length - 1]
        ];
        return { mode: InputMode.CustomReps, customReps: reps };
      }
      return prevState;
    });
  };

  private handleRepValueChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = this.toValidPositiveInteger(e.target.value);
    this.setStateAndEmitEvent((prevState: State) => {
      if (prevState.mode === InputMode.CustomReps) {
        const reps = prevState.customReps.map(
          (oldValue, i) => (i === index ? newValue : oldValue)
        );
        // TODO: Make the type system warn here
        return { mode: InputMode.CustomReps, customReps: reps };
      }
      return prevState;
    });
  };

  private handleRemoveSetClick = (index: number) => {
    this.setStateAndEmitEvent((prevState: State) => {
      if (prevState.mode === InputMode.CustomReps) {
        const reps = prevState.customReps.filter((e, i) => i !== index);
        return { mode: InputMode.CustomReps, customReps: reps };
      }
      return prevState;
    });
  };

  private handleCustomClick = () => {
    this.setStateAndEmitEvent((prevState: State) => {
      if (this.state.mode === InputMode.SetsReps) {
        const reps =
          prevState.customReps.length === 0
            ? Array(this.state.numberOfSets).fill(this.state.numberOfReps)
            : prevState.customReps;
        return { mode: InputMode.CustomReps, customReps: reps };
      }
      return prevState;
    });
  };

  private handleStandardClick = () =>
    this.setStateAndEmitEvent({ mode: InputMode.SetsReps } as State);

  private showSetsReps = () => this.state.mode === InputMode.SetsReps;

  private showCustomReps = () => this.state.mode === InputMode.CustomReps;

  private getRepsString = (): string => this.getReps().join("-");

  private getReps(): number[] {
    if (this.state.mode === InputMode.SetsReps) {
      return Array(this.state.numberOfSets).fill(this.state.numberOfReps);
    } else {
      return this.state.customReps;
    }
  }
}

export default AddReps;
