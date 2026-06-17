const LAST_USED_NAME_KEY = "lift-log.lastUsedName";

export const getLastUsedName = (): string => {
  try {
    return window.localStorage.getItem(LAST_USED_NAME_KEY) || "";
  } catch {
    // Accessing localStorage can throw (e.g. private mode / disabled storage).
    return "";
  }
};

export const setLastUsedName = (name: string): void => {
  try {
    window.localStorage.setItem(LAST_USED_NAME_KEY, name);
  } catch {
    // Ignore write errors (e.g. storage disabled / quota exceeded).
  }
};
