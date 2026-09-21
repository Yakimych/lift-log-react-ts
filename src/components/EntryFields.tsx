import * as React from "react";
import DatePickerImport from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { actions as newEntryActions } from "../store/newEntryActions";
import { AppState } from "../store/types";
import { interopDefault } from "../utils/interopDefault";

const DatePicker = interopDefault(DatePickerImport);

type StateProps = {
  name: string;
  date: Date | null;
  weightLiftedStringValue: string;
};

type DispatchProps = {
  changeName: (name: string) => void;
  changeDate: (date: Date | null) => void;
  changeWeightLifted: (weightLiftedString: string) => void;
};

type OwnProps = {
  disabled: boolean;
  /** Stacks the fields with labels instead of laying them out as grid columns. */
  stacked?: boolean;
};

type Props = StateProps & DispatchProps & OwnProps;

const EntryFields: React.FunctionComponent<Props> = props => {
  const fieldClassName = props.stacked ? "mb-2" : "col";
  const label = (text: string) =>
    props.stacked ? (
      <label className="d-block mb-0 small text-muted">{text}</label>
    ) : null;

  return (
    <>
      <div className={fieldClassName}>
        {label("Date")}
        <DatePicker
          disabled={props.disabled}
          dateFormat="yyyy-MM-dd"
          selected={props.date}
          onChange={props.changeDate}
          className="form-control form-control-sm log-entry-input"
        />
      </div>
      <div className={fieldClassName}>
        {label("Name")}
        <input
          disabled={props.disabled}
          className="form-control form-control-sm log-entry-input"
          type="text"
          placeholder="Name"
          maxLength={50}
          value={props.name}
          onChange={e => props.changeName(e.target.value)}
        />
      </div>
      <div className={fieldClassName}>
        {label("Weight lifted (kg)")}
        <input
          disabled={props.disabled}
          className="form-control form-control-sm log-entry-input"
          type="text"
          placeholder="Weight"
          value={props.weightLiftedStringValue}
          onChange={e => props.changeWeightLifted(e.target.value)}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  date: state.newEntryState.date,
  name: state.newEntryState.name,
  weightLiftedStringValue: state.newEntryState.weightLiftedString
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  changeName: (newName: string) =>
    dispatch(newEntryActions.changeName(newName)),
  changeDate: (newDate: Date | null) =>
    dispatch(newEntryActions.changeDate(newDate)),
  changeWeightLifted: (newWeightLiftedString: string) =>
    dispatch(newEntryActions.changeWeightLifted(newWeightLiftedString))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryFields);
