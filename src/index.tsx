import * as React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App";
import LogList from "./components/LogList";
import "./index.css";
import { configureStore } from "./redux/store";
import LiftLogService from "./services/liftLogService";

const baseUrl = `${import.meta.env.REACT_APP_API_BASE_URL}/liftlogs`;
const store = configureStore(new LiftLogService(baseUrl));

createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogList />} />
        <Route path="/:logName" element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
