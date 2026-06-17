import { getLastUsedName, setLastUsedName } from "./localStorageUtils";

beforeEach(() => {
  window.localStorage.clear();
});

it("returns an empty string when no name has been saved yet", () => {
  expect(getLastUsedName()).toBe("");
});

it("persists and retrieves the last used name", () => {
  setLastUsedName("Arnold");

  expect(getLastUsedName()).toBe("Arnold");
});

it("overwrites the previously saved name", () => {
  setLastUsedName("Arnold");
  setLastUsedName("Ronnie");

  expect(getLastUsedName()).toBe("Ronnie");
});
