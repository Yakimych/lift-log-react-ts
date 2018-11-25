import { getType } from "typesafe-actions";
import { fetchLiftLogActions, LiftLogAction } from "./liftLogActions";
import { LiftLogState } from "./liftLogState";

export const liftLogReducer = (
  state: LiftLogState,
  action: LiftLogAction
): LiftLogState => {
  switch (action.type) {
    case getType(fetchLiftLogActions.request):
      return { ...state, isLoading: true, networkErrorOccured: false };
    case getType(fetchLiftLogActions.success):
      // TODO: Check what else is set in the component
      return {
        ...state,
        isLoading: false,
        networkErrorOccured: false,
        logTitle: action.payload.title,
        logEntries: action.payload.entries
      };
    case getType(fetchLiftLogActions.failure):
      return {
        ...state,
        isLoading: false,
        networkErrorOccured: true,
        errorMessage: action.payload
      };
  }
  return state;
};
