import React from "react";
import { TOOLS } from "./Sidebar";

export default function HomePage({ onSelect }) {
  return (
    <div className="home-container">
      {/* Hero Brand Section */}
      <header className="home-hero">
        <img
          src="/logo.png"
          alt="StupidPDF Brand Logo"
          className="hero-logo-img"
        />
        <h1 className="hero-title">StupidPDF</h1>
        <p className="hero-subtitle">Your PDF processing toolkit, stupidly simple.</p>
        
        {/* Privacy Shield Info */}
        <div className="privacy-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>100% Stateless & Private — Files are processed completely in-memory</span>
        </div>
      </header>

      {/* Grid of Tools */}
      <section className="tools-grid-section">
        <h3 className="section-label">Process & Optimize Documents</h3>
        <div className="tools-grid">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="tool-card"
                onClick={() => onSelect(tool.id)}
              >
                <div className="tool-card-icon-wrapper">
                  <Icon width="24" height="24" className="tool-card-icon" />
                </div>
                <h4>{tool.label}</h4>
                <p>{getToolDescription(tool.id)}</p>
                <span className="launch-text">Launch Tool →</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// Helpers for short grid descriptions
function getToolDescription(id) {
  const descriptions = {
    "merge": "Combine multiple PDFs into a single file.",
    "split": "Divide a document into multiple parts or sections.",
    "compress": "Losslessly optimize file sizes to share easily.",
    "extract-pages": "Select and save specific pages to a new PDF.",
    "delete-pages": "Permanently remove redundant pages from a file.",
    "rearrange-pages": "Drag & drop to order pages exactly how you need.",
    "rotate-pages": "Turn page rotations by 90, 180, or 270 degrees.",
    "duplicate-pages": "Copy specific pages immediately after themselves.",
    "reverse": "Flip the entire page structure in reverse order.",
    "insert-blank": "Surgically add blank empty pages anywhere in a file.",
    "add-pdf": "Insert an entire PDF file directly inside another document.",
  };
  return descriptions[id] || "";
}
