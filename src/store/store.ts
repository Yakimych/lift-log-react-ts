import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import LiftLogService from "../services/LiftLogService";
import { dialogReducer } from "./dialogReducer";
import { liftLogReducer } from "./liftLogReducer";
import { newEntryReducer } from "./newEntryReducer";

const rootReducer = combineReducers({
  liftLogState: liftLogReducer,
  newEntryState: newEntryReducer,
  dialogState: dialogReducer
});

export const configureStore = (liftLogService: LiftLogService) => {
  return createStore(
    rootReducer,
    compose(
      applyMiddleware(thunkMiddleware.withExtraArgument(liftLogService)),
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
};
