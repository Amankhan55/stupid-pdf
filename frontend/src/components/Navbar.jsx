import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TOOL_RESTRICTIONS, validateFiles } from "../utils/fileValidation";
import {
  PDF_TOOLS,
  EDITING_TOOLS,
  UTILITY_TOOLS,
  SECURITY_TOOLS,
  CONVERSION_TOOLS,
} from "./Sidebar";

export default function Navbar({ activeTool = "home", onSelectTool }) {
  const fileInputRef = useRef(null);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length > 1) {
      // Multiple files selected -> route to Merge (PDFs) or Images to PDF (images)
      const imageExts = TOOL_RESTRICTIONS["images-to-pdf"].extensions;
      const allImages = files.every((f) => imageExts.includes(f.name.split(".").pop().toLowerCase()));
      const targetTool = allImages ? "images-to-pdf" : "merge";

      const check = validateFiles(files, TOOL_RESTRICTIONS[targetTool]);
      if (!check.valid) {
        alert(check.error);
        e.target.value = "";
        return;
      }
      if (onSelectTool) onSelectTool(targetTool, files);
    } else {
      // Single file selected -> validate for active tool or compress tool
      const targetTool = (activeTool && activeTool !== "home") ? activeTool : "compress";
      const check = validateFiles(files[0], TOOL_RESTRICTIONS[targetTool] || TOOL_RESTRICTIONS["compress"]);
      if (!check.valid) {
        alert(check.error);
        e.target.value = "";
        return;
      }
      if (onSelectTool) onSelectTool(targetTool, files[0]);
    }

    e.target.value = "";
  };

  const handleBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Mega-menu hover handlers with delay to prevent flicker
  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 200);
  };
  const handleToolClick = (toolId) => {
    setMegaOpen(false);
    setMobileOpen(false);
    if (onSelectTool) onSelectTool(toolId);
  };

  const CATEGORIES = [
    { label: "PDF Processing", tools: PDF_TOOLS, accent: "var(--accent-primary)" },
    { label: "Editing",        tools: EDITING_TOOLS, accent: "var(--accent-purple)" },
    { label: "Conversion",     tools: CONVERSION_TOOLS, accent: "var(--accent-secondary)" },
    { label: "Security",       tools: SECURITY_TOOLS, accent: "var(--accent-red)" },
    { label: "Utilities",      tools: UTILITY_TOOLS, accent: "var(--accent-amber)" },
  ];

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

          {/* Center: Nav Links with Tools Mega-Menu */}
          <nav className="nav-links-center">
            <div
              className="nav-mega-trigger"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button
                className={`nav-link-item nav-products-btn${megaOpen ? " active" : ""}`}
                onClick={() => setMegaOpen((v) => !v)}
                aria-expanded={megaOpen}
                aria-haspopup="true"
              >
                Tools
                <svg
                  className={`nav-chevron${megaOpen ? " open" : ""}`}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Mega-menu dropdown */}
              {megaOpen && (
                <div className="mega-menu-panel" onMouseEnter={openMega} onMouseLeave={closeMega}>
                  <div className="mega-menu-inner">
                    {CATEGORIES.map((cat) => (
                      <div key={cat.label} className="mega-category">
                        <div className="mega-category-label" style={{ color: cat.accent }}>
                          <span className="mega-cat-dot" style={{ background: cat.accent }} />
                          {cat.label}
                        </div>
                        <div className="mega-tool-list">
                          {cat.tools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                              <button
                                key={tool.id}
                                className={`mega-tool-item${tool.comingSoon ? " disabled" : ""}`}
                                disabled={tool.comingSoon}
                                onClick={() => !tool.comingSoon && handleToolClick(tool.id)}
                              >
                                <span className="mega-tool-icon" style={{ color: cat.accent }}>
                                  <Icon width="16" height="16" />
                                </span>
                                <span className="mega-tool-label">{tool.label}</span>
                                {tool.comingSoon && <span className="mega-soon-pill">Soon</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: CTA + Hamburger */}
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

            {/* Hamburger button — visible only on mobile */}
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
            >
              <span className={`hamburger-line${mobileOpen ? " open" : ""}`} />
              <span className={`hamburger-line${mobileOpen ? " open" : ""}`} />
              <span className={`hamburger-line${mobileOpen ? " open" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Drawer via Portal to escape header containing block */}
      {mobileOpen &&
        createPortal(
          <>
            <div className="mobile-drawer-backdrop" onClick={() => setMobileOpen(false)} />
            <div className={`mobile-drawer${mobileOpen ? " open" : ""}`}>
              <div className="mobile-drawer-header">
                <span className="mobile-drawer-title">All Tools</span>
                <button className="mobile-drawer-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="mobile-drawer-body">
                {CATEGORIES.map((cat) => (
                  <div key={cat.label} className="mobile-drawer-category">
                    <div className="mobile-drawer-cat-label" style={{ color: cat.accent }}>
                      <span className="mega-cat-dot" style={{ background: cat.accent }} />
                      {cat.label}
                    </div>
                    {cat.tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <button
                          key={tool.id}
                          className={`mobile-drawer-item${tool.comingSoon ? " disabled" : ""}`}
                          disabled={tool.comingSoon}
                          onClick={() => !tool.comingSoon && handleToolClick(tool.id)}
                        >
                          <span className="mega-tool-icon" style={{ color: cat.accent }}>
                            <Icon width="18" height="18" />
                          </span>
                          <span className="mobile-drawer-item-label">{tool.label}</span>
                          {tool.comingSoon && <span className="mega-soon-pill">Soon</span>}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </>,
          document.body
        )}
    </header>
  );
}

