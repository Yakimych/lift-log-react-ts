import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import LiftLogService from "../services/liftLogService";
import { dialogReducer } from "../store/dialogReducer";
import { liftLogReducer } from "../store/liftLogReducer";
import { newEntryReducer } from "../store/newEntryReducer";

const rootReducer = combineReducers({
  liftLogState: liftLogReducer,
  newEntryState: newEntryReducer,
  dialogState: dialogReducer
});

const composeEnhancers = composeWithDevTools({ serialize: true });

export const configureStore = (liftLogService: LiftLogService) => {
  return createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(thunkMiddleware.withExtraArgument(liftLogService))
    )
  );
};
