import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ToolPage from "./components/ToolPage";
import HomePage from "./components/HomePage";
import "./index.css";

export default function App() {
  const [activeTool, setActiveTool] = useState("home");

  if (activeTool === "home") {
    return (
      <div className="home-layout">
        {/* Homepage Header */}
        <header className="home-header-bar">
          <div className="header-logo-container" onClick={() => setActiveTool("home")} style={{ cursor: "pointer" }}>
            <img src="/logo.png" alt="StupidPDF Logo" className="header-logo-img" />
            <span className="header-brand-name">StupidPDF</span>
          </div>
          <div className="header-nav">
            <span className="header-badge">Stateless Engine</span>
            <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="header-link">
              API Docs
            </a>
          </div>
        </header>

        {/* Homepage Content */}
        <main className="home-main-content">
          <HomePage onSelect={setActiveTool} />
        </main>

        {/* Homepage Footer */}
        <footer className="home-footer-bar">
          <div className="footer-left">
            &copy; {new Date().getFullYear()} StupidPDF. All rights reserved.
          </div>
          <div className="footer-right">
            Processed entirely in-memory. Zero disk retention.
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar active={activeTool} onSelect={setActiveTool} />
      <main className="main-content">
        <ToolPage key={activeTool} toolId={activeTool} />
      </main>
    </div>
  );
}
