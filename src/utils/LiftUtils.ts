import { Set } from "../types/LiftTypes";
import { toValidPositiveInteger } from "./NumberUtils";

export const MAX_REP_SET_VALUE = 30;
export const DEFAULT_SET_VALUE = 3;
export const DEFAULT_REP_VALUE = 5;

export const toValidRepSet = (numericString: string) => {
  const repSetNumber = toValidPositiveInteger(numericString);
  return Math.min(repSetNumber, MAX_REP_SET_VALUE);
};

export const allRepsAreEqual = (sets: Set[]) =>
  sets.length !== 0 ? sets.every(s => s.reps === sets[0].reps) : true;

export const formatSets = (sets: Set[]) => {
  if (allRepsAreEqual(sets)) {
    return `${sets.length}x${sets[0].reps}`;
  }
  return sets.map(s => s.reps).join("-");
};
