import Octicon, { getIconByName } from "@githubprimer/octicons-react";
import * as React from "react";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Set } from "../../types/LiftTypes";
import {
  formatSet,
  MAX_REP_SET_VALUE,
  toValidSet
} from "../../utils/LiftUtils";

type Props = {
  onChange: (sets: Set[]) => void;
  customSets: Set[];
};

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
                  onBlur={e => this.handleRepValueChangeCompleted(e, index)}
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
    const { customSets, onChange } = this.props;
    const sets = [...customSets, customSets[customSets.length - 1]];
    this.setState({ customSets: sets.map(formatSet) });
    onChange(sets);
  };

  private handleRepValueChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newSetStringValue = e.target.value;
    const newFormattedSets = Object.assign([], this.state.customSets, {
      [index]: newSetStringValue
    });

    this.setState({ customSets: newFormattedSets });
  };

  private handleRepValueChangeCompleted = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { customSets, onChange } = this.props;
    const newSetValue: Set = toValidSet(e.target.value);

    const newRepValue = {
      ...customSets[index],
      reps: newSetValue.reps,
      rpe: newSetValue.rpe
    };
    const sets: Set[] = Object.assign([], customSets, { [index]: newRepValue });

    this.setState({ customSets: sets.map(formatSet) });
    onChange(sets);
  };

  private handleRemoveSetClick = (index: number) => {
    const { customSets, onChange } = this.props;
    const sets = customSets.filter((e, i) => i !== index);
    this.setState({ customSets: sets.map(formatSet) });
    onChange(sets);
  };
}

export default CustomSetsInput;
