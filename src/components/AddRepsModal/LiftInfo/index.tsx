import * as React from "react";
import { LiftInfo } from "../../../types/LiftTypes";
import Comment from "./Comment";

type Prop = {
  liftInfo: LiftInfo;
  onLiftInfoChange: (info: LiftInfo) => void;
};

type State = {
  hasComment: boolean;
};

class LiftInfoContainer extends React.Component<Prop, State> {
  public state = {
    hasComment: false
  };
  public render() {
    return (
      <div className="d-flex flex-column align-items-start">
        <Comment
          onCommentChange={this.onCommentChange}
          commentValue={this.props.liftInfo.comment}
          onCommentToggle={this.onCommentToggle}
          hasComment={this.state.hasComment}
        />
        {/* <Button>Add link</Button> */}
      </div>
    );
  }

  private onCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const comment = e.target.value;
    this.props.onLiftInfoChange({ comment } as LiftInfo);
  };
  private onCommentToggle = () =>
    this.setState(prevState => ({ hasComment: !prevState.hasComment }));
}

export default LiftInfoContainer;
