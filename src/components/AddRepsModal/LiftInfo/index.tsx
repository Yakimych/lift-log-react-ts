import * as React from "react";
import Comment, { CommentProps } from "./Comment";
import Links, { LinksProps } from "./Links";

type Props = CommentProps & LinksProps;

const LiftInfoContainer: React.FunctionComponent<Props> = props => {
  return (
    <div className="d-flex flex-column align-items-start">
      <Comment
        onCommentChange={props.onCommentChange}
        comment={props.comment}
        onOpenComment={props.onOpenComment}
        hasComment={props.hasComment}
      />
      <Links
        links={props.links}
        canAddLink={props.canAddLink}
        onAddLink={props.onAddLink}
        onRemoveLink={props.onRemoveLink}
        onChangeLinkText={props.onChangeLinkText}
        onChangeLinkUrl={props.onChangeLinkUrl}
      />
    </div>
  );
};

export default LiftInfoContainer;
