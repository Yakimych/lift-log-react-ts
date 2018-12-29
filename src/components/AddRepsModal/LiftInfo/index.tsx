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
  onOpenComment: () => void;
  commentIsShown: boolean;
};

const LiftInfoContainer: React.FunctionComponent<Props> = props => {
  return (
    <div className="d-flex flex-column align-items-start">
      <Comment
        onCommentChange={props.onCommentChange}
        commentValue={props.liftInfo.comment}
        onOpenComment={props.onOpenComment}
        hasComment={props.commentIsShown}
      />
      <Links
        links={props.liftInfo.links}
        onLinkAdd={props.onAddLink}
        onLinkRemove={props.onRemoveLink}
        onLinkTextChange={props.onChangeLinkText}
        onLinkUrlChange={props.onChangeLinkUrl}
      />
    </div>
  );
};

export default LiftInfoContainer;
