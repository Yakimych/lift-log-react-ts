import Octicon, { getIconByName } from "@githubprimer/octicons-react";
import * as React from "react";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";

type Props = {
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, newValue: string) => void;
  canAddSet: boolean;
  customSetsStrings: ReadonlyArray<string>;
};

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
      disabled={!props.canAddSet}
    >
      <Octicon icon={getIconByName("plus")} />
    </Button>
  </>
);

export default CustomSetsInput;
