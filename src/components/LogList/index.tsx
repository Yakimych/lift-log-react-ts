import * as React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Alert, Spinner } from "reactstrap";
import { ThunkDispatch } from "redux-thunk";
import {
  createLog,
  deleteLog,
  loadLogs,
  saveLogTitle
} from "../../effects/logListEffects";
import LiftLogService from "../../services/liftLogService";
import { actions as logListActions } from "../../store/logListActions";
import { getCanCreateLog } from "../../store/selectors";
import { AppState } from "../../store/types";
import { LiftLogSummary } from "../../types/liftTypes";
import "../App.css";
import "../LiftLog.css";
import ConfirmModal from "../ConfirmModal";
import CreateLogForm from "./CreateLogForm";
import "./style.css";
import LogRow from "./LogRow";

type StateProps = {
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  logs: ReadonlyArray<LiftLogSummary>;
  newLogName: string;
  newLogTitle: string;
  canCreateLog: boolean;
  editedLogName: string | null;
  editedLogTitle: string;
  logPendingDeletion: LiftLogSummary | null;
};

type DispatchProps = {
  loadLogs: () => void;
  createLog: () => void;
  saveLogTitle: () => void;
  deleteLog: () => void;
  changeNewLogName: (name: string) => void;
  changeNewLogTitle: (title: string) => void;
  startEditLog: (log: LiftLogSummary) => void;
  changeEditedTitle: (title: string) => void;
  cancelEditLog: () => void;
  confirmDeleteLog: (log: LiftLogSummary) => void;
  cancelDeleteLog: () => void;
  dismissError: () => void;
};

type Props = StateProps & DispatchProps;

const LogList: React.FC<Props> = props => {
  const { loadLogs: load } = props;
  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="App">
      <header className="App-header d-flex align-items-center">
        <h1 className="App-title">Lift logs</h1>
      </header>
      <div className="mt-3 mb-3 p-2 box-shadow lift-log-container">
        {props.errorMessage && (
          <Alert color="danger" toggle={props.dismissError}>
            {props.errorMessage}
          </Alert>
        )}
        <CreateLogForm
          name={props.newLogName}
          title={props.newLogTitle}
          canCreate={props.canCreateLog}
          isSaving={props.isSaving}
          onNameChange={props.changeNewLogName}
          onTitleChange={props.changeNewLogTitle}
          onCreate={props.createLog}
        />
        <hr />
        <div className="row">
          <h6 className="col">Title</h6>
          <h6 className="col">Link</h6>
          <h6 className="col">Entries</h6>
          <h6 className="col-auto log-row-actions">Actions</h6>
        </div>
        {props.isLoading ? (
          <div className="p-3 text-muted">
            <Spinner size="sm" className="mr-2" />
            Loading logs...
          </div>
        ) : props.logs.length === 0 ? (
          <div className="p-3 text-muted">
            No logs yet. Create the first one above.
          </div>
        ) : (
          props.logs.map(log => (
            <LogRow
              key={log.name}
              log={log}
              isEdited={props.editedLogName === log.name}
              editedTitle={props.editedLogTitle}
              isSaving={props.isSaving}
              onStartEdit={props.startEditLog}
              onEditedTitleChange={props.changeEditedTitle}
              onSaveTitle={props.saveLogTitle}
              onCancelEdit={props.cancelEditLog}
              onDelete={props.confirmDeleteLog}
            />
          ))
        )}
      </div>
      <ConfirmModal
        isOpen={props.logPendingDeletion !== null}
        isBusy={props.isSaving}
        title="Delete log"
        onConfirm={props.deleteLog}
        onCancel={props.cancelDeleteLog}
      >
        {props.logPendingDeletion && (
          <span>
            Delete the log{" "}
            <strong>
              {props.logPendingDeletion.title || props.logPendingDeletion.name}
            </strong>{" "}
            and all {props.logPendingDeletion.entryCount} of its entries? This
            cannot be undone.
          </span>
        )}
      </ConfirmModal>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  isLoading: state.logListState.isLoading,
  isSaving: state.logListState.isSaving,
  errorMessage: state.logListState.errorMessage,
  logs: state.logListState.logs,
  newLogName: state.logListState.newLogName,
  newLogTitle: state.logListState.newLogTitle,
  canCreateLog: getCanCreateLog(state),
  editedLogName: state.logListState.editedLogName,
  editedLogTitle: state.logListState.editedLogTitle,
  logPendingDeletion: state.logListState.logPendingDeletion
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, LiftLogService, any>
): DispatchProps => ({
  loadLogs: () => dispatch(loadLogs()),
  createLog: () => dispatch(createLog()),
  saveLogTitle: () => dispatch(saveLogTitle()),
  deleteLog: () => dispatch(deleteLog()),
  changeNewLogName: (name: string) =>
    dispatch(logListActions.changeNewLogName(name)),
  changeNewLogTitle: (title: string) =>
    dispatch(logListActions.changeNewLogTitle(title)),
  startEditLog: (log: LiftLogSummary) =>
    dispatch(logListActions.startEditLog(log)),
  changeEditedTitle: (title: string) =>
    dispatch(logListActions.changeEditedTitle(title)),
  cancelEditLog: () => dispatch(logListActions.cancelEditLog()),
  confirmDeleteLog: (log: LiftLogSummary) =>
    dispatch(logListActions.confirmDeleteLog(log)),
  cancelDeleteLog: () => dispatch(logListActions.cancelDeleteLog()),
  dismissError: () => dispatch(logListActions.dismissError())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogList);
