import { DashIcon, PlusIcon, XIcon } from "@primer/octicons-react";
import * as React from "react";
import { Button } from "reactstrap";
import { MAX_REP_SET_VALUE, MIN_REP_SET_VALUE } from "../../utils/liftUtils";

type Props = {
  numberOfSets: number;
  numberOfReps: number;
  onNumberOfSetsChange: (newValue: string) => void;
  onNumberOfRepsChange: (newValue: string) => void;
};

type StepperProps = {
  label: string;
  value: number;
  onChange: (newValue: string) => void;
};

const step = (value: number, delta: number, onChange: (v: string) => void) =>
  onChange((value + delta).toString());

const NumberStepper: React.FunctionComponent<StepperProps> = props => (
  <div className="d-flex align-items-center number-stepper">
    <Button
      color="secondary"
      outline={true}
      size="sm"
      className="number-stepper-button"
      aria-label={`Decrease ${props.label}`}
      disabled={props.value <= MIN_REP_SET_VALUE}
      onClick={() => step(props.value, -1, props.onChange)}
    >
      <DashIcon />
    </Button>
    <input
      className="form-control form-control-sm set-rep-input mx-1"
      type="text"
      aria-label={props.label}
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
    />
    <Button
      color="secondary"
      outline={true}
      size="sm"
      className="number-stepper-button"
      aria-label={`Increase ${props.label}`}
      disabled={props.value >= MAX_REP_SET_VALUE}
      onClick={() => step(props.value, 1, props.onChange)}
    >
      <PlusIcon />
    </Button>
  </div>
);

const SetsRepsInput: React.FunctionComponent<Props> = props => (
  <div className="d-flex align-items-center flex-wrap">
    <NumberStepper
      label="Number of sets"
      value={props.numberOfSets}
      onChange={props.onNumberOfSetsChange}
    />
    <span className="cross-icon-wrapper">
      <XIcon />
    </span>
    <NumberStepper
      label="Number of reps"
      value={props.numberOfReps}
      onChange={props.onNumberOfRepsChange}
    />
  </div>
);

export default SetsRepsInput;
