import * as React from "react";
import AnimateHeight from "react-animate-height";
import { Button, Fade, Input } from "reactstrap";

type Props = {
  hasComment: boolean;
  onCommentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCommentToggle: () => void;
  commentValue: string;
};

const Comment: React.SFC<Props> = props => {
  const { hasComment, onCommentToggle, onCommentChange, commentValue } = props;

  return (
    <>
      {!hasComment && (
        <Button onClick={onCommentToggle} size="sm">
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
            value={commentValue}
            onChange={onCommentChange}
          />
        </Fade>
      </AnimateHeight>
    </>
  );
};

export default Comment;
