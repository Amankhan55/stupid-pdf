import React, { useRef } from "react";

export default function Navbar({ activeTool = "home", onSelectTool }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length > 1) {
      // Multiple files selected -> open Merge tool
      if (onSelectTool) onSelectTool("merge", files);
    } else {
      // Single file selected -> open active tool (if not home) or compress tool
      const targetTool = (activeTool && activeTool !== "home") ? activeTool : "compress";
      if (onSelectTool) onSelectTool(targetTool, files[0]);
    }

    // Reset input value so re-selecting the same file works
    e.target.value = "";
  };

  const handleBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <header className="navbar-glass">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="application/pdf, .pdf, .docx, image/*"
        style={{ display: "none" }}
      />
      <div className="max-width-wrapper">
        <div className="navbar-inner">
          {/* Left: Brand Logo */}
          <div className="nav-brand" onClick={() => onSelectTool && onSelectTool("home")}>
            <div className="nav-logo-badge">
              <img src="/logo.png" alt="StupidPDF Logo" className="nav-logo-img" />
            </div>
            <span className="nav-brand-name">
              Stupid<span className="brand-accent-pdf">PDF</span>
            </span>
          </div>

          {/* Right: Engine Status & CTA */}
          <div className="nav-right-actions">
            <button
              type="button"
              className="btn-emerald-cta"
              onClick={handleBtnClick}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Upload PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
