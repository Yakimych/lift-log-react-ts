import * as React from "react";
import "./LiftLog.css";
import LiftRow from "./LiftRow";

const LiftLog = () => {
  return (
    <div className="mt-3 mb-3 p-2 box-shadow lift-log-container">
      <div className="row">
        <h6 className="col">Date</h6>
        <h6 className="col">Name</h6>
        <h6 className="col">Weight lifted (kg)</h6>
        <h6 className="col">Sets/Reps</h6>
      </div>
      <div className="lifts">
        <LiftRow
          date={new Date("2018-01-01")}
          name={"Bob"}
          weightLifted={80}
          reps={"3x5"}
        />
        <LiftRow
          date={new Date("2018-01-02")}
          name={"Alice"}
          weightLifted={60}
          reps={"5-5-3"}
        />
      </div>
    </div>
  );
};

export default LiftLog;
