import { StoredLiftLogEntry } from "../../types/liftTypes";
import { actions, NewEntryAction } from "../newEntryActions";
import { newEntryReducer } from "../newEntryReducer";
import { NewEntryState } from "../types";

// Let it default to the reducer's initialState
const emptyInitialState = (undefined as unknown) as NewEntryState;
// Redux dispatches its own init action before any of ours.
const emptyInitialAction = ({ type: "@@INIT" } as unknown) as NewEntryAction;

const storedEntry: StoredLiftLogEntry = {
  id: 7,
  date: new Date("2026-07-11T12:00:00.000Z"),
  name: "Arnold",
  weightLifted: 100,
  sets: [{ reps: 5, rpe: null }],
  comment: "",
  links: []
};

const halfFilledNewEntry = () =>
  newEntryReducer(
    newEntryReducer(emptyInitialState, actions.changeName("Ada")),
    actions.changeWeightLifted("62.5")
  );

it("is not editing anything from the start", () => {
  const state = newEntryReducer(emptyInitialState, emptyInitialAction);
  expect(state.editingEntryId).toBeNull();
});

it("fills the form from the entry being edited", () => {
  const state = newEntryReducer(
    emptyInitialState,
    actions.startEdit(storedEntry)
  );

  expect(state.editingEntryId).toEqual(7);
  expect(state.name).toEqual("Arnold");
  expect(state.date).toEqual(storedEntry.date);
  expect(state.weightLifted).toEqual(100);
  expect(state.weightLiftedString).toEqual("100");
});

it("brings the parked new entry back when editing is cancelled", () => {
  const editingState = newEntryReducer(
    halfFilledNewEntry(),
    actions.startEdit(storedEntry)
  );

  const state = newEntryReducer(editingState, actions.stopEdit());

  expect(state.editingEntryId).toBeNull();
  expect(state.parkedEntry).toBeNull();
  expect(state.name).toEqual("Ada");
  expect(state.weightLiftedString).toEqual("62.5");
  expect(state.weightLifted).toEqual(62.5);
});

it("keeps the originally parked entry when a second entry is edited", () => {
  const editingState = newEntryReducer(
    halfFilledNewEntry(),
    actions.startEdit(storedEntry)
  );
  const editingAnotherState = newEntryReducer(
    editingState,
    actions.startEdit({ ...storedEntry, id: 8, name: "Grace" })
  );

  const state = newEntryReducer(editingAnotherState, actions.stopEdit());

  expect(state.editingEntryId).toBeNull();
  expect(state.name).toEqual("Ada");
});

it("leaves editing after a successful update and after a delete", () => {
  const editingState = newEntryReducer(
    halfFilledNewEntry(),
    actions.startEdit(storedEntry)
  );

  const updated = newEntryReducer(
    newEntryReducer(editingState, actions.updateLogEntry.request(storedEntry)),
    actions.updateLogEntry.success()
  );
  expect(updated.editingEntryId).toBeNull();
  expect(updated.isSaving).toEqual(false);
  expect(updated.name).toEqual("Ada");

  const deleted = newEntryReducer(
    newEntryReducer(editingState, actions.deleteLogEntry.request(7)),
    actions.deleteLogEntry.success()
  );
  expect(deleted.editingEntryId).toBeNull();
  expect(deleted.name).toEqual("Ada");
});

it("keeps editing and surfaces the error when saving fails", () => {
  const savingState = newEntryReducer(
    newEntryReducer(emptyInitialState, actions.startEdit(storedEntry)),
    actions.updateLogEntry.request(storedEntry)
  );

  const state = newEntryReducer(
    savingState,
    actions.updateLogEntry.failure("Error while saving entry for Arnold")
  );

  expect(state.isSaving).toEqual(false);
  expect(state.editingEntryId).toEqual(7);
  expect(state.errorMessage).toEqual("Error while saving entry for Arnold");
});

it("keeps the name after a successful add so the next entry starts from it", () => {
  const state = newEntryReducer(
    newEntryReducer(
      halfFilledNewEntry(),
      actions.addLogEntry.request({ ...storedEntry, name: "Ada" })
    ),
    actions.addLogEntry.success()
  );

  expect(state.isSaving).toEqual(false);
  expect(state.name).toEqual("Ada");
});
