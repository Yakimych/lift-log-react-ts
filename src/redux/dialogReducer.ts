import { Set } from "src/types/LiftTypes";
import {
  formatSet,
  toValidNumberOfReps,
  toValidSet
} from "src/utils/LiftUtils";
import { getType } from "typesafe-actions";
import { actions, DialogAction } from "./dialogAction";
import { DialogState } from "./storeState";

export const newEntryReducer = (
  state: DialogState,
  action: DialogAction
): DialogState => {
  switch (action.type) {
    case getType(actions.open):
      return {
        ...state,
        isOpen: true
      };
    case getType(actions.close):
      return {
        ...state,
        isOpen: false
      };
    case getType(actions.setInputMode):
      return {
        ...state,
        inputMode: action.payload
      };
    case getType(actions.setNumberOfSets):
      const numberOfSets = toValidNumberOfReps(action.payload);
      return {
        ...state,
        numberOfSets,
        numberOfSetsString: numberOfSets.toString()
      };
    case getType(actions.setNumberOfReps):
      const numberOfReps = toValidNumberOfReps(action.payload);
      return {
        ...state,
        numberOfReps,
        numberOfRepsString: numberOfReps.toString()
      };
    case getType(actions.addCustomSet): {
      const lastCustomSet = state.customSets[state.customSets.length - 1];
      const customSets = [...state.customSets, lastCustomSet];
      return {
        ...state,
        customSets,
        customSetsStrings: customSets.map(formatSet)
      };
    }
    case getType(actions.removeCustomSet): {
      const indexToRemove = action.payload;
      const customSets = state.customSets.filter((_, i) => i !== indexToRemove);
      return {
        ...state,
        customSets,
        customSetsStrings: customSets.map(formatSet)
      };
    }
    case getType(actions.changeCustomSet): {
      const { index, value } = action.payload;

      // TODO: Should this be a separate action (dispatched onBlur)?
      const customSets: Set[] = Object.assign([], state.customSets, {
        [index]: toValidSet(value)
      });

      const customSetsStrings = Object.assign([], state.customSetsStrings, {
        [index]: value
      });

      return {
        ...state,
        customSets,
        customSetsStrings
      };
    }
    // TODO: Comments, Links, Tests?
  }
  return state;
};
