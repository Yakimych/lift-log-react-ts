import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { actions as dialogActions } from "../../../redux/dialogActions";
import { getCanAddLink } from "../../../redux/selectors";
import { StoreState } from "../../../redux/storeState";
import Comment, { CommentDispatchProps, CommentStateProps } from "./Comment";
import Links, { LinksDispatchProps, LinksStateProps } from "./Links";

type StateProps = CommentStateProps & LinksStateProps;
type DispatchProps = CommentDispatchProps & LinksDispatchProps;

type Props = StateProps & DispatchProps;

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

const mapStateToProps = (state: StoreState): StateProps => ({
  comment: state.dialogState.comment,
  hasComment: state.dialogState.commentIsShown,
  links: state.dialogState.links,
  canAddLink: getCanAddLink(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onAddLink: () => dispatch(dialogActions.addLink()),
  onRemoveLink: (index: number) => dispatch(dialogActions.removeLink(index)),
  onChangeLinkText: (index: number, newText: string) =>
    dispatch(dialogActions.changeLinkText({ index, newText })),
  onChangeLinkUrl: (index: number, newUrl: string) =>
    dispatch(dialogActions.changeLinkUrl({ index, newUrl })),
  onCommentChange: (newValue: string) =>
    dispatch(dialogActions.changeComment(newValue)),
  onOpenComment: () => dispatch(dialogActions.showComment())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiftInfoContainer);
