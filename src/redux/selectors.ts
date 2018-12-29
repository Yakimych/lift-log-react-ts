import { canAddCustomSet, canAddLink } from "../redux/dialogReducer";
import { StoreState } from "../redux/storeState";

export const getCanAddCustomSet = (state: StoreState) =>
  canAddCustomSet(state.dialogState.customSets.length);

export const getCanAddLink = (state: StoreState) =>
  canAddLink(state.dialogState.links.length);
