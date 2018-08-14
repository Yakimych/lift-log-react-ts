import * as React from "react";
import "./App.css";
import LiftLog from "./LiftLog";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Bench Press: Road to 100</h1>
          {/* TODO: Fetch from the API */}
        </header>
        <LiftLog />
      </div>
    );
  }
}

export default App;
