import Octicon, { getIconByName } from "@githubprimer/octicons-react";
import * as React from "react";

type Props = {
  numberOfSetsString: string;
  numberOfRepsString: string;
  onNumberOfSetsChange: (newValue: string) => void;
  onNumberOfRepsChange: (newValue: string) => void;
};

const SetsRepsInput: React.FunctionComponent<Props> = props => (
  <div className="d-flex align-items-center ">
    <input
      className="form-control form-control-sm set-rep-input"
      type="text"
      value={props.numberOfSetsString}
      onChange={e => props.onNumberOfSetsChange(e.target.value)}
    />
    <span className="cross-icon-wrapper">
      <Octicon icon={getIconByName("x")} />
    </span>
    <input
      className="form-control form-control-sm set-rep-input"
      type="text"
      value={props.numberOfRepsString}
      onChange={e => props.onNumberOfRepsChange(e.target.value)}
    />
  </div>
);

export default SetsRepsInput;
