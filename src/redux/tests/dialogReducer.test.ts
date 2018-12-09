import { AnyAction } from "redux";
import { InputMode } from "../../types/LiftTypes";
import { actions } from "../dialogActions";
import { dialogReducer } from "../dialogReducer";

it("should be closed from the start", () => {
  const dialogState = dialogReducer(undefined, {} as AnyAction);
  expect(dialogState.isOpen).toEqual(false);
});

it("should be open after passing 'open' action", () => {
  const dialogState = dialogReducer(undefined, actions.open());
  expect(dialogState.isOpen).toEqual(true);
});

it("should be closed after passing 'close' action", () => {
  const openDialogState = dialogReducer(undefined, actions.open());
  const dialogState = dialogReducer(openDialogState, actions.close());
  expect(dialogState.isOpen).toEqual(false);
});

it("numberOfSets should be set to correct numeric value", () => {
  const openDialogState = dialogReducer(undefined, actions.open());
  const dialogStateWith10Sets = dialogReducer(
    openDialogState,
    actions.setNumberOfSets("10")
  );
  expect(dialogStateWith10Sets.numberOfSetsString).toEqual("10");
  expect(dialogStateWith10Sets.numberOfSets).toEqual(10);
});

it("numberOfReps should be set to correct numeric value", () => {
  const openDialogState = dialogReducer(undefined, actions.open());
  const dialogStateWith11Reps = dialogReducer(
    openDialogState,
    actions.setNumberOfReps("11")
  );
  expect(dialogStateWith11Reps.numberOfRepsString).toEqual("11");
  expect(dialogStateWith11Reps.numberOfReps).toEqual(11);
});

it("customsets should be derived from SetsReps after toggling InputMode to Custom", () => {
  const openDialogState = dialogReducer(undefined, actions.open());
  const dialogStateWith2Sets = dialogReducer(
    openDialogState,
    actions.setNumberOfSets("2")
  );
  const dialogStateWith8Reps = dialogReducer(
    dialogStateWith2Sets,
    actions.setNumberOfReps("8")
  );
  const dialogState = dialogReducer(
    dialogStateWith8Reps,
    actions.setInputMode(InputMode.CustomReps)
  );
  expect(dialogState.customSetsStrings).toEqual(["8", "8"]);
  expect(dialogState.customSets).toEqual([
    { reps: 8, rpe: null },
    { reps: 8, rpe: null }
  ]);
});

// TODO: Is there a way to chain reducer calls?
it("customsets should be not be derived from SetsReps if set previously", () => {
  const openDialogState = dialogReducer(undefined, actions.open());
  const dialogStateWithCustomInputMode = dialogReducer(
    openDialogState,
    actions.setInputMode(InputMode.CustomReps)
  );
  const tempState1 = dialogReducer(
    dialogStateWithCustomInputMode,
    actions.changeCustomSet({ index: 0, value: "8@9.5" })
  );
  const dialogStateWithCustomSetsReps = dialogReducer(
    tempState1,
    actions.addCustomSet()
  );
  const tempState2 = dialogReducer(
    dialogStateWithCustomSetsReps,
    actions.setInputMode(InputMode.SetsReps)
  );
  const dialogState = dialogReducer(
    tempState2,
    actions.setInputMode(InputMode.CustomReps)
  );
  expect(dialogState.customSetsStrings).toEqual(["8@9.5", "5", "5", "5"]);
  expect(dialogState.customSets).toEqual([
    { reps: 8, rpe: 9.5 },
    { reps: 5, rpe: null },
    { reps: 5, rpe: null },
    { reps: 5, rpe: null }
  ]);
});
