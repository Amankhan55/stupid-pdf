import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar, { TOOLS } from "./components/Sidebar";
import ToolPage from "./components/ToolPage";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import "./index.css";

export default function App() {
  const [activeTool, setActiveTool] = useState("home");

  const currentTool = TOOLS.find((t) => t.id === activeTool);
  const isHome = activeTool === "home";

  return (
    <>
      {/* Ambient background canvas */}
      <div className="bg-canvas">
        <div className="bg-grid" />
      </div>

      <div className="app-shell">
        {/* Sticky Navbar always on top */}
        <Navbar onNavigate={setActiveTool} activeSection={isHome ? "home" : null} />

        {isHome ? (
          /* ── Homepage layout ── */
          <>
            <main>
              <HomePage onSelect={setActiveTool} />
            </main>
            <Footer />
          </>
        ) : (
          /* ── Tool page layout ── */
          <>
            {/* Mobile top bar (shown only on small screens via CSS) */}
            <header className="mobile-tool-header">
              <button className="mobile-back-btn" onClick={() => setActiveTool("home")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Dashboard
              </button>
              <span className="mobile-tool-title">
                {currentTool ? currentTool.label : "Tool"}
              </span>
            </header>

            <div className="tool-shell">
              {/* Left sidebar with tool navigation */}
              <Sidebar active={activeTool} onSelect={setActiveTool} />

              {/* Main tool content */}
              <main className="tool-main">
                <ToolPage key={activeTool} toolId={activeTool} onHome={() => setActiveTool("home")} />
              </main>
            </div>
          </>
        )}
      </div>
    </>
  );
}
