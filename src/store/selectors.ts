import { canAddCustomSet, canAddLink } from "../store/dialogReducer";
import { AppState } from "./types";

export const getCanAddCustomSet = (state: AppState) =>
  canAddCustomSet(state.dialogState.customSets.length);

export const getCanAddLink = (state: AppState) =>
  canAddLink(state.dialogState.links.length);

export const getSetsReps = (state: AppState) => ({
  mode: state.dialogState.inputMode,
  numberOfSets: state.dialogState.numberOfSets,
  numberOfReps: state.dialogState.numberOfReps,
  customSetsStrings: state.dialogState.customSetsStrings
});

export const getIsEditingEntry = (state: AppState) =>
  state.newEntryState.editingEntryId !== null;

export const getCanSaveEntry = (state: AppState) =>
  state.newEntryState.name.length > 0 &&
  state.newEntryState.weightLifted !== null;

export const getCanCreateLog = (state: AppState) =>
  state.logListState.newLogName.trim().length >= 2 &&
  state.logListState.newLogTitle.trim().length > 0;
