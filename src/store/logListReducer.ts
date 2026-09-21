import { getType } from "typesafe-actions";
import { actions, LogListAction } from "./logListActions";
import { LogListState } from "./types";

const initialState: LogListState = {
  isLoading: true,
  isSaving: false,
  errorMessage: null,
  logs: [],
  newLogName: "",
  newLogTitle: "",
  editedLogName: null,
  editedLogTitle: "",
  logPendingDeletion: null
};

export const logListReducer = (
  state: LogListState = initialState,
  action: LogListAction
): LogListState => {
  switch (action.type) {
    case getType(actions.fetchLogs.request):
      return { ...state, isLoading: true, errorMessage: null };
    case getType(actions.fetchLogs.success):
      return {
        ...state,
        isLoading: false,
        errorMessage: null,
        logs: action.payload
      };
    case getType(actions.fetchLogs.failure):
      return { ...state, isLoading: false, errorMessage: action.payload };

    case getType(actions.changeNewLogName):
      return { ...state, newLogName: action.payload };
    case getType(actions.changeNewLogTitle):
      return { ...state, newLogTitle: action.payload };

    case getType(actions.startEditLog):
      return {
        ...state,
        errorMessage: null,
        editedLogName: action.payload.name,
        editedLogTitle: action.payload.title
      };
    case getType(actions.changeEditedTitle):
      return { ...state, editedLogTitle: action.payload };
    case getType(actions.cancelEditLog):
      return { ...state, editedLogName: null, editedLogTitle: "" };

    case getType(actions.confirmDeleteLog):
      return {
        ...state,
        errorMessage: null,
        logPendingDeletion: action.payload
      };
    case getType(actions.cancelDeleteLog):
      return { ...state, logPendingDeletion: null };

    case getType(actions.dismissError):
      return { ...state, errorMessage: null };

    case getType(actions.createLog.request):
    case getType(actions.updateLog.request):
    case getType(actions.deleteLog.request):
      return { ...state, isSaving: true, errorMessage: null };

    case getType(actions.createLog.success):
      return { ...state, isSaving: false, newLogName: "", newLogTitle: "" };
    case getType(actions.updateLog.success):
      return {
        ...state,
        isSaving: false,
        editedLogName: null,
        editedLogTitle: ""
      };
    case getType(actions.deleteLog.success):
      return { ...state, isSaving: false, logPendingDeletion: null };

    case getType(actions.createLog.failure):
    case getType(actions.updateLog.failure):
      return { ...state, isSaving: false, errorMessage: action.payload };
    case getType(actions.deleteLog.failure):
      return {
        ...state,
        isSaving: false,
        logPendingDeletion: null,
        errorMessage: action.payload
      };
  }
  return state;
};
