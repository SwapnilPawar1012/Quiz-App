import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/navbar";
import "./styles/custom.css";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex">
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;
