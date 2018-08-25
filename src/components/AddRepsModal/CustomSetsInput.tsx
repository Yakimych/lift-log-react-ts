import Octicon, { getIconByName } from "@githubprimer/octicons-react";
import * as React from "react";
import { Button } from "reactstrap";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Set } from "../../types/LiftTypes";
import { MAX_REP_SET_VALUE, toValidRepSet } from "../../utils/LiftUtils";

type Props = {
  onChange: (reps: Set[]) => void;
  customSets: Set[];
};

class CustomSetsInput extends React.Component<Props> {
  public render() {
    return (
      <React.Fragment>
        <div className="d-flex flex-wrap">
          {this.props.customSets.map((value, index) => (
            <div key={index} className="custom-sets-input-group mr-1 mb-1">
              <InputGroup>
                <Input
                  className="set-rep-input"
                  bsSize="sm"
                  value={value.reps}
                  onChange={e => this.handleRepValueChanged(e, index)}
                />
                {index !== 0 && (
                  <InputGroupAddon addonType="append">
                    <div
                      className="input-group-text remove-icon-wrapper p-0"
                      onClick={() => this.handleRemoveSetClick(index)}
                    >
                      <Octicon icon={getIconByName("x")} />
                    </div>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </div>
          ))}
        </div>

        <Button
          color="success"
          size="sm"
          className="mt-2"
          onClick={this.handleAddSetClick}
          disabled={this.isAddSetDisabled()}
        >
          <Octicon icon={getIconByName("plus")} />
        </Button>
      </React.Fragment>
    );
  }

  private isAddSetDisabled = () =>
    this.props.customSets.length >= MAX_REP_SET_VALUE;

  private handleAddSetClick = () => {
    const { customSets, onChange } = this.props;
    const reps = [...customSets, customSets[customSets.length - 1]];
    onChange(reps);
  };

  private handleRepValueChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { customSets, onChange } = this.props;

    const newRepsValue = toValidRepSet(e.target.value);
    const reps = customSets.map(
      (value, i) => (i === index ? { ...value, reps: newRepsValue } : value)
    );
    onChange(reps);
  };

  private handleRemoveSetClick = (index: number) => {
    const { customSets, onChange } = this.props;
    const reps = customSets.filter((e, i) => i !== index);
    onChange(reps);
  };
}

export default CustomSetsInput;
