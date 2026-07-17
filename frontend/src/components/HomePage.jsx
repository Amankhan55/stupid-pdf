import React, { useState } from "react";
import { PDF_TOOLS, CONVERSION_TOOLS } from "./Sidebar";

export default function HomePage({ onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all"); // "all", "processing", "conversion"

  // Filter tools based on selected tab and search query
  const getFilteredTools = (toolsList) => {
    return toolsList.filter((tool) => {
      const matchQuery =
        tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getToolDescription(tool.id).toLowerCase().includes(searchQuery.toLowerCase());
      return matchQuery;
    });
  };

  const filteredProcessing = getFilteredTools(PDF_TOOLS);
  const filteredConversion = getFilteredTools(CONVERSION_TOOLS);

  const showProcessing = activeCategory === "all" || activeCategory === "processing";
  const showConversion = activeCategory === "all" || activeCategory === "conversion";

  const totalResults =
    (showProcessing ? filteredProcessing.length : 0) +
    (showConversion ? filteredConversion.length : 0);

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


      {/* Search and Filters Navigation Row */}
      <div className="home-filter-nav-bar">
        {/* Category Tabs */}
        <div className="category-tabs">
          {[
            { id: "all", label: "All Tools" },
            { id: "processing", label: "PDF Processing" },
            { id: "conversion", label: "PDF Conversion" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`category-tab-btn${activeCategory === tab.id ? " active" : ""}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Search Box */}
        <div className="search-box-container">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="home-search-input"
            placeholder="Search tools (e.g. merge, compress, word)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* No results placeholder */}
      {totalResults === 0 && (
        <div className="no-search-results">
          <div className="no-results-icon">🔍</div>
          <h4>No tools match "{searchQuery}"</h4>
          <p>Try searching for different terms like "combine", "split", "word" or "images"</p>
        </div>
      )}

      {/* Grid of Processing Tools */}
      {showProcessing && filteredProcessing.length > 0 && (
        <section className="tools-grid-section">
          <h3 className="section-label">PDF Processing & Editing</h3>
          <div className="tools-grid">
            {filteredProcessing.map((tool) => {
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
      )}

      {/* Grid of Conversion Tools */}
      {showConversion && filteredConversion.length > 0 && (
        <section className="tools-grid-section" style={{ marginTop: "16px" }}>
          <h3 className="section-label">PDF Conversion</h3>
          <div className="tools-grid">
            {filteredConversion.map((tool) => {
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
      )}
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
    "pdf-to-images": "Convert PDF pages into PNG or JPG images packed in a ZIP.",
    "images-to-pdf": "Combine multiple PNG/JPG images into a single PDF.",
    "word-to-pdf": "Convert Word docx files into styled PDF format.",
    "pdf-to-word": "Convert PDFs back into editable Word docx files.",
  };
  return descriptions[id] || "";
}
