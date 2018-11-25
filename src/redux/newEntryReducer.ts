import * as moment from "moment";
import { toValidFloatOrNull } from "src/utils/NumberUtils";
import { getType } from "typesafe-actions";
import { actions, NewEntryAction } from "./newEntryActions";
import { NewEntryState } from "./storeState";

export const newEntryReducer = (
  state: NewEntryState,
  action: NewEntryAction
): NewEntryState => {
  switch (action.type) {
    case getType(actions.changeDate):
      const dateString = action.payload;
      const date = moment(dateString);
      return {
        ...state,
        dateString,
        date: date.isValid() ? date : null
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
