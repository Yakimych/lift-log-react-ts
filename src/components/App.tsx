import * as React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { RouteProps } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { addLogEntry } from "../effects/addEntryEffects";
import { reloadLifts } from "../effects/liftLogEffects";
import LiftLogService from "../services/liftLogService";
import { DialogAction } from "../store/dialogActions";
import { LiftLogAction } from "../store/liftLogActions";
import { NewEntryAction } from "../store/newEntryActions";
import { AppState } from "../store/types";
import { LiftLogEntry } from "./../types/liftTypes";
import "./App.css";
import LiftLogContainer from "./LiftLogContainer";

type StateProps = {
  isLoading: boolean;
  networkErrorOccurred: boolean;
  errorMessage: string;
  logTitle?: string;
  logEntries: ReadonlyArray<LiftLogEntry>;
};

type DispatchProps = {
  reloadLifts: (logName: string) => void;
  addLogEntry: (logName: string) => Promise<void>;
};

type Props = StateProps & DispatchProps & RouteProps;

const getLogNameFromRoute = (props: RouteProps) =>
  !!props.location ? props.location.pathname.substr(1) : "";

const App: React.FC<Props> = props => {
  const logName = getLogNameFromRoute(props);
  const loadingMessage = `Loading board ${logName}`;

  const getHeaderText = (): string => {
    if (props.isLoading) {
      return loadingMessage;
    } else if (props.networkErrorOccurred) {
      return props.errorMessage;
    } else {
      return props.logTitle || "";
    }
  };

  const handleAddEntry = async () => {
    await props.addLogEntry(logName);
    await props.reloadLifts(logName);
  };

  useEffect(() => props.reloadLifts(logName), []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">{getHeaderText()}</h1>
      </header>
      <LiftLogContainer
        disabled={props.isLoading || props.networkErrorOccurred}
        entries={props.logEntries}
        onAddEntry={() => handleAddEntry()}
      />
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  isLoading: state.liftLogState.isLoading,
  networkErrorOccurred: state.liftLogState.networkErrorOccured,
  errorMessage: state.liftLogState.errorMessage || "",
  logTitle: state.liftLogState.logTitle,
  logEntries: state.liftLogState.logEntries
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<
    AppState,
    LiftLogService,
    LiftLogAction | NewEntryAction | DialogAction
  >
): DispatchProps => ({
  reloadLifts: (logName: string) => dispatch(reloadLifts(logName)),
  addLogEntry: (logName: string) => dispatch(addLogEntry(logName))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
