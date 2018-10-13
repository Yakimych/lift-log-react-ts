import * as React from "react";
import { Button, ButtonGroup, Tooltip } from "reactstrap";
import { InputMode } from "../../types/LiftTypes";

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

type ButtonState = {
  rpeTooltipIsOpen: boolean;
};

class InputModeButton extends React.Component<ButtonProps, ButtonState> {
  public state: Readonly<ButtonState> = {
    rpeTooltipIsOpen: false
  };

  public render() {
    const active = this.props.buttonMode === this.props.currentMode;
    return (
      <>
        <Button
          id={this.props.id}
          color="primary"
          size="sm"
          className={!active ? "btn-primary--lighter" : ""}
          onClick={this.handleClick}
          outline={true}
          active={active}
        >
          {this.props.children}
        </Button>
        <Tooltip
          target="tooltipbutton"
          isOpen={this.state.rpeTooltipIsOpen}
          toggle={this.toggleTooltip}
        >
          RPE format: 'Reps@RPE'. E.g. 5@9.5
        </Tooltip>
      </>
    );
  }
  private toggleTooltip = () =>
    this.setState(prevState => ({
      rpeTooltipIsOpen: !prevState.rpeTooltipIsOpen
    }));

  private handleClick = () => this.props.onClick(this.props.buttonMode);
}

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
