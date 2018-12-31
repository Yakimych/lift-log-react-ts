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
