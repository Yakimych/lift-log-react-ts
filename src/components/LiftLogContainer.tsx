import * as React from "react";
import { StoredLiftLogEntry } from "./../types/liftTypes";
import AddLogEntry from "./AddLogEntry";
import "./LiftLog.css";
import LiftRow from "./LiftRow";

type Props = {
  disabled: boolean;
  entries: ReadonlyArray<StoredLiftLogEntry>;
  onEditEntry: (entry: StoredLiftLogEntry) => void;
  onDeleteEntry: (entry: StoredLiftLogEntry) => void;
};

const byDateNewestFirst = (
  entry: StoredLiftLogEntry,
  otherEntry: StoredLiftLogEntry
) => otherEntry.date.getTime() - entry.date.getTime();

const LiftLogContainer: React.FunctionComponent<Props> = props => {
  return (
    <div className="mt-3 mb-3 p-2 box-shadow lift-log-container">
      <div className="row">
        <h6 className="col">Date</h6>
        <h6 className="col">Name</h6>
        <h6 className="col">Weight lifted (kg)</h6>
        <h6 className="col">Sets/Reps</h6>
      </div>
      <AddLogEntry disabled={props.disabled} />
      <div className="lifts">
        {props.entries
          .concat()
          .sort(byDateNewestFirst)
          .map(liftLogEntry => (
            <LiftRow
              key={liftLogEntry.id}
              entry={liftLogEntry}
              disabled={props.disabled}
              onEdit={props.onEditEntry}
              onDelete={props.onDeleteEntry}
            />
          ))}
      </div>
    </div>
  );
};

export default LiftLogContainer;
