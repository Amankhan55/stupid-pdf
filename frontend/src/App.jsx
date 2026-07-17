import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ToolPage from "./components/ToolPage";
import "./index.css";

export default function App() {
  const [activeTool, setActiveTool] = useState("merge");

  return (
    <div className="app-layout">
      <Sidebar active={activeTool} onSelect={setActiveTool} />
      <main className="main-content">
        <ToolPage key={activeTool} toolId={activeTool} />
      </main>
    </div>
  );
}
