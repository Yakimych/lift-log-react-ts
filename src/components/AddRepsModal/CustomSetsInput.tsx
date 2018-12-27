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

// TODO: Move this check to the reducer?
const isAddSetDisabled = (numberOfCustomSets: number) =>
  numberOfCustomSets >= MAX_REP_SET_VALUE;

const CustomSetsInput: React.SFC<Props> = props => (
  <>
    <div className="d-flex flex-wrap">
      {props.customSets.map(formatSet).map((formattedSet, index) => (
        <div key={index} className="custom-sets-input-group mr-1 mb-1">
          <InputGroup>
            <Input
              className="set-rep-input"
              bsSize="sm"
              value={formattedSet}
              onChange={e => props.onChange(index, e.target.value)}
              // TODO: Do we need this?
              // onBlur={e => this.handleRepValueChangeCompleted(e, index)}
            />
            {index !== 0 && (
              <InputGroupAddon addonType="append">
                <div
                  className="input-group-text remove-icon-wrapper p-0"
                  onClick={() => props.onRemove(index)}
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
      onClick={props.onAdd}
      disabled={isAddSetDisabled(props.customSets.length)}
    >
      <Octicon icon={getIconByName("plus")} />
    </Button>
  </>
);

export default CustomSetsInput;
