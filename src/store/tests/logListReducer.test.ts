import { AnyAction } from "redux";
import { LiftLogSummary } from "../../types/liftTypes";
import { actions } from "../logListActions";
import { logListReducer } from "../logListReducer";
import { LogListState } from "../types";

// Let it default to the reducer's initialState
const emptyInitialState = (undefined as unknown) as LogListState;
const emptyInitialAction = {} as AnyAction;

const squats: LiftLogSummary = {
  name: "squats",
  title: "Squats",
  entryCount: 3
};

it("starts out loading with no logs", () => {
  const state = logListReducer(emptyInitialState, emptyInitialAction);
  expect(state.isLoading).toEqual(true);
  expect(state.logs).toEqual([]);
});

it("stores the fetched logs", () => {
  const state = logListReducer(
    emptyInitialState,
    actions.fetchLogs.success([squats])
  );

  expect(state.isLoading).toEqual(false);
  expect(state.logs).toEqual([squats]);
});

it("reports a failed fetch and lets the error be dismissed", () => {
  const failedState = logListReducer(
    emptyInitialState,
    actions.fetchLogs.failure("Could not load the list of logs")
  );
  expect(failedState.isLoading).toEqual(false);
  expect(failedState.errorMessage).toEqual("Could not load the list of logs");

  const state = logListReducer(failedState, actions.dismissError());
  expect(state.errorMessage).toBeNull();
});

it("clears the create form only once the log has been created", () => {
  const filledState = logListReducer(
    logListReducer(emptyInitialState, actions.changeNewLogName("squats")),
    actions.changeNewLogTitle("Squats")
  );
  expect(filledState.newLogName).toEqual("squats");

  const failedState = logListReducer(
    filledState,
    actions.createLog.failure("Lift Log with name 'squats' already exists")
  );
  expect(failedState.newLogName).toEqual("squats");
  expect(failedState.errorMessage).toEqual(
    "Lift Log with name 'squats' already exists"
  );

  const state = logListReducer(filledState, actions.createLog.success());
  expect(state.newLogName).toEqual("");
  expect(state.newLogTitle).toEqual("");
});

it("edits one log title at a time and closes the editor once saved", () => {
  const editingState = logListReducer(
    emptyInitialState,
    actions.startEditLog(squats)
  );
  expect(editingState.editedLogName).toEqual("squats");
  expect(editingState.editedLogTitle).toEqual("Squats");

  const renamedState = logListReducer(
    editingState,
    actions.changeEditedTitle("Back Squats")
  );
  expect(renamedState.editedLogTitle).toEqual("Back Squats");

  expect(
    logListReducer(renamedState, actions.cancelEditLog()).editedLogName
  ).toBeNull();
  expect(
    logListReducer(renamedState, actions.updateLog.success()).editedLogName
  ).toBeNull();
});

it("closes the delete confirmation whether the delete succeeds or fails", () => {
  const confirmingState = logListReducer(
    emptyInitialState,
    actions.confirmDeleteLog(squats)
  );
  expect(confirmingState.logPendingDeletion).toEqual(squats);

  expect(
    logListReducer(confirmingState, actions.deleteLog.success())
      .logPendingDeletion
  ).toBeNull();

  const failedState = logListReducer(
    confirmingState,
    actions.deleteLog.failure("Could not delete the log squats")
  );
  expect(failedState.logPendingDeletion).toBeNull();
  expect(failedState.errorMessage).toEqual("Could not delete the log squats");
});
