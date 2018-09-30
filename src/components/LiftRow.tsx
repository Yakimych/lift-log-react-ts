import * as React from "react";
import { LiftLogEntry } from "../types/LiftTypes";
import { formatSets } from "../utils/LiftUtils";

const LiftRow = (props: LiftLogEntry) => {
  return (
    <div className="row">
      <span className="col">{props.date.format("YYYY-MM-DD")}</span>
      <span className="col">{props.name}</span>
      <span className="col">{props.weightLifted}</span>
      <span className="col">{formatSets(props.sets)}</span>
    </div>
  );
};

export default LiftRow;
