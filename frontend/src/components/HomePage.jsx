import React, { useState } from "react";
import { PDF_TOOLS, CONVERSION_TOOLS } from "./Sidebar";

/* ─── Per-tool accent config ─── */
const CARD_CONFIG = {
  "merge":           { color: "#46F5B0", bg: "rgba(70,245,176,0.1)",   glow: "rgba(70,245,176,0.18)",   chips: ["Multi-file", "In-order"] },
  "split":           { color: "#8B5CFF", bg: "rgba(139,92,255,0.1)",   glow: "rgba(139,92,255,0.18)",   chips: ["By page", "ZIP output"] },
  "compress":        { color: "#FFB020", bg: "rgba(255,176,32,0.1)",   glow: "rgba(255,176,32,0.18)",   chips: ["3 levels", "Lossless"] },
  "extract-pages":   { color: "#3B82F6", bg: "rgba(59,130,246,0.1)",   glow: "rgba(59,130,246,0.18)",   chips: ["Any pages", "New PDF"] },
  "delete-pages":    { color: "#FF5470", bg: "rgba(255,84,112,0.1)",   glow: "rgba(255,84,112,0.18)",   chips: ["Permanent", "Selective"] },
  "rearrange-pages": { color: "#00D5FF", bg: "rgba(0,213,255,0.1)",    glow: "rgba(0,213,255,0.18)",    chips: ["Drag & drop", "Custom order"] },
  "rotate-pages":    { color: "#8B5CFF", bg: "rgba(139,92,255,0.1)",   glow: "rgba(139,92,255,0.18)",   chips: ["90/180/270°", "Per page"] },
  "duplicate-pages": { color: "#FFD700", bg: "rgba(255,215,0,0.1)",    glow: "rgba(255,215,0,0.18)",    chips: ["N copies", "Inline"] },
  "reverse":         { color: "#A6FF4D", bg: "rgba(166,255,77,0.1)",   glow: "rgba(166,255,77,0.18)",   chips: ["Full doc", "One-click"] },
  "insert-blank":    { color: "#3B82F6", bg: "rgba(59,130,246,0.1)",   glow: "rgba(59,130,246,0.18)",   chips: ["Any position", "Sized"] },
  "add-pdf":         { color: "#00D5FF", bg: "rgba(0,213,255,0.1)",    glow: "rgba(0,213,255,0.18)",    chips: ["At position", "Full insert"] },
  "unlock-pdf":      { color: "#FF5F9F", bg: "rgba(255,95,159,0.1)",   glow: "rgba(255,95,159,0.18)",   chips: ["Owner lock", "AES support"] },
  "pdf-to-images":   { color: "#A6FF4D", bg: "rgba(166,255,77,0.1)",   glow: "rgba(166,255,77,0.18)",   chips: ["PNG / JPG", "ZIP export"] },
  "images-to-pdf":   { color: "#46F5B0", bg: "rgba(70,245,176,0.1)",   glow: "rgba(70,245,176,0.18)",   chips: ["Multi-image", "Combined"] },
  "word-to-pdf":     { color: "#3B82F6", bg: "rgba(59,130,246,0.1)",   glow: "rgba(59,130,246,0.18)",   chips: [".docx input", "Styled output"] },
  "pdf-to-word":     { color: "#8B5CFF", bg: "rgba(139,92,255,0.1)",   glow: "rgba(139,92,255,0.18)",   chips: ["Editable", ".docx output"] },
};

const TOOL_DESCRIPTIONS = {
  "merge":           "Combine multiple PDFs into one seamless document.",
  "split":           "Divide a document into multiple separate parts.",
  "compress":        "Losslessly shrink file sizes with 3 compression levels.",
  "extract-pages":   "Pull out specific pages and save as a new PDF.",
  "delete-pages":    "Permanently remove any unwanted pages.",
  "rearrange-pages": "Drag & drop to reorder pages exactly as needed.",
  "rotate-pages":    "Rotate any pages by 90, 180, or 270 degrees.",
  "duplicate-pages": "Copy specific pages and insert copies inline.",
  "reverse":         "Flip the entire page order with one click.",
  "insert-blank":    "Add empty pages at any position in the document.",
  "add-pdf":         "Insert an entire PDF inside another at any page.",
  "unlock-pdf":      "Remove password protection from any locked PDF.",
  "pdf-to-images":   "Export every page as PNG or JPG images in a ZIP.",
  "images-to-pdf":   "Merge multiple images into a single PDF file.",
  "word-to-pdf":     "Convert .docx Word documents into styled PDFs.",
  "pdf-to-word":     "Turn PDFs back into editable .docx Word files.",
};

