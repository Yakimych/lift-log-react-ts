import { PlusIcon, XIcon } from "@primer/octicons-react";
import * as React from "react";
import { Button, Input, InputGroup } from "reactstrap";

type Props = {
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, newValue: string) => void;
  canAddSet: boolean;
  customSetsStrings: ReadonlyArray<string>;
  disabled?: boolean;
};

const CustomSetsInput: React.FunctionComponent<Props> = props => (
  <>
    <div className="d-flex flex-wrap">
      {props.customSetsStrings.map((formattedSet, index) => (
        <div key={index} className="custom-sets-input-group me-1 mb-1">
          <InputGroup>
            <Input
              className="set-rep-input custom-set-input"
              bsSize="sm"
              value={formattedSet}
              onChange={e => props.onChange(index, e.target.value)}
            />
            {index !== 0 && (
              <div
                className={`input-group-text remove-icon-wrapper p-0${
                  props.disabled ? " remove-icon-wrapper--disabled" : ""
                }`}
                onClick={props.disabled ? undefined : () => props.onRemove(index)}
              >
                <XIcon />
              </div>
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
      <PlusIcon />
    </Button>
  </>
);

export default CustomSetsInput;
