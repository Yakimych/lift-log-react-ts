import * as moment from "moment";
import { toValidFloatOrNull } from "src/utils/NumberUtils";
import { getType } from "typesafe-actions";
// import { Set } from "../types/LiftTypes";
// import { DEFAULT_REP_VALUE, DEFAULT_SET_VALUE } from "../utils/LiftUtils";
import { actions, NewEntryAction } from "./newEntryActions";
import { NewEntryState } from "./storeState";

// const getDefaultSets = () => {
//   return Array<Set>(DEFAULT_SET_VALUE).fill({
//     reps: DEFAULT_REP_VALUE,
//     rpe: null
//   });
// };

// const getDefaultLogEntryReps = (): LiftLogEntryReps => {
//   return {
//     mode: InputMode.SetsReps,
//     numberOfReps: DEFAULT_REP_VALUE,
//     numberOfSets: DEFAULT_SET_VALUE,
//     customSets: getDefaultSets(),
//     links: [],
//     comment: ""
//   };
// };

const getDefaultState = (): NewEntryState => {
  // const liftLogReps = getDefaultLogEntryReps();
  return {
    date: moment(),
    // TODO: Doublecheck string format
    dateString: moment().toString(),
    name: "",
    weightLifted: null,
    weightLiftedString: ""
    // liftLogReps,
    // addRepsModalIsOpen: false
  };
};

const initialState: NewEntryState = getDefaultState();

export const newEntryReducer = (
  state: NewEntryState = initialState,
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
