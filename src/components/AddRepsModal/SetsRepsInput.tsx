import Octicon, { getIconByName } from "@githubprimer/octicons-react";
import * as React from "react";
import { toValidRepSet } from "../../utils/LiftUtils";

type Props = {
  numberOfSets: number;
  numberOfReps: number;
  onChange: (sets: number, reps: number) => void;
};

class SetsRepsInput extends React.Component<Props> {
  public render() {
    const { numberOfSets, numberOfReps } = this.props;
    return (
      <div className="d-flex align-items-center ">
        <input
          className="form-control form-control-sm set-rep-input"
          type="text"
          value={numberOfSets}
          onChange={this.handleSetsChanged}
        />
        <span className="cross-icon-wrapper">
          <Octicon icon={getIconByName("x")} />
        </span>
        <input
          className="form-control form-control-sm set-rep-input"
          type="text"
          value={numberOfReps}
          onChange={this.handleRepsChanged}
        />
      </div>
    );
  }

  private handleSetsChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberOfSets = toValidRepSet(e.target.value);
    this.props.onChange(numberOfSets, this.props.numberOfReps);
  };

  private handleRepsChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberOfReps = toValidRepSet(e.target.value);
    this.props.onChange(this.props.numberOfSets, numberOfReps);
  };
}

export default SetsRepsInput;
