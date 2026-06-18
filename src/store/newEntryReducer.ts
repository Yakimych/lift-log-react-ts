import { toValidFloatOrNull } from "src/utils/numberUtils";
import { getType } from "typesafe-actions";
import { actions, NewEntryAction } from "./newEntryActions";
import { NewEntryState } from "./types";

const initialState: NewEntryState = {
  date: new Date(),
  name: "",
  weightLifted: null,
  weightLiftedString: ""
};

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
    case getType(actions.changeWeightLifted):
      const weightLiftedString = action.payload;
      return {
        ...state,
        weightLiftedString,
        weightLifted: toValidFloatOrNull(weightLiftedString)
      };
    case getType(actions.addLogEntry.request):
      return {
        ...state
      };
    case getType(actions.addLogEntry.success):
      return {
        ...state
      };
    case getType(actions.addLogEntry.failure):
      return {
        ...state
      };
  }
  return state;
};
