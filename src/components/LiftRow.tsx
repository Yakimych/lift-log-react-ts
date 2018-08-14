import * as React from "react";

const LiftRow = (props: any) => {
  return (
    <div className="row">
      <span className="col">{props.date.toLocaleDateString("sv")}</span>
      <span className="col">{props.name}</span>
      <span className="col">{props.weightLifted}</span>
      <span className="col">{props.reps}</span>
    </div>
  );
};

export default LiftRow;
