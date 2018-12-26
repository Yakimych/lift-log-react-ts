import * as moment from "moment";
import * as React from "react";
import { LiftLogEntry } from "./../types/LiftTypes";
import AddLogEntry from "./AddLogEntry";
import "./LiftLog.css";
import LiftRow from "./LiftRow";

type Props = {
  disabled: boolean;
  entries: ReadonlyArray<LiftLogEntry>;
  onAddEntry: (entry: LiftLogEntry) => void;
};

const byDateNewestFirst = (entry: LiftLogEntry, otherEntry: LiftLogEntry) =>
  moment.utc(otherEntry.date).diff(moment.utc(entry.date));

const LiftLogContainer: React.SFC<Props> = props => {
  return (
    <div className="mt-3 mb-3 p-2 box-shadow lift-log-container">
      <div className="row">
        <h6 className="col">Date</h6>
        <h6 className="col">Name</h6>
        <h6 className="col">Weight lifted (kg)</h6>
        <h6 className="col">Sets/Reps</h6>
      </div>
      <AddLogEntry disabled={props.disabled} onAddEntry={props.onAddEntry} />
      <div className="lifts">
        {props.entries
          .concat()
          .sort(byDateNewestFirst)
          .map((liftLogEntry, index) => (
            <LiftRow {...liftLogEntry} key={index} />
          ))}
      </div>
    </div>
  );
};

export default LiftLogContainer;
