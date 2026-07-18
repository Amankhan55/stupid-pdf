import React, { useState, useRef, useEffect } from "react";
import { PDF_TOOLS, EDITING_TOOLS, UTILITY_TOOLS, SECURITY_TOOLS, CONVERSION_TOOLS } from "./Sidebar";
import {
  UploadCloudIcon,
  FileIcon,
  CompressIcon,
  MergeIcon,
  SplitIcon,
  PdfToWordIcon,
  PdfToImageIcon,
  UnlockIcon,
  RotateIcon,
  ExtractIcon,
  DeleteIcon
} from "./Icons";

export default function HomePage({ onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Hero Upload state
  const [heroFile, setHeroFile] = useState(null);
  const [heroDragOver, setHeroDragOver] = useState(false);
  const heroFileInputRef = useRef(null);

  // Keyboard shortcut listener ('/' to focus search)
  const searchInputRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleHeroDrop = (e) => {
    e.preventDefault();
    setHeroDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setHeroFile(e.dataTransfer.files[0]);
    }
  };

  const handleHeroFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setHeroFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Helper to categorize tools
  const getToolCategory = (id) => {
    if (["pdf-to-images", "images-to-pdf", "word-to-pdf", "pdf-to-word", "pdf-to-excel"].includes(id)) {
      return "conversion";
    }
    if (["unlock-pdf", "protect-pdf"].includes(id)) {
      return "security";
    }
    if (["add-watermark", "add-page-numbers", "add-signature", "annotate-pdf"].includes(id)) {
      return "editing";
    }
    if (["extract-text", "extract-images"].includes(id)) {
      return "utility";
    }
    return "processing";
  };

  // Combine all tools into a single list
  const allTools = [...PDF_TOOLS, ...EDITING_TOOLS, ...UTILITY_TOOLS, ...SECURITY_TOOLS, ...CONVERSION_TOOLS];

  // Filter tools based on search query and category
  const filteredTools = allTools.filter((tool) => {
    const category = getToolCategory(tool.id);
    const matchesCategory = activeCategory === "all" || activeCategory === category;
    const matchesQuery =
      tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getToolDescription(tool.id).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="home-container">
      {/* ─── HERO SPLIT SECTION ─────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="max-width-wrapper">
          <div className="hero-split-grid">
            {/* Left Hero Column */}
            <div className="hero-left-content">
              {/* Feature Badges */}
              <div className="hero-badges-row">
                <span className="hero-pill-badge">⚡ In Memory</span>
                <span className="hero-pill-badge">🔒 Privacy First</span>
                <span className="hero-pill-badge">⬢ Stateless Engine</span>
              </div>

              {/* Title & Tagline */}
              <h1 className="hero-title-main">
                Stupid<span className="brand-accent-pdf">PDF</span>
              </h1>
              <div className="hero-tagline-gradient">Fast. Private. Local.</div>
              
              <p className="hero-subtitle-desc">
                The fastest PDF toolkit that runs entirely in your browser with zero server uploads or disk retention.
              </p>

              {/* CTAs */}
              <div className="hero-cta-group">
                <button
                  className="btn-hero-primary"
                  onClick={() => heroFileInputRef.current?.click()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Upload PDF</span>
                </button>

                <button
                  className="btn-hero-secondary"
                  onClick={() => {
                    const gridEl = document.getElementById("tools-grid-anchor");
                    gridEl?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span>Browse Tools</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </button>
              </div>

              {/* Quick Action Floating Chips */}
              <div className="quick-chips-wrapper">
                <span className="chips-label">Instant Shortcuts</span>
                <div className="chips-grid">
                  <div className="floating-chip" onClick={() => onSelect("merge", heroFile)}>
                    <span className="chip-icon" style={{ color: "var(--accent-primary)" }}>
                      <MergeIcon width="16" height="16" />
                    </span>
                    <span>Merge</span>
                  </div>

                  <div className="floating-chip" onClick={() => onSelect("compress", heroFile)}>
                    <span className="chip-icon" style={{ color: "var(--accent-secondary)" }}>
                      <CompressIcon width="16" height="16" />
                    </span>
                    <span>Compress</span>
                  </div>

                  <div className="floating-chip" onClick={() => onSelect("pdf-to-word", heroFile)}>
                    <span className="chip-icon" style={{ color: "var(--accent-blue)" }}>
                      <PdfToWordIcon width="16" height="16" />
                    </span>
                    <span>To Word</span>
                  </div>

                  <div className="floating-chip" onClick={() => onSelect("pdf-to-images", heroFile)}>
                    <span className="chip-icon" style={{ color: "var(--accent-amber)" }}>
                      <PdfToImageIcon width="16" height="16" />
                    </span>
                    <span>Images</span>
                  </div>

                  <div className="floating-chip" onClick={() => onSelect("unlock-pdf", heroFile)}>
                    <span className="chip-icon" style={{ color: "var(--accent-purple)" }}>
                      <UnlockIcon width="16" height="16" />
                    </span>
                    <span>Unlock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Premium 420px Hero Upload Dropzone Panel */}
            <div className="hero-right-content">
              <div
                className={`hero-upload-panel${heroDragOver ? " drag-over" : ""}`}
                onDrop={handleHeroDrop}
                onDragOver={(e) => { e.preventDefault(); setHeroDragOver(true); }}
                onDragLeave={() => setHeroDragOver(false)}
                onClick={() => !heroFile && heroFileInputRef.current?.click()}
              >
                {/* Background Radar Lines */}
                <div className="radar-bg-lines">
                  <div className="radar-circle c1"></div>
                  <div className="radar-circle c2"></div>
                  <div className="radar-circle c3"></div>
                </div>

                {!heroFile ? (
                  <div className="ref-upload-dropzone">
                    {/* 3D Glassmorphic PDF Graphic with Atomic Light Orbitals */}
                    <div className="upload-visual-wrapper">
                      <div className="atomic-core-glow"></div>
                      <div className="atomic-ring atomic-ring-1"></div>
                      <div className="atomic-ring atomic-ring-2"></div>
                      <div className="atomic-ring atomic-ring-3"></div>
                      <div className="atomic-node atomic-node-1"></div>
                      <div className="atomic-node atomic-node-2"></div>
                      <img
                        src="/pdf-hero-icon.png"
                        alt="3D Animated PDF Glassmorphic Graphic"
                        className="hero-animated-img"
                      />
                    </div>

                    {/* Center Title & Subtitle */}
                    <div className="ref-upload-text">
                      <div className="ref-upload-title">Drop your PDF here</div>
                      <div className="ref-upload-subtitle">or click to browse files</div>
                    </div>

                    {/* Bottom Dashed Footer Meta */}
                    <div className="ref-upload-footer">
                      <span>Supports: PDF</span>
                      <span className="ref-dot-sep">•</span>
                      <span>Max file size: 200MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-file-card" onClick={(e) => e.stopPropagation()}>
                    <div className="upload-file-header">
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
                        <FileIcon width="28" height="28" style={{ flexShrink: 0, color: "var(--accent-primary)" }} />
                        <div style={{ overflow: "hidden" }}>
                          <div className="upload-file-title" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {heroFile.name}
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                            {formatFileSize(heroFile.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => setHeroFile(null)}
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--accent-primary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>✓ File Ready — Choose Tool to Run:</span>
                    </div>

                    <div className="action-buttons-grid">
                      <button className="quick-action-btn" onClick={() => onSelect("compress", heroFile)}>
                        <CompressIcon width="18" height="18" />
                        <span>Compress</span>
                      </button>
                      <button className="quick-action-btn" onClick={() => onSelect("merge", heroFile)}>
                        <MergeIcon width="18" height="18" />
                        <span>Merge</span>
                      </button>
                      <button className="quick-action-btn" onClick={() => onSelect("split", heroFile)}>
                        <SplitIcon width="18" height="18" />
                        <span>Split Pages</span>
                      </button>
                      <button className="quick-action-btn" onClick={() => onSelect("pdf-to-word", heroFile)}>
                        <PdfToWordIcon width="18" height="18" />
                        <span>To Word</span>
                      </button>
                      <button className="quick-action-btn" onClick={() => onSelect("pdf-to-images", heroFile)}>
                        <PdfToImageIcon width="18" height="18" />
                        <span>To Images</span>
                      </button>
                      <button className="quick-action-btn" onClick={() => onSelect("unlock-pdf", heroFile)}>
                        <UnlockIcon width="18" height="18" />
                        <span>Unlock</span>
                      </button>
                    </div>

                    <button
                      className="change-file-btn"
                      onClick={() => heroFileInputRef.current?.click()}
                    >
                      <span>Choose Different File</span>
                    </button>
                  </div>
                )}

                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept="application/pdf,.docx,image/*"
                  style={{ display: "none" }}
                  onChange={handleHeroFileSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOOL CARDS SECTION & FILTERS ──────────────────────────────────── */}
      <section className="max-width-wrapper tools-grid-section" id="tools-grid-anchor">
        <div className="nav-filters-bar">
          {/* Glass Pill Category Filter Tabs */}
          <div className="category-pills">
            {[
              { id: "all", label: "All Tools" },
              { id: "processing", label: "Processing" },
              { id: "editing", label: "Editing" },
              { id: "utility", label: "Utilities" },
              { id: "conversion", label: "Conversion" },
              { id: "security", label: "Security" },
            ].map((cat) => (
              <button
                key={cat.id}
                className={`category-pill-btn${activeCategory === cat.id ? " active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box with '/' Shortcut Indicator */}
          <div className="search-wrapper">
            <svg className="search-icon-left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="search-input-field"
              placeholder="Search tools (e.g. merge, compress, word)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="shortcut-badge-right">/</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="section-heading-row">
          <h2 className="section-title">PDF Toolkit Suite</h2>
          <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }}>
            Showing {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Tool Cards Grid */}
        <div className="tools-grid-layout">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const category = getToolCategory(tool.id);
            const isSoon = tool.comingSoon || ["annotate-pdf", "pdf-to-excel"].includes(tool.id);

            return (
              <div
                key={tool.id}
                className={`tool-card-luxury${isSoon ? " card-coming-soon disabled" : ""}`}
                data-category={category}
                style={isSoon ? { cursor: "not-allowed", opacity: 0.65 } : {}}
                onClick={() => {
                  if (!isSoon) {
                    onSelect(tool.id, heroFile);
                  }
                }}
              >
                <div>
                  <div className="tool-card-top">
                    <div className="card-icon-square">
                      <Icon width="24" height="24" />
                    </div>
                    {isSoon && (
                      <span className="badge-coming-soon">
                        ✨ Coming Soon
                      </span>
                    )}
                  </div>

                  <h3 className="card-title-text">{tool.label}</h3>
                  <p className="card-desc-text">{getToolDescription(tool.id)}</p>
                </div>

                <div className="tool-card-bottom">
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {category}
                  </span>
                  {isSoon ? (
                    <span className="card-soon-text">Under Polish</span>
                  ) : (
                    <div className="action-arrow-circle">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── EXACT REFERENCE MATCH FEATURE SURFACE STRIP ───────────────────── */}
      <section className="max-width-wrapper" style={{ marginBottom: "40px", position: "relative" }}>
        <div className="feature-surface-strip">
          {/* Block 1: Lightning Fast */}
          <div className="feature-block-item">
            <div className="feature-raw-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14F195" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="feature-info-col">
              <div className="feature-block-title">Lightning Fast</div>
              <div className="feature-block-desc">Process files in seconds with in-memory engine.</div>
            </div>
          </div>

          {/* Block 2: Privacy First */}
          <div className="feature-block-item">
            <div className="feature-raw-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="8" x2="12" y2="14" />
                <line x1="9" y1="11" x2="15" y2="11" />
              </svg>
            </div>
            <div className="feature-info-col">
              <div className="feature-block-title">Privacy First</div>
              <div className="feature-block-desc">We never store your files. Your data stays with you.</div>
            </div>
          </div>

          {/* Block 3: Stateless Engine */}
          <div className="feature-block-item">
            <div className="feature-raw-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C9FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div className="feature-info-col">
              <div className="feature-block-title">Stateless Engine</div>
              <div className="feature-block-desc">No sessions. No storage. Just pure processing power.</div>
            </div>
          </div>

          {/* Block 4: Open Source */}
          <div className="feature-block-item">
            <div className="feature-raw-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C9FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
                <line x1="14" y1="4" x2="10" y2="20" />
              </svg>
            </div>
            <div className="feature-info-col">
              <div className="feature-block-title">Open Source</div>
              <div className="feature-block-desc">Built with love. Contributions are always welcome.</div>
            </div>
          </div>

          {/* ─── Bottom-Left Green & Bottom-Right Purple Vector Wireframe Curves ─ */}
          <div className="corner-wave-overlay">
            <svg width="100%" height="100%" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none">
              <defs>
                <linearGradient id="green-wire-grad" x1="0%" y1="100%" x2="40%" y2="0%">
                  <stop offset="0%" stopColor="#14F195" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#14F195" stopOpacity="0" />
                </linearGradient>
                
                <linearGradient id="purple-wire-grad" x1="100%" y1="100%" x2="60%" y2="0%">
                  <stop offset="0%" stopColor="#9B6DFF" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#ec4899" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#9B6DFF" stopOpacity="0" />
                </linearGradient>

                <filter id="mesh-glow-green" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="mesh-glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Bottom Left Green Vector Curves */}
              <path className="corner-curve green-c1" d="M -30 120 Q 60 70, 240 105 T 520 125" stroke="url(#green-wire-grad)" strokeWidth="1.8" filter="url(#mesh-glow-green)" />
              <path className="corner-curve green-c2" d="M -30 105 Q 80 50, 280 90 T 560 125" stroke="url(#green-wire-grad)" strokeWidth="1.4" filter="url(#mesh-glow-green)" />
              <path className="corner-curve green-c3" d="M -30 90 Q 100 30, 320 75 T 600 125" stroke="url(#green-wire-grad)" strokeWidth="1" opacity="0.6" />

              {/* Bottom Right Purple Vector Curves */}
              <path className="corner-curve purple-c1" d="M 1230 120 Q 1120 50, 920 95 T 680 125" stroke="url(#purple-wire-grad)" strokeWidth="2.2" filter="url(#mesh-glow-purple)" />
              <path className="corner-curve purple-c2" d="M 1230 100 Q 1100 30, 870 80 T 630 125" stroke="url(#purple-wire-grad)" strokeWidth="1.6" filter="url(#mesh-glow-purple)" />
              <path className="corner-curve purple-c3" d="M 1230 80 Q 1070 10, 820 65 T 580 125" stroke="url(#purple-wire-grad)" strokeWidth="1" opacity="0.6" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helpers for short grid descriptions
function getToolDescription(id) {
  const descriptions = {
    "merge": "Combine multiple PDFs into a single file seamlessly.",
    "split": "Divide a document into multiple parts or sections.",
    "compress": "Losslessly optimize file sizes for fast sharing.",
    "extract-pages": "Select and save specific pages to a new PDF.",
    "delete-pages": "Permanently remove redundant pages from a file.",
    "rearrange-pages": "Drag & drop to re-order pages visually.",
    "rotate-pages": "Turn page rotations by 90, 180, or 270 degrees.",
    "duplicate-pages": "Copy specific pages immediately after themselves.",
    "reverse": "Flip the entire page structure in reverse order.",
    "insert-blank": "Surgically add blank empty pages anywhere.",
    "add-pdf": "Insert an entire PDF directly inside another file.",
    "pdf-to-images": "Convert PDF pages into PNG or JPG images packed in ZIP.",
    "images-to-pdf": "Combine PNG/JPG images into a single PDF.",
    "word-to-pdf": "Convert Word docx files into styled PDF format.",
    "pdf-to-word": "Convert PDFs back into editable Word docx files.",
    "unlock-pdf": "Remove password protection from encrypted PDFs.",
    "protect-pdf": "Encrypt your PDF with AES-256 password protection.",
    "add-watermark": "Overlay custom diagonal text watermark on every page.",
    "add-page-numbers": "Auto-stamp page numbers at header or footer position.",
    "extract-text": "Pull all readable text and download as a .txt file.",
    "extract-images": "Extract all embedded images into a ZIP archive.",
    "pdf-to-excel": "Extract tables from PDF into an editable .xlsx spreadsheet.",
    "add-signature": "Draw or upload a signature and embed it on any page.",
    "annotate-pdf": "Add text boxes and highlight overlays to any page area.",
  };
  return descriptions[id] || "Fast, stateless browser processing.";
}
