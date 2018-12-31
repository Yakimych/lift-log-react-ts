import * as React from "react";
import { connect } from "react-redux";
import { RouteProps } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { addLogEntry } from "../effects/addEntryEffects";
import { reloadLifts } from "../effects/liftLogEffects";
import LiftLogService from "../services/LiftLogService";
import { DialogAction } from "../store/dialogActions";
import { LiftLogAction } from "../store/liftLogActions";
import { NewEntryAction } from "../store/newEntryActions";
import { AppState } from "../store/types";
import { LiftLogEntry } from "./../types/LiftTypes";
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

class App extends React.Component<Props> {
  private readonly logName: string;
  private readonly loadingMessage: string;

  constructor(props: Props) {
    super(props);
    this.logName = this.getLogNameFromRoute(props);
    this.loadingMessage = `Loading board ${this.logName}`;
  }

  public componentDidMount() {
    this.props.reloadLifts(this.logName);
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.getHeaderText()}</h1>
        </header>
        <LiftLogContainer
          disabled={this.props.isLoading || this.props.networkErrorOccurred}
          entries={this.props.logEntries}
          onAddEntry={() => this.handleAddEntry()}
        />
      </div>
    );
  }

  private getHeaderText(): string {
    if (this.props.isLoading) {
      return this.loadingMessage;
    } else if (this.props.networkErrorOccurred) {
      return this.props.errorMessage;
    } else {
      return this.props.logTitle || "";
    }
  }

  private async handleAddEntry() {
    await this.props.addLogEntry(this.logName);
    await this.props.reloadLifts(this.logName);
  }

  private getLogNameFromRoute = (props: RouteProps) =>
    !!props.location ? props.location.pathname.substr(1) : "";
}

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
