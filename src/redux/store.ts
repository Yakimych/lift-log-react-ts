import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import LiftLogService from "../services/liftLogService";
import { dialogReducer } from "../store/dialogReducer";
import { liftLogReducer } from "../store/liftLogReducer";
import { actions as newEntryActions } from "../store/newEntryActions";
import { newEntryReducer } from "../store/newEntryReducer";
import { getLastUsedName } from "../utils/localStorageUtils";

const rootReducer = combineReducers({
  liftLogState: liftLogReducer,
  newEntryState: newEntryReducer,
  dialogState: dialogReducer
});

const composeEnhancers = composeWithDevTools({ serialize: true });

export const configureStore = (liftLogService: LiftLogService) => {
  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(thunkMiddleware.withExtraArgument(liftLogService))
    )
  );

  // Pre-fill the last used name from a previous session here, at the
  // composition root, so the reducer's initial state stays side-effect free.
  const lastUsedName = getLastUsedName();
  if (lastUsedName) {
    store.dispatch(newEntryActions.changeName(lastUsedName));
  }

  return store;
};
