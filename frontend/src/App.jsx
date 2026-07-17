import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ToolPage from "./components/ToolPage";
import HomePage from "./components/HomePage";
import "./index.css";

export default function App() {
  const [activeTool, setActiveTool] = useState("home");

  return (
    <div className="app-layout">
      <Sidebar active={activeTool} onSelect={setActiveTool} />
      <main className="main-content">
        {activeTool === "home" ? (
          <HomePage onSelect={setActiveTool} />
        ) : (
          <ToolPage key={activeTool} toolId={activeTool} />
        )}
      </main>
    </div>
  );
}
