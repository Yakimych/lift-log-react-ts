import * as React from "react";
import { Set } from "../types/LiftTypes";

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
  onValueChange: (reps: Set[]) => void;
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
      <div className="col">
        <div className="form-control-sm">{this.getRepsString()}</div>

        {/* <div
          className="col"
          style={{ width: "100%", flex: "1 1 auto", display: "flex" }}
        > */}
        <div className="d-flex">
          {this.showSetsReps() ? (
            <React.Fragment>
              <input
                className="form-control form-control-sm log-entry-input--set-rep"
                type="text"
                value={this.state.numberOfSets}
                onChange={this.handleSetsChanged}
              />
              x
              <input
                className="form-control form-control-sm log-entry-input--set-rep"
                type="text"
                value={this.state.numberOfReps}
                onChange={this.handleRepsChanged}
              />
              <button
                className="btn btn-light btn-sm btn-add-entry"
                onClick={this.handleCustomClick}
              >
                Custom
              </button>
            </React.Fragment>
          ) : (
            <div className="d-flex flex-wrap">
              <button
                className="btn btn-light btn-sm btn-add-entry"
                onClick={this.handleStandardClick}
              >
                Standard
              </button>
              <div className="d-flex justify-content-space-between flex-wrap">
                {this.state.customReps.map((rep, index) => (
                  <div key={index} className="d-flex ">
                    <input
                      className="form-control form-control-sm log-entry-input--set-rep"
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
              </div>

              <button onClick={this.handleAddSetClick}>+</button>
            </div>
          )}
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
      if (prevState.mode === InputMode.SetsReps) {
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

  private getRepsString = (): string =>
    this.getReps()
      .map(r => r.reps)
      .join("-");

  private getReps(): Set[] {
    if (this.state.mode === InputMode.SetsReps) {
      return Array(this.state.numberOfSets)
        .fill(this.state.numberOfReps)
        .map(reps => ({ reps }));
    } else {
      return this.state.customReps.map(reps => ({ reps }));
    }
  }
}

export default AddReps;
