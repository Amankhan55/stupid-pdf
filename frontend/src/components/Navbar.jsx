import React from "react";

export default function Navbar({ onSelectTool, onUploadClick }) {
  return (
    <header className="navbar-glass">
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

          {/* Center: Essential Navigation */}
          {/* <ul className="nav-links-center">
            <li
              className="nav-link-item"
              onClick={() => {
                if (onSelectTool) onSelectTool("home");
                const gridEl = document.getElementById("tools-grid-anchor");
                gridEl?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              All Tools
            </li>
            <li className="nav-link-item">
              <a
                href="https://github.com/Amankhan55/stupid-pdf"
                target="_blank"
                rel="noreferrer"
                className="nav-link-item"
                style={{ textDecoration: "none" }}
              >
                GitHub
              </a>
            </li>
          </ul> */}

          {/* Right: Engine Status & CTA */}
          <div className="nav-right-actions">
            <div className="nav-status-badge">
              <span className="status-dot"></span>
              <span>Stateless Engine</span>
            </div>

            <button
              className="btn-emerald-cta"
              onClick={() => {
                if (onUploadClick) {
                  onUploadClick();
                } else if (onSelectTool) {
                  onSelectTool("compress");
                }
              }}
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
