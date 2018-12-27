import { getType } from "typesafe-actions";
import { InputMode, Set } from "../types/LiftTypes";
import { formatSet, toValidNumberOfReps, toValidSet } from "../utils/LiftUtils";
import { actions, DialogAction } from "./dialogActions";
import { DialogState } from "./storeState";

const initialState: DialogState = {
  isOpen: false,
  inputMode: InputMode.SetsReps,
  numberOfSetsString: "3",
  numberOfSets: 3,
  numberOfRepsString: "5",
  numberOfReps: 5,
  customSetsStrings: [],
  customSets: [],
  commentIsShown: false,
  comment: "",
  canAddLink: true,
  links: []
};

const getSetsFromNumberSetsReps = (sets: number, reps: number): Set[] =>
  Array<Set>(sets).fill({ reps, rpe: null });

const maxNumberOfLinks = 3;

export const dialogReducer = (
  state: DialogState = initialState,
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
    case getType(actions.setInputMode): {
      const switchingToCustom =
        state.inputMode === InputMode.SetsReps &&
        action.payload === InputMode.CustomReps;

      const newCustomSets =
        switchingToCustom &&
        state.customSets.length === 0 &&
        state.numberOfSets &&
        state.numberOfReps
          ? getSetsFromNumberSetsReps(state.numberOfSets, state.numberOfReps)
          : state.customSets;

      return {
        ...state,
        customSetsStrings: newCustomSets.map(formatSet),
        customSets: newCustomSets,
        inputMode: action.payload
      };
    }
    case getType(actions.setNumberOfSets): {
      const numberOfSets = toValidNumberOfReps(action.payload);
      return {
        ...state,
        numberOfSets,
        numberOfSetsString: numberOfSets.toString()
      };
    }
    case getType(actions.setNumberOfReps): {
      const numberOfReps = toValidNumberOfReps(action.payload);
      return {
        ...state,
        numberOfReps,
        numberOfRepsString: numberOfReps.toString()
      };
    }
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
    case getType(actions.showComment):
      return {
        ...state,
        commentIsShown: true
      };
    case getType(actions.changeComment):
      return {
        ...state,
        comment: action.payload
      };
    case getType(actions.addLink):
      return {
        ...state,
        links:
          state.links.length < maxNumberOfLinks
            ? [...state.links, { text: "", url: "" }]
            : state.links
      };
    case getType(actions.removeLink):
      return {
        ...state,
        links: state.links.filter((l, i) => i !== action.payload)
      };
    case getType(actions.changeLinkText): {
      const { index, newText } = action.payload;
      const oldLink = state.links[index];
      return {
        ...state,
        links: Object.assign([], state.links, {
          [index]: { ...oldLink, text: newText }
        })
      };
    }
    case getType(actions.changeLinkUrl): {
      const { index, newUrl } = action.payload;
      const oldLink = state.links[index];
      return {
        ...state,
        links: Object.assign([], state.links, {
          [index]: { ...oldLink, url: newUrl }
        })
      };
    }
  }
  return state;
};
