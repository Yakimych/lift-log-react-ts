import { InputMode, Set, SetsReps } from "../types/liftTypes";
import { toValidPositiveInteger, toValidRpe } from "./numberUtils";

export const MAX_REP_SET_VALUE = 30;
export const DEFAULT_SET_VALUE = 3;
export const DEFAULT_REP_VALUE = 5;

export const toValidNumberOfReps = (numericString: string) => {
  const repSetNumber = toValidPositiveInteger(numericString);
  return Math.min(repSetNumber, MAX_REP_SET_VALUE);
};

export const toValidSet = (repsWithRpe: string): Set => {
  const stringParts = repsWithRpe.split("@");
  const repsString = stringParts[0];
  const repNumber = toValidPositiveInteger(repsString);
  const validRepNumber = Math.min(repNumber, MAX_REP_SET_VALUE);

  const rpe: number | null =
    stringParts.length > 1 ? toValidRpe(stringParts[1]) : null;

  return { reps: validRepNumber, rpe };
};

export const allRepsAreEqualAndWithoutRpes = (sets: ReadonlyArray<Set>) =>
  sets.length !== 0
    ? sets.every(s => s.reps === sets[0].reps && s.rpe === null)
    : true;

export function formatSets(sets: ReadonlyArray<Set>): string {
  if (allRepsAreEqualAndWithoutRpes(sets)) {
    const reps = sets.length > 0 ? sets[0].reps : 0;
    return `${sets.length}x${reps}`;
  }
  return sets.map(s => s.reps).join("-");
}

export function formatRepsSets(setsReps: SetsReps): string {
  const sets = getSets(setsReps);
  return formatSets(sets);
}

export const getSets = (setsReps: SetsReps): ReadonlyArray<Set> => {
  const { numberOfSets, numberOfReps, customSetsStrings, mode } = setsReps;

  return mode === InputMode.SetsReps
    ? Array<Set>(numberOfSets).fill({ reps: numberOfReps, rpe: null })
    : customSetsStrings.map(toValidSet);
};

export const formatRpe = (rpe: number | null) =>
  rpe !== null ? `@${rpe}` : "";

export const formatSet = (set: Set) => `${set.reps}${formatRpe(set.rpe)}`;
