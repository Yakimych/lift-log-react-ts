import * as React from "react";
import { LiftLogEntry, Rep } from "../types/LiftTypes";

const LiftRow = (props: LiftLogEntry) => {
  return (
    <div className="row">
      <span className="col">{props.date.toLocaleDateString("sv")}</span>
      <span className="col">{props.name}</span>
      <span className="col">{props.weightLifted}</span>
      <span className="col">{formatReps(props.reps)}</span>
    </div>
  );
};

const allRepsAreEqual = (reps: Rep[]) =>
  reps.every(r => r.number === reps[0].number);

const formatReps = (reps: Rep[]) => {
  if (allRepsAreEqual(reps)) {
    return `${reps.length}x${reps[0].number}`;
  }
  return reps.map(r => r.number).join("-");
};

export default LiftRow;
