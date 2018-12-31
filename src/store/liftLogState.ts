import { LiftLogEntry } from "../types/LiftTypes";

export type LiftLogState = {
  isLoading: boolean;
  networkErrorOccured: boolean;
  errorMessage?: string;
  logTitle: string;
  logEntries: ReadonlyArray<LiftLogEntry>;
};
