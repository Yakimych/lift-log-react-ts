import * as React from "react";
import { useState } from "react";
import { Button, ButtonGroup, Tooltip } from "reactstrap";
import { InputMode } from "../../types/liftTypes";

type Props = {
  mode: InputMode;
  onChange: (mode: InputMode) => void;
};

type ButtonProps = {
  id?: string;
  buttonMode: InputMode;
  currentMode: InputMode;
  onClick: (mode: InputMode) => void;
};

const InputModeButton: React.FC<ButtonProps> = props => {
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const toggleTooltip = () => setTooltipIsOpen(prevIsOpen => !prevIsOpen);

  const handleClick = () => props.onClick(props.buttonMode);

  const active = props.buttonMode === props.currentMode;
  return (
    <>
      <Button
        id={props.id}
        color="primary"
        size="sm"
        className={!active ? "btn-primary--lighter" : ""}
        onClick={handleClick}
        outline={true}
        active={active}
      >
        {props.children}
      </Button>
      <Tooltip
        target="tooltipbutton"
        isOpen={tooltipIsOpen}
        toggle={toggleTooltip}
      >
        RPE format: 'Reps@RPE'. E.g. 5@9.5
      </Tooltip>
    </>
  );
};

const InputModeSwitch = (props: Props) => {
  const { mode, onChange } = props;

  return (
    <ButtonGroup>
      <InputModeButton
        buttonMode={InputMode.SetsReps}
        currentMode={mode}
        onClick={onChange}
      >
        Standard
      </InputModeButton>
      <InputModeButton
        id="tooltipbutton"
        buttonMode={InputMode.CustomReps}
        currentMode={mode}
        onClick={onChange}
      >
        Custom
      </InputModeButton>
    </ButtonGroup>
  );
};

export default InputModeSwitch;
