import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ToolPage from "./components/ToolPage";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";

export default function App() {
  const [activeTool, setActiveTool] = useState("home");
  const [initialFile, setInitialFile] = useState(null);

  const handleSelectTool = (toolId, file = null) => {
    setActiveTool(toolId);
    setInitialFile(file);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTriggerUpload = () => {
    setActiveTool("home");
    setInitialFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-container">
      {/* Vercel Web Analytics */}
      <Analytics />

      {/* Glass Top Navbar */}
      <Navbar activeTool={activeTool} onSelectTool={handleSelectTool} />

      {/* Page Content */}
      {activeTool === "home" ? (
        <main style={{ flex: 1 }}>
          <HomePage onSelect={handleSelectTool} />
        </main>
      ) : activeTool === "privacy-policy" ? (
        <PrivacyPolicy onBack={() => handleSelectTool("home")} />
      ) : (
        <div className="app-layout">
          <Sidebar active={activeTool} onSelect={handleSelectTool} />
          <main className="main-content">
            <ToolPage
              key={`${activeTool}-${Array.isArray(initialFile) ? initialFile.map(f => f.name).join(",") : (initialFile?.name || "new")}`}
              toolId={activeTool}
              initialFile={initialFile}
              onSelectTool={handleSelectTool}
            />
          </main>
        </div>
      )}

      {/* Premium Glass Footer */}
      <footer className="footer-container">
        <div className="max-width-wrapper">
          <div className="footer-inner">
            <div className="footer-logo-row">
              <div className="footer-logo-badge">
                <img src="/logo.png" alt="StupidPDF" className="footer-logo-img" />
              </div>
              <span className="footer-brand-name">
                Stupid<span className="brand-accent-pdf">PDF</span>
              </span>
              <span className="footer-pill-tag">
                🔒 Stateless &amp; Private
              </span>
            </div>

            <div className="footer-center-nav">
              <span
                className="footer-nav-item"
                role="button"
                tabIndex={0}
                onClick={() => handleSelectTool("privacy-policy")}
                onKeyDown={(e) => e.key === "Enter" && handleSelectTool("privacy-policy")}
              >
                Privacy Policy
              </span>
            </div>

            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} StupidPDF · Built with ❤️ · 100% Free &amp; Open Source
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
