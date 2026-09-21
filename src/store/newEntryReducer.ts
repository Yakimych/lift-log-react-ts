import { toValidFloatOrNull } from "src/utils/numberUtils";
import { getType } from "typesafe-actions";
import { actions, NewEntryAction } from "./newEntryActions";
import { NewEntryFormValues, NewEntryState } from "./types";

const emptyForm: NewEntryFormValues = {
  date: new Date(),
  name: "",
  weightLifted: null,
  weightLiftedString: ""
};

const initialState: NewEntryState = {
  ...emptyForm,
  isSaving: false,
  errorMessage: null,
  editingEntryId: null,
  parkedEntry: null
};

const formValuesOf = (state: NewEntryState): NewEntryFormValues => ({
  date: state.date,
  name: state.name,
  weightLifted: state.weightLifted,
  weightLiftedString: state.weightLiftedString
});

export const newEntryReducer = (
  state: NewEntryState = initialState,
  action: NewEntryAction
): NewEntryState => {
  switch (action.type) {
    case getType(actions.changeDate):
      return {
        ...state,
        date: action.payload
      };
    case getType(actions.changeName):
      return {
        ...state,
        name: action.payload
      };
    case getType(actions.changeWeightLifted): {
      const weightLiftedString = action.payload;
      return {
        ...state,
        weightLiftedString,
        weightLifted: toValidFloatOrNull(weightLiftedString)
      };
    }
    case getType(actions.startEdit): {
      const entry = action.payload;
      return {
        ...state,
        // Park the half-filled new entry so it comes back once editing ends.
        parkedEntry: state.parkedEntry || formValuesOf(state),
        editingEntryId: entry.id,
        errorMessage: null,
        date: entry.date,
        name: entry.name,
        weightLifted: entry.weightLifted,
        weightLiftedString:
          entry.weightLifted === null ? "" : entry.weightLifted.toString()
      };
    }
    case getType(actions.stopEdit):
      return {
        ...state,
        ...(state.parkedEntry || {}),
        parkedEntry: null,
        editingEntryId: null,
        errorMessage: null
      };
    case getType(actions.addLogEntry.request):
    case getType(actions.updateLogEntry.request):
    case getType(actions.deleteLogEntry.request):
      return {
        ...state,
        isSaving: true,
        errorMessage: null
      };
    case getType(actions.addLogEntry.success):
      return {
        ...state,
        isSaving: false
      };
    case getType(actions.updateLogEntry.success):
    case getType(actions.deleteLogEntry.success):
      return {
        ...state,
        ...(state.parkedEntry || {}),
        parkedEntry: null,
        editingEntryId: null,
        isSaving: false
      };
    case getType(actions.addLogEntry.failure):
    case getType(actions.updateLogEntry.failure):
    case getType(actions.deleteLogEntry.failure):
      return {
        ...state,
        isSaving: false,
        errorMessage: action.payload
      };
  }
  return state;
};
