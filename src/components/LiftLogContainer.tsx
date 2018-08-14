import * as React from "react";
import { LiftLogEntry } from "./../types/LiftTypes";
import "./LiftLog.css";
import LiftRow from "./LiftRow";

type Props = {
  entries: LiftLogEntry[];
};

const LiftLogContainer = (props: Props) => {
  return (
    <div className="mt-3 mb-3 p-2 box-shadow lift-log-container">
      <div className="row">
        <h6 className="col">Date</h6>
        <h6 className="col">Name</h6>
        <h6 className="col">Weight lifted (kg)</h6>
        <h6 className="col">Sets/Reps</h6>
      </div>
      <div className="lifts">
        {props.entries.map((liftLogEntry, index) => (
          <LiftRow {...liftLogEntry} key={index} />
        ))}
      </div>
    </div>
  );
};

export default LiftLogContainer;
