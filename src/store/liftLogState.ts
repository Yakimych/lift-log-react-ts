import { StoredLiftLogEntry } from "../types/liftTypes";

export type LiftLogState = {
  isLoading: boolean;
  networkErrorOccured: boolean;
  errorMessage?: string;
  logTitle: string;
  logEntries: ReadonlyArray<StoredLiftLogEntry>;
};
