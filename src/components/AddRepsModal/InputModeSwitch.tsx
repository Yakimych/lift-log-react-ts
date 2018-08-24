import * as React from "react";
import { Button, ButtonGroup } from "reactstrap";

export enum InputMode {
  SetsReps,
  CustomReps
}

type Props = {
  mode: InputMode;
  onChange: (mode: InputMode) => void;
};

type ButtonProps = {
  buttonMode: InputMode;
  currentMode: InputMode;
  onClick: (mode: InputMode) => void;
};

class InputModeButton extends React.Component<ButtonProps, {}> {
  public render() {
    const active = this.props.buttonMode === this.props.currentMode;
    return (
      <Button
        color="primary"
        size="sm"
        className={!active ? "btn-primary--lighter" : ""}
        onClick={this.handleClick}
        outline={true}
        active={active}
      >
        {this.props.children}
      </Button>
    );
  }

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
