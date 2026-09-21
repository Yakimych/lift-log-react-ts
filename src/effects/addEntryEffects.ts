import { ThunkAction, ThunkDispatch } from "redux-thunk";
import LiftLogService from "../services/liftLogService";
import { actions as dialogActions, DialogAction } from "../store/dialogActions";
import { actions, NewEntryAction } from "../store/newEntryActions";
import { AppState } from "../store/types";
import {
  LiftLogEntry,
  SetsReps,
  StoredLiftLogEntry
} from "../types/liftTypes";
import { getSets } from "../utils/liftUtils";
import { setLastUsedName } from "../utils/localStorageUtils";

type EntryThunk<TResult = Promise<any>> = ThunkAction<
  TResult,
  AppState,
  LiftLogService,
  NewEntryAction | DialogAction
>;

type EntryDispatch = ThunkDispatch<
  AppState,
  LiftLogService,
  NewEntryAction | DialogAction
>;

const getEntryFromState = (state: AppState): LiftLogEntry => {
  const setsReps: SetsReps = {
    mode: state.dialogState.inputMode,
    numberOfSets: state.dialogState.numberOfSets,
    numberOfReps: state.dialogState.numberOfReps,
    customSetsStrings: state.dialogState.customSetsStrings
  };

  return {
    date: state.newEntryState.date || new Date(),
    name: state.newEntryState.name,
    weightLifted: state.newEntryState.weightLifted,
    sets: getSets(setsReps),
    comment: state.dialogState.comment,
    links: state.dialogState.links.filter(link => !!link.url)
  };
};

export const addLogEntry = (logName: string): EntryThunk => (
  dispatch: EntryDispatch,
  getState: () => AppState,
  liftLogService: LiftLogService
) => {
  const newEntry = getEntryFromState(getState());

  dispatch(actions.addLogEntry.request(newEntry));

  return liftLogService
    .addEntry(logName, newEntry)
    .then(() => {
      setLastUsedName(newEntry.name);
      dispatch(actions.addLogEntry.success());
      dispatch(dialogActions.reset());
    })
    .catch(() =>
      dispatch(
        actions.addLogEntry.failure(
          `Error while adding entry for ${newEntry.name}`
        )
      )
    );
};

/** Fills both the entry form and the dialog from an already saved entry. */
export const startEditingEntry = (entry: StoredLiftLogEntry): EntryThunk<
  void
> => (dispatch: EntryDispatch) => {
  dispatch(actions.startEdit(entry));
  dispatch(dialogActions.loadEntry(entry));
};

export const cancelEditingEntry = (): EntryThunk<void> => (
  dispatch: EntryDispatch
) => {
  dispatch(actions.stopEdit());
  dispatch(dialogActions.reset());
};

export const updateLogEntry = (logName: string): EntryThunk => (
  dispatch: EntryDispatch,
  getState: () => AppState,
  liftLogService: LiftLogService
) => {
  const state = getState();
  const entryId = state.newEntryState.editingEntryId;
  if (entryId === null) {
    return Promise.resolve();
  }

  const updatedEntry = getEntryFromState(state);

  dispatch(actions.updateLogEntry.request(updatedEntry));

  return liftLogService
    .updateEntry(logName, entryId, updatedEntry)
    .then(() => {
      dispatch(actions.updateLogEntry.success());
      dispatch(dialogActions.reset());
    })
    .catch(() =>
      dispatch(
        actions.updateLogEntry.failure(
          `Error while saving entry for ${updatedEntry.name}`
        )
      )
    );
};

export const deleteLogEntry = (
  logName: string,
  entryId: number
): EntryThunk => (
  dispatch: EntryDispatch,
  getState: () => AppState,
  liftLogService: LiftLogService
) => {
  dispatch(actions.deleteLogEntry.request(entryId));

  return liftLogService
    .deleteEntry(logName, entryId)
    .then(() => {
      dispatch(actions.deleteLogEntry.success());
      dispatch(dialogActions.reset());
    })
    .catch(() =>
      dispatch(actions.deleteLogEntry.failure("Error while deleting the entry"))
    );
};
