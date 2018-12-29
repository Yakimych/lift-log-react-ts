import Octicon, { getIconByName } from "@githubprimer/octicons-react";
import * as React from "react";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { MAX_REP_SET_VALUE } from "../../utils/LiftUtils";

type Props = {
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, newValue: string) => void;
  customSetsStrings: ReadonlyArray<string>;
};

// TODO: Move this check to the reducer/selector?
const isAddSetDisabled = (numberOfCustomSets: number) =>
  numberOfCustomSets >= MAX_REP_SET_VALUE;

const CustomSetsInput: React.FunctionComponent<Props> = props => (
  <>
    <div className="d-flex flex-wrap">
      {props.customSetsStrings.map((formattedSet, index) => (
        <div key={index} className="custom-sets-input-group mr-1 mb-1">
          <InputGroup>
            <Input
              className="set-rep-input"
              bsSize="sm"
              value={formattedSet}
              onChange={e => props.onChange(index, e.target.value)}
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
      disabled={isAddSetDisabled(props.customSetsStrings.length)}
    >
      <Octicon icon={getIconByName("plus")} />
    </Button>
  </>
);

export default CustomSetsInput;
