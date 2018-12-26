import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App";
import "./index.css";
import { configureStore } from "./redux/store";
import LiftLogService from "./services/LiftLogService";

const store = configureStore(new LiftLogService());
// tslint:disable-next-line:no-debugger
// debugger;

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
