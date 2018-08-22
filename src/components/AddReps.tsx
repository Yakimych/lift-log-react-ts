import * as React from "react";

enum InputMode {
  SetsReps,
  CustomReps
}

type SetsReps = {
  mode: InputMode.SetsReps;
  numberOfSets: number;
  numberOfReps: number;
};

type CustomReps = {
  mode: InputMode.CustomReps;
  reps: number[];
};

type State = SetsReps | CustomReps;

type Props = {
  onValueChange: (reps: number[]) => void;
};

class AddReps extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      mode: InputMode.SetsReps,
      numberOfSets: 3,
      numberOfReps: 5
    };
  }

  public render() {
    return (
      <div>
        {this.state.mode === InputMode.SetsReps ? (
          <div>
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
        ) : (
          <div>
            <div className="custom-reps">
              <button onClick={this.handleStandardClick}>Standard</button>
              {this.state.reps.map((rep, index) => (
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
        )}
      </div>
    );
  }

  private setStateAndEmitEvent = (
    state: ((prevState: State) => void) | State
  ) => this.setState(state, () => this.props.onValueChange(this.getReps()));

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
          ...prevState.reps,
          prevState.reps[prevState.reps.length - 1]
        ];
        return { mode: InputMode.CustomReps, reps };
      }
      return prevState;
    });
  };

  private handleRepValueChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = this.toValidPositiveInteger(e.target.value);
    this.setStateAndEmitEvent(prevState => {
      if (prevState.mode === InputMode.CustomReps) {
        const reps = prevState.reps.map(
          (oldValue, i) => (i === index ? newValue : oldValue)
        );
        return { mode: InputMode.CustomReps, reps };
      }
      return prevState;
    });
  };

  private handleRemoveSetClick = (index: number) => {
    this.setStateAndEmitEvent(prevState => {
      if (prevState.mode === InputMode.CustomReps) {
        const reps = prevState.reps.filter((e, i) => i !== index);
        return { mode: InputMode.CustomReps, reps };
      }
      return prevState;
    });
  };

  private handleCustomClick = () => {
    this.setStateAndEmitEvent(prevState => {
      if (this.state.mode === InputMode.SetsReps) {
        const reps = Array(this.state.numberOfSets).fill(
          this.state.numberOfReps
        );
        return { mode: InputMode.CustomReps, reps };
      }
      return prevState;
    });
  };

  private handleStandardClick = () => {
    this.setStateAndEmitEvent({ mode: InputMode.SetsReps } as State);
  };

  private getReps(): number[] {
    if (this.state.mode === InputMode.SetsReps) {
      return Array(Number(this.state.numberOfSets)).fill(
        Number(this.state.numberOfReps)
      );
    } else {
      return this.state.reps;
    }
  }
}

export default AddReps;
