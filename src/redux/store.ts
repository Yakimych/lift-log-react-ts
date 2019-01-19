import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import LiftLogService from "../services/LiftLogService";
import { dialogReducer } from "../store/dialogReducer";
import { liftLogReducer } from "../store/liftLogReducer";
import { newEntryReducer } from "../store/newEntryReducer";

const rootReducer = combineReducers({
  liftLogState: liftLogReducer,
  newEntryState: newEntryReducer,
  dialogState: dialogReducer
});

export const configureStore = (liftLogService: LiftLogService) => {
  return createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(thunkMiddleware.withExtraArgument(liftLogService))
    )
  );
};
