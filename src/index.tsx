import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <BrowserRouter>
    <Route component={App} />
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
