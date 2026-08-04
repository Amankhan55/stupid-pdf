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
  DeleteIcon,
  PopularSparkIcon,
  InMemoryIcon,
  PrivacyShieldIcon,
  StatelessEngineIcon,
  ComingSoonLockIcon
} from "./Icons";
import { formatBytes } from "../utils/format";

// ─── Popular tool IDs (Priority 3 & 4) ───────────────────────────────────────
const POPULAR_TOOL_IDS = ["merge", "compress", "pdf-to-word", "word-to-pdf", "images-to-pdf", "pdf-to-images"];

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

  // Popular tools (only shown on "all" tab with no search)
  const showPopularSection = activeCategory === "all" && searchQuery === "";
  const popularTools = allTools.filter((t) => POPULAR_TOOL_IDS.includes(t.id));

  // Helper to render a single tool card
  const renderToolCard = (tool, isPopular = false) => {
    const Icon = tool.icon;
    const category = getToolCategory(tool.id);
    const isSoon = tool.comingSoon || ["annotate-pdf", "pdf-to-excel"].includes(tool.id);

    return (
      <div
        key={tool.id}
        className={`tool-card-luxury${isSoon ? " card-coming-soon disabled" : ""}${isPopular && !isSoon ? " card-popular" : ""}`}
        data-category={category}
        role="button"
        tabIndex={isSoon ? -1 : 0}
        aria-label={isSoon ? `${tool.label} — Coming Soon` : `${tool.label}: ${getToolDescription(tool.id)}`}
        aria-disabled={isSoon ? "true" : undefined}
        onClick={() => {
          if (!isSoon) onSelect(tool.id, heroFile);
        }}
        onKeyDown={(e) => {
          if (!isSoon && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
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
              <span className="badge-soon">
                <ComingSoonLockIcon width="12" height="12" /> Coming Soon
              </span>
            )}
            {!isSoon && isPopular && (
              <span className="badge-popular">
                <PopularSparkIcon width="13" height="13" /> Popular
              </span>
            )}
          </div>

          <h3 className="card-title-text">{tool.label}</h3>
          <p className="card-desc-text">{getToolDescription(tool.id)}</p>
        </div>

        <div className="tool-card-bottom">
          <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {category}
          </span>
          {isSoon ? (
            <span className="card-soon-text">
              <ComingSoonLockIcon width="11" height="11" /> Coming Soon
            </span>
          ) : (
            <div className="action-arrow-circle" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          )}
        </div>

        {isSoon && (
          <div className="card-soon-overlay" aria-hidden="true">
            <ComingSoonLockIcon width="32" height="32" style={{ filter: "drop-shadow(0 0 12px rgba(255, 190, 61, 0.5))" }} />
            <span className="overlay-soon-label">Coming Soon</span>
          </div>
        )}
      </div>
    );
  };

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
                <span className="hero-pill-badge">
                  <InMemoryIcon width="14" height="14" /> In Memory
                </span>
                <span className="hero-pill-badge">
                  <PrivacyShieldIcon width="14" height="14" /> Privacy First
                </span>
                <span className="hero-pill-badge">
                  <StatelessEngineIcon width="14" height="14" /> Stateless Engine
                </span>
              </div>

              {/* Title & Tagline */}
              <h1 className="hero-title-main">
                Stupid<span className="brand-accent-pdf">PDF</span>
              </h1>
              <div className="hero-tagline-gradient">Stupidly Simple. Blazingly Fast.</div>
              
              <p className="hero-subtitle-desc">
                No accounts. No subscriptions. No stored files. Just instant PDF tools powered by a zero-storage processing engine.
              </p>

              {/* CTAs */}
              <div className="hero-cta-group">
                <button
                  className="btn-hero-primary"
                  aria-label="Upload a PDF file"
                  onClick={() => heroFileInputRef.current?.click()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Upload PDF</span>
                </button>

                <button
                  className="btn-hero-secondary"
                  aria-label="Browse all PDF tools"
                  onClick={() => {
                    const gridEl = document.getElementById("tools-grid-anchor");
                    gridEl?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span>Browse Tools</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </button>
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
                role="button"
                tabIndex={0}
                aria-label="Upload PDF: drag and drop or click to browse"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!heroFile) heroFileInputRef.current?.click();
                  }
                }}
              >
                {/* Background Radar Lines */}
                <div className="radar-bg-lines" aria-hidden="true">
                  <div className="radar-circle c1"></div>
                  <div className="radar-circle c2"></div>
                  <div className="radar-circle c3"></div>
                </div>

                {!heroFile ? (
                  <div className="ref-upload-dropzone">
                    {/* 3D Glassmorphic PDF Graphic with Atomic Light Orbitals */}
                    <div className="upload-visual-wrapper" aria-hidden="true">
                      <div className="atomic-core-glow"></div>
                      <div className="atomic-ring atomic-ring-1"></div>
                      <div className="atomic-ring atomic-ring-2"></div>
                      <div className="atomic-ring atomic-ring-3"></div>
                      <div className="atomic-node atomic-node-1"></div>
                      <div className="atomic-node atomic-node-2"></div>
                      <img
                        src="/pdf-hero-icon.png"
                        alt="PDF document illustration"
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
                      <span className="ref-dot-sep" aria-hidden="true">•</span>
                      <span>Max file size: 200MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-file-card" onClick={(e) => e.stopPropagation()}>
                    <div className="upload-file-header">
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
                        <FileIcon width="28" height="28" style={{ flexShrink: 0, color: "var(--accent-primary)" }} aria-hidden="true" />
                        <div style={{ overflow: "hidden" }}>
                          <div className="upload-file-title" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {heroFile.name}
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                            {formatBytes(heroFile.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => setHeroFile(null)}
                        title="Remove file"
                        aria-label="Remove file"
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--accent-primary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>✓ File Ready — Choose Tool to Run:</span>
                    </div>

                    <div className="action-buttons-grid">
                      <button className="quick-action-btn" aria-label="Compress this PDF" onClick={() => onSelect("compress", heroFile)}>
                        <CompressIcon width="18" height="18" aria-hidden="true" />
                        <span>Compress</span>
                      </button>
                      <button className="quick-action-btn" aria-label="Merge PDFs" onClick={() => onSelect("merge", heroFile)}>
                        <MergeIcon width="18" height="18" aria-hidden="true" />
                        <span>Merge</span>
                      </button>
                      <button className="quick-action-btn" aria-label="Split PDF pages" onClick={() => onSelect("split", heroFile)}>
                        <SplitIcon width="18" height="18" aria-hidden="true" />
                        <span>Split Pages</span>
                      </button>
                      <button className="quick-action-btn" aria-label="Convert PDF to Word" onClick={() => onSelect("pdf-to-word", heroFile)}>
                        <PdfToWordIcon width="18" height="18" aria-hidden="true" />
                        <span>To Word</span>
                      </button>
                      <button className="quick-action-btn" aria-label="Convert PDF to Images" onClick={() => onSelect("pdf-to-images", heroFile)}>
                        <PdfToImageIcon width="18" height="18" aria-hidden="true" />
                        <span>To Images</span>
                      </button>
                      <button className="quick-action-btn" aria-label="Unlock PDF" onClick={() => onSelect("unlock-pdf", heroFile)}>
                        <UnlockIcon width="18" height="18" aria-hidden="true" />
                        <span>Unlock</span>
                      </button>
                    </div>

                    <button
                      className="change-file-btn"
                      aria-label="Choose a different file"
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
                  aria-hidden="true"
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
          <div className="category-pills" role="tablist" aria-label="Filter tools by category">
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
                role="tab"
                aria-selected={activeCategory === cat.id}
                aria-controls="tools-grid-anchor"
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box with '/' Shortcut Indicator */}
          <div className="search-wrapper">
            <svg className="search-icon-left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              id="tools-search"
              className="search-input-field"
              placeholder="Search tools (e.g. merge, compress, word)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search PDF tools"
              autoComplete="off"
            />
            <span className="shortcut-badge-right" aria-hidden="true">/</span>
          </div>
        </div>

        {/* Popular Tools Section (Priority 4) — shown only on "All" with no search */}
        {showPopularSection && (
          <div className="popular-tools-section">
            <div className="popular-tools-heading">
              <h2 className="popular-tools-title">
                <PopularSparkIcon width="22" height="22" style={{ filter: "drop-shadow(0 0 10px rgba(20, 241, 149, 0.5))" }} aria-hidden="true" /> Popular Tools
              </h2>
            </div>
            <div className="popular-tools-grid" role="list" aria-label="Popular PDF tools">
              {popularTools.map((tool) => renderToolCard(tool, true))}
            </div>
          </div>
        )}

        {/* Section Heading */}
        <div className="section-heading-row">
          <h2 className="section-title">{showPopularSection ? "All Tools" : "PDF Toolkit Suite"}</h2>
          <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }} aria-live="polite">
            {filteredTools.length} Tool{filteredTools.length !== 1 ? "s" : ""} Available
          </span>
        </div>

        {/* Tool Cards Grid */}
        <div className="tools-grid-layout" role="list" aria-label="All PDF tools">
          {filteredTools.length === 0 ? (
            /* Empty state (Priority 18) */
            <div className="empty-search-state" role="status" aria-live="polite">
              <div className="empty-search-icon" aria-hidden="true">🔍</div>
              <div className="empty-search-title">We searched everywhere.</div>
              <div className="empty-search-desc">Couldn't find that tool.</div>
              <button
                className="empty-search-clear-btn"
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                aria-label="Clear search and reset filters"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredTools.map((tool) => renderToolCard(tool, POPULAR_TOOL_IDS.includes(tool.id) && showPopularSection === false))
          )}
        </div>
      </section>

      {/* ─── EXACT REFERENCE MATCH FEATURE SURFACE STRIP ───────────────────── */}
      <section className="max-width-wrapper" style={{ marginBottom: "40px", position: "relative" }}>
        <div className="feature-surface-strip" role="list" aria-label="Key features">
          {/* Block 1: Lightning Fast */}
          <div className="feature-block-item" role="listitem">
            <div className="feature-raw-icon" aria-hidden="true">
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
          <div className="feature-block-item" role="listitem">
            <div className="feature-raw-icon" aria-hidden="true">
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
          <div className="feature-block-item" role="listitem">
            <div className="feature-raw-icon" aria-hidden="true">
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
          <div className="feature-block-item" role="listitem">
            <div className="feature-raw-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C9FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
                <line x1="14" y1="4" x2="10" y2="20" />
              </svg>
            </div>
            <div className="feature-info-col">
              <div className="feature-block-title">Open Source</div>
              <div className="feature-block-desc">Built with ❤️. Contributions are always welcome.</div>
            </div>
          </div>

          {/* ─── Bottom-Left Green & Bottom-Right Purple Vector Wireframe Curves ─ */}
          <div className="corner-wave-overlay" aria-hidden="true">
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

