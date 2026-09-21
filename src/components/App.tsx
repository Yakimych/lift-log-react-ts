import * as React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import {
  addLogEntry,
  cancelEditingEntry,
  deleteLogEntry,
  startEditingEntry,
  updateLogEntry
} from "../effects/addEntryEffects";
import { reloadLifts } from "../effects/liftLogEffects";
import LiftLogService from "../services/liftLogService";
import { DialogAction } from "../store/dialogActions";
import { LiftLogAction } from "../store/liftLogActions";
import { NewEntryAction } from "../store/newEntryActions";
import { AppState } from "../store/types";
import { StoredLiftLogEntry } from "./../types/liftTypes";
import "./App.css";
import ConfirmModal from "./ConfirmModal";
import EntryModal from "./EntryModal";
import LiftLogContainer from "./LiftLogContainer";

type StateProps = {
  isLoading: boolean;
  networkErrorOccurred: boolean;
  errorMessage: string;
  isEditingEntry: boolean;
  isSavingEntry: boolean;
  logTitle?: string;
  logEntries: ReadonlyArray<StoredLiftLogEntry>;
};

type DispatchProps = {
  reloadLifts: (logName: string) => void;
  addLogEntry: (logName: string) => Promise<void>;
  updateLogEntry: (logName: string) => Promise<void>;
  deleteLogEntry: (logName: string, entryId: number) => Promise<void>;
  startEditingEntry: (entry: StoredLiftLogEntry) => void;
  cancelEditingEntry: () => void;
};

type RouteParams = {
  logName: string;
};

type Props = StateProps & DispatchProps & RouteComponentProps<RouteParams>;

const App: React.FC<Props> = props => {
  const logName = props.match.params.logName;
  const loadingMessage = `Loading board ${logName}`;
  const [entryPendingDeletion, setEntryPendingDeletion] = useState<
    StoredLiftLogEntry | undefined
  >(undefined);

  const getHeaderText = (): string => {
    if (props.isLoading) {
      return loadingMessage;
    } else if (props.networkErrorOccurred) {
      return props.errorMessage;
    } else {
      return props.logTitle || "";
    }
  };

  const handleSaveEntry = async () => {
    if (props.isEditingEntry) {
      await props.updateLogEntry(logName);
    } else {
      await props.addLogEntry(logName);
    }
    await props.reloadLifts(logName);
  };

  const handleConfirmDeleteEntry = async () => {
    if (!entryPendingDeletion) {
      return;
    }
    await props.deleteLogEntry(logName, entryPendingDeletion.id);
    setEntryPendingDeletion(undefined);
    await props.reloadLifts(logName);
  };

  const { reloadLifts, cancelEditingEntry: cancelEditing } = props;
  useEffect(() => {
    reloadLifts(logName);
  }, [logName, reloadLifts]);

  // Leaving the board should never keep a half-finished edit around.
  useEffect(() => cancelEditing, [cancelEditing]);

  const disabled = props.isLoading || props.networkErrorOccurred;

  return (
    <div className="App">
      <header className="App-header d-flex align-items-center justify-content-between">
        <h1 className="App-title">{getHeaderText()}</h1>
        <Link to="/" className="App-nav-link">
          All logs
        </Link>
      </header>
      <LiftLogContainer
        disabled={disabled}
        entries={props.logEntries}
        onEditEntry={props.startEditingEntry}
        onDeleteEntry={setEntryPendingDeletion}
      />
      <EntryModal close={props.cancelEditingEntry} onSave={handleSaveEntry} />
      <ConfirmModal
        isOpen={entryPendingDeletion !== undefined}
        isBusy={props.isSavingEntry}
        title="Delete entry"
        onConfirm={handleConfirmDeleteEntry}
        onCancel={() => setEntryPendingDeletion(undefined)}
      >
        {entryPendingDeletion && (
          <span>
            Delete the entry for <strong>{entryPendingDeletion.name}</strong> on{" "}
            {entryPendingDeletion.date.toISOString().substring(0, 10)}?
          </span>
        )}
      </ConfirmModal>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  isLoading: state.liftLogState.isLoading,
  networkErrorOccurred: state.liftLogState.networkErrorOccured,
  errorMessage: state.liftLogState.errorMessage || "",
  isEditingEntry: state.newEntryState.editingEntryId !== null,
  isSavingEntry: state.newEntryState.isSaving,
  logTitle: state.liftLogState.logTitle,
  logEntries: state.liftLogState.logEntries
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<
    AppState,
    LiftLogService,
    LiftLogAction | NewEntryAction | DialogAction
  >
): DispatchProps => ({
  reloadLifts: (logName: string) => dispatch(reloadLifts(logName)),
  addLogEntry: (logName: string) => dispatch(addLogEntry(logName)),
  updateLogEntry: (logName: string) => dispatch(updateLogEntry(logName)),
  deleteLogEntry: (logName: string, entryId: number) =>
    dispatch(deleteLogEntry(logName, entryId)),
  startEditingEntry: (entry: StoredLiftLogEntry) =>
    dispatch(startEditingEntry(entry)),
  cancelEditingEntry: () => dispatch(cancelEditingEntry())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
