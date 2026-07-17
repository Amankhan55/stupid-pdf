import React, { useState } from "react";

export default function Navbar({ onNavigate, activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { id: "tools", label: "Tools" },
    { id: "convert", label: "Convert" },
    { id: "security", label: "Security" },
    { id: "about", label: "About" },
  ];

  function handleLogoClick() {
    onNavigate("home");
    setMenuOpen(false);
  }

  function handleNavClick(id) {
    if (id === "about") {
      window.open("https://github.com/Amankhan55/stupid-pdf", "_blank");
    } else {
      onNavigate("home");
    }
    setMenuOpen(false);
  }

  function handleUploadClick() {
    onNavigate("merge");
    setMenuOpen(false);
  }

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <button className="navbar-logo" onClick={handleLogoClick} style={{ background: "none", border: "none", padding: 0 }}>
          <img src="/logo.png" alt="StupidPDF" className="navbar-logo-icon" />
          <span className="navbar-logo-text">
            Stupid<span>PDF</span>
          </span>
        </button>

        {/* Center Nav */}
        <div className="navbar-nav">
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`navbar-link${activeSection === link.id ? " active" : ""}`}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </button>
          ))}
          <a
            href="https://github.com/Amankhan55/stupid-pdf"
            target="_blank"
            rel="noreferrer"
            className="navbar-link"
          >
            GitHub
          </a>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <a
            href="https://github.com/Amankhan55/stupid-pdf"
            target="_blank"
            rel="noreferrer"
            className="navbar-github-btn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Star us</span>
          </a>

          <button className="navbar-cta" onClick={handleUploadClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Upload PDF</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer${menuOpen ? " open" : ""}`}>
        {navLinks.map((link) => (
          <button
            key={link.id}
            className="mobile-nav-link"
            onClick={() => handleNavClick(link.id)}
          >
            {link.label}
          </button>
        ))}
        <a
          href="https://github.com/Amankhan55/stupid-pdf"
          target="_blank"
          rel="noreferrer"
          className="mobile-nav-link"
          style={{ display: "block" }}
        >
          GitHub ↗
        </a>
        <button
          className="btn-primary"
          onClick={handleUploadClick}
          style={{ marginTop: "8px" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload PDF
        </button>
      </div>
    </>
  );
}
