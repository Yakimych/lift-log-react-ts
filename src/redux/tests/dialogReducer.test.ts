import { AnyAction } from "redux";
import { InputMode } from "../../types/LiftTypes";
import { actions } from "../dialogActions";
import { dialogReducer } from "../dialogReducer";
import { DialogState } from "../storeState";

// Let it default to the reducer's initialState
const emptyInitialState = (undefined as unknown) as DialogState;
const emptyInitialAction = {} as AnyAction;

it("should be closed from the start", () => {
  const dialogState = dialogReducer(emptyInitialState, emptyInitialAction);
  expect(dialogState.isOpen).toEqual(false);
});

// TODO: Should NOT be possible before filling in required fields.
// NOTE: This might require refactoring the shape of the state
// TODO: Move dialogIsOpen into AddNewEntryState?
it("should be open after passing 'open' action", () => {
  const dialogState = dialogReducer(emptyInitialState, actions.open());
  expect(dialogState.isOpen).toEqual(true);
});

// it("should be open after filling in required data and passing 'open' action", () => {
//   const dialogState = dialogReducer(emptyInitialState, actions.open());
//   expect(dialogState.isOpen).toEqual(true);
// });

it("should be closed after passing 'close' action", () => {
  const openDialogState = dialogReducer(emptyInitialState, actions.open());
  const dialogState = dialogReducer(openDialogState, actions.close());
  expect(dialogState.isOpen).toEqual(false);
});

it("numberOfSets should be set to correct numeric value", () => {
  const openDialogState = dialogReducer(emptyInitialState, actions.open());
  const dialogStateWith10Sets = dialogReducer(
    openDialogState,
    actions.setNumberOfSets("10")
  );
  expect(dialogStateWith10Sets.numberOfSetsString).toEqual("10");
  expect(dialogStateWith10Sets.numberOfSets).toEqual(10);
});

it("numberOfReps should be set to correct numeric value", () => {
  const openDialogState = dialogReducer(emptyInitialState, actions.open());
  const dialogStateWith11Reps = dialogReducer(
    openDialogState,
    actions.setNumberOfReps("11")
  );
  expect(dialogStateWith11Reps.numberOfRepsString).toEqual("11");
  expect(dialogStateWith11Reps.numberOfReps).toEqual(11);
});

it("customsets should be derived from SetsReps after toggling InputMode to Custom", () => {
  const allActions = [
    actions.open(),
    actions.setNumberOfSets("2"),
    actions.setNumberOfReps("8"),
    actions.setInputMode(InputMode.CustomReps)
  ];

  const finalState = allActions.reduce<DialogState>(
    dialogReducer,
    emptyInitialState
  );

  expect(finalState.customSetsStrings).toEqual(["8", "8"]);
  expect(finalState.customSets).toEqual([
    { reps: 8, rpe: null },
    { reps: 8, rpe: null }
  ]);
});

it("customsets should be not be derived from SetsReps if set previously", () => {
  const allActions = [
    actions.open(),
    actions.setInputMode(InputMode.CustomReps),
    actions.changeCustomSet({ index: 0, value: "8@9.5" }),
    actions.addCustomSet(),
    actions.setInputMode(InputMode.SetsReps),
    actions.setInputMode(InputMode.CustomReps)
  ];

  const finalState = allActions.reduce<DialogState>(
    dialogReducer,
    emptyInitialState
  );

  expect(finalState.customSetsStrings).toEqual(["8@9.5", "5", "5", "5"]);
  expect(finalState.customSets).toEqual([
    { reps: 8, rpe: 9.5 },
    { reps: 5, rpe: null },
    { reps: 5, rpe: null },
    { reps: 5, rpe: null }
  ]);
});

it("cannot add more than 3 links", () => {
  const allActions = [
    actions.open(),
    actions.addLink(),
    actions.addLink(),
    actions.addLink(),
    actions.addLink()
  ];

  const finalState = allActions.reduce<DialogState>(
    dialogReducer,
    emptyInitialState
  );

  expect(finalState.links.length).toEqual(3);
});
