import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App";
import "./index.css";
import LiftLogService from "./services/LiftLogService";
import { configureStore } from "./store/store";

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/liftlogs`;
const store = configureStore(new LiftLogService(baseUrl));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
