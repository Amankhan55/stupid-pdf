import React from "react";
import { PrivacyShieldIcon } from "./Icons";

export default function PrivacyPolicy({ onBack }) {
  return (
    <main style={{ flex: 1 }}>
      <div className="max-width-wrapper privacy-policy-page">
        <button className="privacy-back-btn" onClick={onBack} aria-label="Back to StupidPDF">
          ← Back to StupidPDF
        </button>

        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-updated">Last updated: August 3, 2026</p>

        {/* Highlight Banner */}
        <div className="privacy-highlight">
          <div className="privacy-highlight-icon-wrapper">
            <PrivacyShieldIcon width="28" height="28" />
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "6px" }}>
              Your Privacy Comes First
            </h3>
            <p>
              At <strong>StupidPDF</strong>, your documents are yours—and they stay that way. We designed our service with a <strong>zero-storage philosophy</strong>. Files uploaded to StupidPDF are processed in memory by our application and are <strong>not intentionally written to persistent storage</strong>. Once processing is complete and the response has been sent, your file is removed from the application's memory.
            </p>
            <p style={{ marginTop: "8px" }}>
              We do <strong>not</strong> build a database of user files, require user accounts, or retain copies of your uploaded documents.
            </p>
          </div>
        </div>

        {/* Section 1: What We Process */}
        <section className="privacy-section">
          <h2>What We Process</h2>
          <p style={{ marginBottom: "12px" }}>When you use a StupidPDF tool:</p>
          <ol className="privacy-list privacy-ordered-list">
            <li>Your file is securely uploaded over <strong>HTTPS</strong>.</li>
            <li>The file is held in application memory only for the duration of your request.</li>
            <li>The requested operation (such as merging, compressing, splitting, or converting) is performed.</li>
            <li>The processed file is returned to you as a download.</li>
            <li>After the request is complete, the file is removed from the application's memory.</li>
          </ol>
        </section>

        {/* Section 2: What We Don't Do */}
        <section className="privacy-section">
          <h2>What We Don't Do</h2>
          <p style={{ marginBottom: "12px" }}>We believe privacy should be the default. We do <strong>not</strong>:</p>
          <ul className="privacy-list">
            <li>Store uploaded or processed files in a database.</li>
            <li>Intentionally save uploaded documents to persistent storage.</li>
            <li>Require you to create an account.</li>
            <li>Collect names, passwords, or user profiles.</li>
            <li>Access, inspect, or analyze your documents except as necessary to perform the requested operation.</li>
            <li>Share your uploaded documents with third parties.</li>
            <li>Sell your personal information or document data.</li>
          </ul>
        </section>

        {/* Section 3: What We Collect */}
        <section className="privacy-section">
          <h2>What We Collect</h2>
          <p style={{ marginBottom: "12px" }}>
            To keep StupidPDF reliable and improve the service, we may collect limited technical information, including:
          </p>
          <ul className="privacy-list">
            <li>Anonymous or privacy-respecting website analytics (such as page views and general traffic patterns).</li>
            <li>Standard server logs, including timestamps, request metadata, and error information used for debugging, security, and abuse prevention.</li>
          </ul>
          <p style={{ marginTop: "12px", fontStyle: "italic", color: "var(--accent-primary)" }}>
            These logs <strong>do not include the contents of your uploaded files</strong>.
          </p>
        </section>

        {/* Section 4: Security */}
        <section className="privacy-section">
          <h2>Security</h2>
          <p>
            We take reasonable technical and organizational measures to help protect your information while it is being processed. All file transfers between your device and our servers are encrypted using <strong>HTTPS</strong>.
          </p>
          <p style={{ marginTop: "10px" }}>
            While no internet service can guarantee absolute security, we continuously work to protect the confidentiality and integrity of your data.
          </p>
        </section>

        {/* Section 5: Cookies */}
        <section className="privacy-section">
          <h2>Cookies</h2>
          <p>
            StupidPDF does not use cookies to track the contents of your uploaded documents.
          </p>
          <p style={{ marginTop: "10px" }}>
            If analytics services are used, they may use cookies or similar technologies to measure general website usage. These technologies are used only to improve the service and do not provide access to your uploaded files.
          </p>
        </section>

        {/* Section 6: Third-Party Hosting */}
        <section className="privacy-section">
          <h2>Third-Party Hosting</h2>
          <p>
            StupidPDF is hosted using trusted third-party infrastructure providers. Like most online services, these providers may process standard connection metadata (such as IP addresses and network information) as part of delivering the service. This processing is governed by their respective privacy policies.
          </p>
        </section>

        {/* Section 7: Children's Privacy */}
        <section className="privacy-section">
          <h2>Children's Privacy</h2>
          <p>
            StupidPDF is not intended for children under the age of 13, and we do not knowingly collect personal information from children. If you believe a child has provided personal information through our service, please contact us so we can take appropriate action.
          </p>
        </section>

        {/* Section 8: Changes to This Privacy Policy */}
        <section className="privacy-section">
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect improvements to the service or changes in legal requirements. Whenever changes are made, the <strong>"Last updated"</strong> date at the top of this page will be revised.
          </p>
        </section>

        {/* Section 9: Contact */}
        <section className="privacy-section">
          <h2>Contact</h2>
          <p style={{ marginBottom: "12px" }}>
            If you have any questions, suggestions, or concerns about this Privacy Policy, please reach out:
          </p>
          <ul className="privacy-list">
            <li>
              <strong>GitHub:</strong>{" "}
              <a
                href="https://github.com/Amankhan55/stupid-pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent-primary)", textDecoration: "underline" }}
              >
                https://github.com/Amankhan55/stupid-pdf
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
