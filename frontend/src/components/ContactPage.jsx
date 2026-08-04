import { useState } from "react";
import { sendContactMessage } from "../api/contact";
import {
  PrivacyShieldIcon,
  ResponseClockIcon,
  GitHubBranchIcon,
  ContactUserIcon,
  ContactEmailIcon,
  TopicQuestionIcon,
  TopicBugIcon,
  TopicFeatureIcon,
  TopicPartnershipIcon,
} from "./Icons";

export default function ContactPage({ onBack, onSelectTool }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General Question");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [error, setError] = useState("");

  const TOPICS = [
    { id: "General Question", label: "General Question", icon: TopicQuestionIcon },
    { id: "Bug Report", label: "Bug Report", icon: TopicBugIcon },
    { id: "Feature Request", label: "Feature Request", icon: TopicFeatureIcon },
    { id: "Partnership", label: "Partnership", icon: TopicPartnershipIcon },
  ];

  const MAX_CHARS = 5000;
  const charsRemaining = MAX_CHARS - message.length;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setError("Please fill in your name, email, and message.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      await sendContactMessage(name.trim(), email.trim(), message.trim(), topic);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err?.response?.data?.detail || "Something went wrong. Please try again later.");
    }
  }

  function handleResetForm() {
    setStatus(null);
    setName("");
    setEmail("");
    setMessage("");
    setError("");
  }

  return (
    <main style={{ flex: 1 }} className="contact-main-wrapper">
      <div className="max-width-wrapper contact-page-container">
        {/* Back Button */}
        <button className="contact-back-btn" onClick={onBack} aria-label="Back to StupidPDF">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to StupidPDF</span>
        </button>

        {/* Hero Title Header */}
        <div className="contact-header-section">
          <div className="contact-pill-badge">
            <span className="contact-badge-dot"></span>
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="contact-title-main">
            We're Here to <span className="brand-accent-pdf">Help</span>
          </h1>
          <p className="contact-subtitle-desc">
            Questions? Found a bug? Have an idea for a new feature? Send us a message and we'll usually reply within 24 hours.
          </p>
        </div>

        {/* 2-Column Split Grid (Equal Height Strech Layout) */}
        <div className="contact-split-grid">
          {/* Left Column: Information Cards & Trust Badges */}
          <div className="contact-info-col">
            {/* Card 1: Fast Response */}
            <div className="contact-card-surface">
              <div className="contact-card-icon-box emerald">
                <ResponseClockIcon width="20" height="20" />
              </div>
              <div className="contact-card-text">
                <div className="contact-card-title">Fast Response Time</div>
                <div className="contact-card-desc">
                  We read every message and aim to respond quickly.
                </div>
                <span className="contact-meta-pill">
                  <ResponseClockIcon width="12" height="12" /> Usually replies in 24h
                </span>
              </div>
            </div>

            {/* Card 2: Open Source & GitHub Issues */}
            <a
              href="https://github.com/Amankhan55/stupid-pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card-surface clickable-card"
            >
              <div className="contact-card-icon-box cyan">
                <GitHubBranchIcon width="20" height="20" />
              </div>
              <div className="contact-card-text">
                <div className="contact-card-title">Open Source Community</div>
                <div className="contact-card-desc">
                  View source code, report bugs, or request features on GitHub.
                </div>
                <ul className="contact-card-bullets">
                  <li>• View Source Code</li>
                  <li>• Report Issues &amp; Bugs</li>
                  <li>• Request New Tools</li>
                </ul>
                <span className="contact-card-link-text">→ GitHub Repository</span>
              </div>
            </a>

            {/* Card 3: Privacy First Guarantee */}
            <div className="contact-card-surface">
              <div className="contact-card-icon-box purple">
                <PrivacyShieldIcon width="20" height="20" />
              </div>
              <div className="contact-card-text">
                <div className="contact-card-title">Privacy First Guarantee</div>
                <ul className="contact-card-bullets">
                  <li>✔ Files are never stored on disk</li>
                  <li>✔ Processed entirely in memory</li>
                  <li>✔ Automatically discarded after processing</li>
                </ul>
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div className="contact-trust-badges">
              <span className="trust-badge">✔ Usually replies in 24h</span>
              <span className="trust-badge">✔ 100% Open Source</span>
              <span className="trust-badge">✔ No Account Needed</span>
              <span className="trust-badge">✔ Privacy First</span>
            </div>
          </div>

          {/* Right Column: Luxury Form Panel */}
          <div className="contact-form-panel">
            <h2 className="contact-form-heading">Send Us a Message</h2>
            <p className="contact-form-subheading">Fill out the details below to get in touch with our team.</p>

            {status === "success" ? (
              <div className="contact-success-container">
                <div className="success-animated-badge">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0B0F17" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="success-state-title">Message Sent!</h3>
                <p className="success-state-desc">
                  Thanks for contacting us. We have received your message and will review it shortly.
                </p>
                <div className="success-reassurance-pill">
                  We usually respond within 24 hours.
                </div>
                <button type="button" className="btn-send-another" onClick={handleResetForm}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form-body">
                {/* Topic Selector Pills with Vector SVG Icons */}
                <div className="contact-form-group">
                  <label className="contact-form-label">Need help with?</label>
                  <div className="contact-topic-pills" role="radiogroup" aria-label="Select message topic">
                    {TOPICS.map((t) => {
                      const IconComp = t.icon;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          className={`topic-pill-btn${topic === t.id ? " active" : ""}`}
                          onClick={() => setTopic(t.id)}
                          role="radio"
                          aria-checked={topic === t.id}
                        >
                          <IconComp width="14" height="14" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name Field */}
                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="contact-name">
                    Your Name <span className="required-star">*</span>
                  </label>
                  <div className="contact-input-wrapper">
                    <span className="input-icon-left" aria-hidden="true">
                      <ContactUserIcon width="16" height="16" />
                    </span>
                    <input
                      id="contact-name"
                      className="contact-form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      maxLength={100}
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="contact-email">
                    Email Address <span className="required-star">*</span>
                  </label>
                  <div className="contact-input-wrapper">
                    <span className="input-icon-left" aria-hidden="true">
                      <ContactEmailIcon width="16" height="16" />
                    </span>
                    <input
                      id="contact-email"
                      type="email"
                      className="contact-form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      maxLength={200}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="contact-form-group">
                  <div className="label-flex-row">
                    <label className="contact-form-label" htmlFor="contact-message">
                      Message <span className="required-star">*</span>
                    </label>
                    <span className="char-counter" aria-live="polite">
                      {charsRemaining} characters remaining
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    className="contact-form-input contact-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your question, bug report, or feature request in detail..."
                    maxLength={MAX_CHARS}
                    rows={4}
                    required
                  />
                </div>

                {/* Error Banner */}
                {status === "error" && (
                  <div className="contact-error-pill" role="alert">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-contact-submit"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <span className="contact-spinner" aria-hidden="true" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <svg className="plane-send-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Reassurance Note Below Button */}
                <div className="contact-reassurance-note">
                  <PrivacyShieldIcon width="14" height="14" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>We usually reply within 24 hours. Your email is only used to respond and is never shared.</span>
                </div>
              </form>
            )}

            {/* Quick Link Footer Anchor */}
            <div className="contact-form-footer-hint">
              <span>Looking for a quick answer?</span>
              <button
                type="button"
                className="faq-link-btn"
                onClick={() => onSelectTool ? onSelectTool("home") : onBack()}
              >
                Browse all PDF Tools →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
