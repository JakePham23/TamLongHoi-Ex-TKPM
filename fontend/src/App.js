import React, { useState } from "react";
import Tabbar from "./components/Tabbar";
import MainScreen from "./components/MainScreen";
import "./App.css";

const App = () => {
  const [view, setView] = useState("dashboard");

  return (
    <div className="app-container">
      <Tabbar setView={setView} />
      <div className="main-screen">
        <MainScreen view={view} />
      </div>
    </div>
  );
};

export default App;