const QUICK_ACTIONS = [
  { id: "merge",     label: "Merge PDFs",    color: "#46F5B0", bg: "rgba(70,245,176,0.12)",  icon: "⊕" },
  { id: "compress",  label: "Compress PDF",  color: "#FFB020", bg: "rgba(255,176,32,0.12)",  icon: "⊘" },
  { id: "pdf-to-word", label: "PDF to Word", color: "#8B5CFF", bg: "rgba(139,92,255,0.12)", icon: "W" },
  { id: "word-to-pdf", label: "Word to PDF", color: "#3B82F6", bg: "rgba(59,130,246,0.12)", icon: "P" },
  { id: "unlock-pdf",  label: "Unlock PDF",  color: "#FF5F9F", bg: "rgba(255,95,159,0.12)", icon: "🔓" },
];

/* ─── Arrow icon ─── */
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ─── Tool Card ─── */
function ToolCard({ tool, onSelect }) {
  const cfg = CARD_CONFIG[tool.id] || { color: "#46F5B0", bg: "rgba(70,245,176,0.1)", glow: "rgba(70,245,176,0.18)", chips: [] };
  const Icon = tool.icon;
  return (
    <div
      className="tool-card"
      onClick={() => onSelect(tool.id)}
      style={{
        "--card-accent": cfg.color,
        "--card-glow": cfg.glow,
        "--card-accent-color": cfg.color,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(tool.id)}
      aria-label={`Open ${tool.label} tool`}
    >
      <div className="card-top">
        <div className="card-icon-wrap" style={{ background: cfg.bg, color: cfg.color }}>
          <Icon width="20" height="20" />
        </div>
        <span className="card-arrow"><ArrowIcon /></span>
      </div>
      <div className="card-name">{tool.label}</div>
      <div className="card-desc">{TOOL_DESCRIPTIONS[tool.id] || ""}</div>
      <div className="card-divider" />
      <div className="card-chips">
        {cfg.chips.map((chip) => (
          <span
            key={chip}
            className="card-chip"
            style={{
              background: cfg.bg,
              color: cfg.color,
              borderColor: `${cfg.color}30`,
            }}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Section heading ─── */
function SectionHeader({ icon, color, bg, title }) {
  return (
    <div className="section-header">
      <div className="section-icon-wrap" style={{ background: bg, color }}>
        {icon}
      </div>
      <span className="section-title">{title}</span>
      <div className="section-divider" />
    </div>
  );
}

/* ─── Main HomePage ─── */
export default function HomePage({ onSelect }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all",        label: "All Tools" },
    { id: "processing", label: "PDF Processing" },
    { id: "conversion", label: "Conversion" },
    { id: "security",   label: "Security" },
  ];

  function filterTools(list) {
    const q = search.toLowerCase();
    return list.filter((t) => {
      const matchSearch = !q
        || t.label.toLowerCase().includes(q)
        || (TOOL_DESCRIPTIONS[t.id] || "").toLowerCase().includes(q);
      const matchFilter = (() => {
        if (activeFilter === "all") return true;
        if (activeFilter === "processing") return !["pdf-to-images","images-to-pdf","word-to-pdf","pdf-to-word","unlock-pdf"].includes(t.id);
        if (activeFilter === "conversion") return ["pdf-to-images","images-to-pdf","word-to-pdf","pdf-to-word"].includes(t.id);
        if (activeFilter === "security")   return ["unlock-pdf"].includes(t.id);
        return true;
      })();
      return matchSearch && matchFilter;
    });
  }

  const allTools = [...PDF_TOOLS, ...CONVERSION_TOOLS];

  const showProcessing = activeFilter === "all" || activeFilter === "processing";
  const showConversion = activeFilter === "all" || activeFilter === "conversion";
  const showSecurity   = activeFilter === "all" || activeFilter === "security";

  const filteredProcessing = filterTools(PDF_TOOLS.filter(t => t.id !== "unlock-pdf"));
  const filteredConversion = filterTools(CONVERSION_TOOLS);
  const filteredSecurity   = filterTools(PDF_TOOLS.filter(t => t.id === "unlock-pdf"));

  const totalResults =
    (showProcessing ? filteredProcessing.length : 0) +
    (showConversion ? filteredConversion.length : 0) +
    (showSecurity   ? filteredSecurity.length : 0);

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-section">
        {/* Left */}
        <div className="hero-left">
          <div className="hero-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            100% Stateless Engine
          </div>

          <h1 className="hero-heading">
            Stupid<span className="brand-accent">PDF</span>
          </h1>

          <p className="hero-subtitle">
            The fastest private PDF toolkit.<br />
            Runs entirely in-memory. Zero uploads. Zero storage.
          </p>

          <div className="hero-pills">
            <div className="hero-pill">
              <div className="hero-pill-dot" />
              In-Memory Processing
            </div>
            <div className="hero-pill">
              <div className="hero-pill-dot purple" />
              No File Uploads
            </div>
            <div className="hero-pill">
              <div className="hero-pill-dot blue" />
              Private & Secure
            </div>
          </div>

          <div className="hero-cta-group">
            <button className="btn-primary" onClick={() => onSelect("merge")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload PDF
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById("tools-section")?.scrollIntoView({ behavior: "smooth" })}>
              Explore Tools
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right — Upload Illustration */}
        <div className="hero-right">
          <div className="hero-upload-zone" onClick={() => onSelect("merge")}>
            {/* Ambient bg radial */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(70,245,176,0.04) 0%, transparent 70%)",
              pointerEvents: "none"
            }} />

            {/* PDF illustration */}
            <div className="pdf-illustration">
              <div className="orbit-ring" />
              <div className="orbit-ring" />
              <div className="orbit-ring" />
              <div className="pdf-illustration-bg" />
              <div className="pdf-icon-3d" />
            </div>

            <div className="upload-zone-label">Drop your PDF here</div>
            <div className="upload-zone-sub">or click to browse files</div>
            <div className="upload-zone-meta">Supports: PDF · Max file size: 200MB</div>
          </div>
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <div className="quick-actions-panel">
        <div className="quick-actions-inner">
          <div className="quick-actions-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Quick Actions
          </div>
          {QUICK_ACTIONS.map((qa) => (
            <button
              key={qa.id}
              className="quick-action-btn"
              onClick={() => onSelect(qa.id)}
            >
              <div className="qa-icon" style={{ background: qa.bg, color: qa.color, fontSize: "0.85rem" }}>
                {qa.icon}
              </div>
              {qa.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tool Grid ── */}
      <div className="home-content" id="tools-section">
        {/* Search + Filters toolbar */}
        <div className="home-toolbar">
          <div className="filter-pills">
            {filters.map((f) => (
              <button
                key={f.id}
                className={`filter-pill${activeFilter === f.id ? " active" : ""}`}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="search-wrapper">
            <svg className="search-icon-el" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="tool-search"
              type="text"
              className="search-input"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search tools"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear search">✕</button>
            )}
          </div>
        </div>

        {/* No results */}
        {totalResults === 0 && (
          <div className="no-results">
            <div className="no-results-emoji">🔍</div>
            <h4>No tools found for "{search}"</h4>
            <p>Try searching for terms like "merge", "compress", "word", or "images"</p>
          </div>
        )}

        {/* PDF Processing Section */}
        {showProcessing && filteredProcessing.length > 0 && (
          <div className="tools-section">
            <SectionHeader
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
              color="#46F5B0"
              bg="rgba(70,245,176,0.1)"
              title="PDF Processing & Editing"
            />
            <div className="tools-grid">
              {filteredProcessing.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onSelect={onSelect} />
              ))}
            </div>
          </div>
        )}

        {/* Conversion Section */}
        {showConversion && filteredConversion.length > 0 && (
          <div className="tools-section">
            <SectionHeader
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>}
              color="#3B82F6"
              bg="rgba(59,130,246,0.1)"
              title="PDF Conversion"
            />
            <div className="tools-grid">
              {filteredConversion.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onSelect={onSelect} />
              ))}
            </div>
          </div>
        )}

        {/* Security Section */}
        {showSecurity && filteredSecurity.length > 0 && (
          <div className="tools-section">
            <SectionHeader
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
              color="#FF5F9F"
              bg="rgba(255,95,159,0.1)"
              title="Security"
            />
            <div className="tools-grid">
              {filteredSecurity.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onSelect={onSelect} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