// ─── Personality-driven tool descriptions (Priority 8) ───────────────────────
function getToolDescription(id) {
  const descriptions = {
    "merge":            "No drama. Just one PDF.",
    "split":            "One PDF too many? Split it up.",
    "compress":         "Shrink it. Keep it beautiful.",
    "extract-pages":    "Pick the pages you need, ditch the rest.",
    "delete-pages":     "Surgically remove the pages you don't want.",
    "rearrange-pages":  "Drag & drop to get pages in the right order.",
    "rotate-pages":     "Flip it 90°, 180°, or 270°. Your call.",
    "duplicate-pages":  "Need a copy of that page? Done.",
    "reverse":          "Read it backwards. Why not?",
    "insert-blank":     "Add breathing room anywhere in your PDF.",
    "add-pdf":          "Stitch another PDF right inside this one.",
    "pdf-to-images":    "Every page becomes a crisp image. Packed in ZIP.",
    "images-to-pdf":    "Photos in. PDF out. Done.",
    "word-to-pdf":      "From .docx to perfect PDF instantly.",
    "pdf-to-word":      "Your PDF wants to be editable again.",
    "unlock-pdf":       "Forgot the password? We've got you.",
    "protect-pdf":      "Lock it down with AES-256.",
    "add-watermark":    "Stamp your name on every page. Bold.",
    "add-page-numbers": "Never lose track of a page again.",
    "extract-text":     "Your PDF has words. Let's free them.",
    "extract-images":   "Pull all embedded images into a ZIP.",
    "pdf-to-excel":     "Tables in PDF? Extract them to .xlsx.",
    "add-signature":    "Draw or upload a signature and embed it.",
    "annotate-pdf":     "Highlight, comment, and mark up any page.",
  };
  return descriptions[id] || "Fast, stateless browser processing.";
}
