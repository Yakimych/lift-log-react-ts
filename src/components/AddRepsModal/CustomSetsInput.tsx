import Octicon, { getIconByName } from "@githubprimer/octicons-react";
import * as React from "react";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Set } from "../../types/LiftTypes";
import {
  formatSet,
  MAX_REP_SET_VALUE
  // toValidSet
} from "../../utils/LiftUtils";

type Props = {
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, newValue: string) => void;
  customSets: ReadonlyArray<Set>;
};

// TODO: Remove
type State = {
  customSets: string[];
};

class CustomSetsInput extends React.Component<Props, State> {
  public state: Readonly<State> = {
    customSets: this.props.customSets.map(formatSet)
  };

  public render() {
    return (
      <>
        <div className="d-flex flex-wrap">
          {this.state.customSets.map((formattedSet, index) => (
            <div key={index} className="custom-sets-input-group mr-1 mb-1">
              <InputGroup>
                <Input
                  className="set-rep-input"
                  bsSize="sm"
                  value={formattedSet}
                  onChange={e => this.handleRepValueChanged(e, index)}
                  // TODO: Do we need this?
                  // onBlur={e => this.handleRepValueChangeCompleted(e, index)}
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
      </>
    );
  }

  private isAddSetDisabled = () =>
    this.props.customSets.length >= MAX_REP_SET_VALUE;

  private handleAddSetClick = () => {
    this.props.onAdd();
  };

  private handleRepValueChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newSetStringValue = e.target.value;
    this.props.onChange(index, newSetStringValue);
  };

  private handleRemoveSetClick = (index: number) => {
    this.props.onRemove(index);
  };
}

export default CustomSetsInput;
