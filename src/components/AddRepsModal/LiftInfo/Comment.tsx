import * as React from "react";
import AnimateHeight from "react-animate-height";
import { Button, Fade, Input } from "reactstrap";

export type CommentStateProps = {
  comment: string;
  hasComment: boolean;
};

export type CommentDispatchProps = {
  onCommentChange: (newValue: string) => void;
  onOpenComment: () => void;
};

export type CommentProps = CommentStateProps & CommentDispatchProps;

const Comment: React.FunctionComponent<CommentProps> = props => (
  <>
    {!props.hasComment && (
      <Button onClick={props.onOpenComment} size="sm">
        Add comment
      </Button>
    )}
    <AnimateHeight
      duration={350}
      className="w-100"
      height={props.hasComment ? "auto" : 0}
    >
      <Fade in={props.hasComment} unmountOnExit={true}>
        <Input
          maxLength={400}
          type="textarea"
          value={props.comment}
          onChange={e => props.onCommentChange(e.target.value)}
        />
      </Fade>
    </AnimateHeight>
  </>
);

export default Comment;
