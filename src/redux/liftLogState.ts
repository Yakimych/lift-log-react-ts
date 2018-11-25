import { LiftLogEntry } from "../types/LiftTypes";

// TODO: Try modelling as ADT again?
export type LiftLogState = {
  isLoading: boolean;
  networkErrorOccured: boolean;
  errorMessage?: string;
  logTitle: string;
  logEntries: ReadonlyArray<LiftLogEntry>;
};
