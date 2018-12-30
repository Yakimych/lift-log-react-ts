import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { RouteProps } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { actions as dialogActions } from "../redux/dialogActions";
import { DialogAction } from "../redux/dialogActions";
import { addLogEntry, reloadLifts } from "../redux/effects/liftLogEffects";
import { LiftLogAction } from "../redux/liftLogActions";
import { actions as newEntryActions } from "../redux/newEntryActions";
import { NewEntryAction } from "../redux/newEntryActions";
import { getCanAddCustomSet, getCanAddLink } from "../redux/selectors";
import { StoreState } from "../redux/storeState";
import LiftLogService from "../services/LiftLogService";
import { InputMode, LiftLogEntry } from "./../types/LiftTypes";
import { AddLogEntryDispatchProps, AddLogEntryStateProps } from "./AddLogEntry";
import "./App.css";
import LiftLogContainer from "./LiftLogContainer";

type StateProps = {
  isLoading: boolean;
  networkErrorOccurred: boolean;
  errorMessage: string;
  logTitle?: string;
  logEntries: ReadonlyArray<LiftLogEntry>;
} & AddLogEntryStateProps;

type DispatchProps = {
  reloadLifts: (logName: string) => void;
  addLogEntry: (logName: string) => Promise<void>;
} & AddLogEntryDispatchProps;

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
          // TODO: Don't spread?
          {...this.props}
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

const mapStateToProps = (storeState: StoreState): StateProps => {
  return {
    isLoading: storeState.liftLogState.isLoading,
    networkErrorOccurred: storeState.liftLogState.networkErrorOccured,
    errorMessage: storeState.liftLogState.errorMessage || "",
    logTitle: storeState.liftLogState.logTitle,
    logEntries: storeState.liftLogState.logEntries,

    addRepsModalIsOpen: storeState.dialogState.isOpen,
    date: storeState.newEntryState.date,
    name: storeState.newEntryState.name,
    weightLifted: storeState.newEntryState.weightLifted,
    weightLiftedStringValue: storeState.newEntryState.weightLiftedString,
    setsReps: {
      mode: storeState.dialogState.inputMode,
      numberOfSets: storeState.dialogState.numberOfSets,
      numberOfReps: storeState.dialogState.numberOfReps,
      customSetsStrings: storeState.dialogState.customSetsStrings
    },
    comment: storeState.dialogState.comment,
    hasComment: storeState.dialogState.commentIsShown,
    links: storeState.dialogState.links,
    canAddLink: getCanAddLink(storeState),
    canAddCustomSet: getCanAddCustomSet(storeState)
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<
    StoreState,
    LiftLogService,
    LiftLogAction | NewEntryAction | DialogAction
  >
): DispatchProps => {
  return {
    reloadLifts: (logName: string) => dispatch(reloadLifts(logName)),
    addLogEntry: (logName: string) => dispatch(addLogEntry(logName)),

    changeName: (newName: string) =>
      dispatch(newEntryActions.changeName(newName)),
    changeDate: (newDate: moment.Moment | null) =>
      dispatch(newEntryActions.changeDate(newDate)),
    changeWeightLifted: (newWeightLiftedString: string) =>
      dispatch(newEntryActions.changeWeightLifted(newWeightLiftedString)),
    openDialog: () => dispatch(dialogActions.open()),
    closeDialog: () => dispatch(dialogActions.close()),

    onInputModeChange: (inputMode: InputMode) =>
      dispatch(dialogActions.setInputMode(inputMode)),
    onLiftLogRepsChange: (index: number, newValue: string) =>
      dispatch(dialogActions.changeCustomSet({ index, value: newValue })),
    onAddCustomSet: () => dispatch(dialogActions.addCustomSet()),
    onRemoveCustomSet: (index: number) =>
      dispatch(dialogActions.removeCustomSet(index)),
    onNumberOfSetsChange: (newValue: string) =>
      dispatch(dialogActions.setNumberOfSets(newValue)),
    onNumberOfRepsChange: (newValue: string) =>
      dispatch(dialogActions.setNumberOfReps(newValue)),

    onAddLink: () => dispatch(dialogActions.addLink()),
    onRemoveLink: (index: number) => dispatch(dialogActions.removeLink(index)),
    onChangeLinkText: (index: number, newText: string) =>
      dispatch(dialogActions.changeLinkText({ index, newText })),
    onChangeLinkUrl: (index: number, newUrl: string) =>
      dispatch(dialogActions.changeLinkUrl({ index, newUrl })),
    onCommentChange: (newValue: string) =>
      dispatch(dialogActions.changeComment(newValue)),
    onOpenComment: () => dispatch(dialogActions.showComment())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
