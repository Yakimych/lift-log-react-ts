import * as React from "react";
import { LiftInfo } from "../../../types/LiftTypes";
import Comment from "./Comment";
import Links from "./Links";

type Props = {
  liftInfo: LiftInfo;
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
  onChangeLinkText: (index: number, newText: string) => void;
  onChangeLinkUrl: (index: number, newUrl: string) => void;
  onCommentChange: (newValue: string) => void;
};

type State = {
  hasComment: boolean;
};

class LiftInfoContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    hasComment: !!this.props.liftInfo.comment
  };

  public render() {
    return (
      <div className="d-flex flex-column align-items-start">
        <Comment
          onCommentChange={this.props.onCommentChange}
          commentValue={this.props.liftInfo.comment}
          onCommentToggle={this.onCommentToggle}
          hasComment={this.state.hasComment}
        />
        <Links
          links={this.props.liftInfo.links}
          onLinkAdd={this.props.onAddLink}
          onLinkRemove={this.props.onRemoveLink}
          onLinkTextChange={this.props.onChangeLinkText}
          onLinkUrlChange={this.props.onChangeLinkUrl}
        />
      </div>
    );
  }

  private onCommentToggle = () =>
    this.setState(prevState => ({ hasComment: !prevState.hasComment }));
}

export default LiftInfoContainer;
