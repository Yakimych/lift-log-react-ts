import * as React from "react";
import { LiftLogEntry } from "../types/liftTypes";
import { formatSets } from "../utils/liftUtils";

const formatDate = (date: Date) => date.toISOString().substring(0, 10);

const LiftRow: React.FunctionComponent<LiftLogEntry> = props => {
  return (
    <div className="row">
      <span className="col">{formatDate(props.date)}</span>
      <span className="col">{props.name}</span>
      <span className="col">{props.weightLifted}</span>
      <span className="col">{formatSets(props.sets)}</span>
    </div>
  );
};

export default LiftRow;
