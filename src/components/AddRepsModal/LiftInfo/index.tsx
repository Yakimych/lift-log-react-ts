import * as React from "react";
import { LiftInfo } from "../../../types/LiftTypes";
import Comment from "./Comment";
import Links from "./Links";

type Props = {
  liftInfo: LiftInfo;
  onLiftInfoChange: (info: LiftInfo) => void;
};

type State = {
  hasComment: boolean;
};

class LiftInfoContainer extends React.Component<Props, State> {
  public state = {
    hasComment: !!this.props.liftInfo.comment
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
        <Links
          links={this.props.liftInfo.links}
          onLinkAdd={this.onLinkAdd}
          onLinkRemove={this.onLinkRemove}
          onLinkChange={this.onLinkChange}
        />
      </div>
    );
  }

  private onLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    const links = this.props.liftInfo.links.map(
      (link, i) => (i !== index ? link : { ...link, [name]: value })
    );
    this.props.onLiftInfoChange({ links } as LiftInfo);
  };

  private onLinkAdd = () => {
    const links = [...this.props.liftInfo.links, { text: "", url: "" }];
    this.props.onLiftInfoChange({ links } as LiftInfo);
  };

  private onLinkRemove = (index: number) => {
    const links = this.props.liftInfo.links.filter((_, i) => i !== index);
    this.props.onLiftInfoChange({ links } as LiftInfo);
  };

  private onCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const comment = e.target.value;
    this.props.onLiftInfoChange({ comment } as LiftInfo);
  };

  private onCommentToggle = () =>
    this.setState(prevState => ({ hasComment: !prevState.hasComment }));
}

export default LiftInfoContainer;
