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

const Comment: React.FunctionComponent<CommentProps> = props => {
  const { hasComment, onOpenComment, onCommentChange, comment } = props;

  return (
    <>
      {!hasComment && (
        <Button onClick={onOpenComment} size="sm">
          Add comment
        </Button>
      )}
      <AnimateHeight
        duration={350}
        className="w-100"
        height={hasComment ? "auto" : 0}
      >
        <Fade in={hasComment} unmountOnExit={true}>
          <Input
            maxLength={400}
            type="textarea"
            value={comment}
            onChange={e => onCommentChange(e.target.value)}
          />
        </Fade>
      </AnimateHeight>
    </>
  );
};

export default Comment;
