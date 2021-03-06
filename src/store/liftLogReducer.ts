import { getType } from "typesafe-actions";
import { fetchLiftLogActions, LiftLogAction } from "./liftLogActions";
import { LiftLogState } from "./liftLogState";

const initialState: LiftLogState = {
  isLoading: true,
  networkErrorOccured: false,
  logEntries: [],
  logTitle: ""
};

export const liftLogReducer = (
  state: LiftLogState = initialState,
  action: LiftLogAction
): LiftLogState => {
  switch (action.type) {
    case getType(fetchLiftLogActions.request):
      return { ...state, isLoading: true, networkErrorOccured: false };
    case getType(fetchLiftLogActions.success):
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
