import { Set } from "../types/LiftTypes";

export const allRepsAreEqual = (sets: Set[]) =>
  sets.every(s => s.reps === sets[0].reps);

export const formatSets = (sets: Set[]) => {
  if (allRepsAreEqual(sets)) {
    return `${sets.length}x${sets[0].reps}`;
  }
  return sets.map(s => s.reps).join("-");
};
