import { InputMode, Set, SetsRepsInput } from "../types/LiftTypes";
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

export function formatSets(sets: Set[]): string {
  if (allRepsAreEqual(sets)) {
    const reps = sets.length > 0 ? sets[0].reps : 0;
    return `${sets.length}x${reps}`;
  }
  return sets.map(s => s.reps).join("-");
}

export function formatRepsSets(setsReps: SetsRepsInput): string {
  const sets = getSets(setsReps);
  return formatSets(sets);
}

export const getSets = (setsReps: SetsRepsInput): Set[] => {
  const { numberOfSets, numberOfReps, customSets, mode } = setsReps;

  return mode === InputMode.SetsReps
    ? Array<Set>(numberOfSets).fill({ reps: numberOfReps })
    : customSets;
};
