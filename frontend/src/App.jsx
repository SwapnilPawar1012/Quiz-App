import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/navbar";
import "./styles/custom.css";

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="">
        <AppRoutes />
      </div>
    </div>
  );
};

export default App;
