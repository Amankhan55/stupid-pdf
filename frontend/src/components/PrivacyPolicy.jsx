export default function PrivacyPolicy({ onBack }) {
  return (
    <main style={{ flex: 1 }}>
      <div className="max-width-wrapper privacy-policy-page">
        <button className="privacy-back-btn" onClick={onBack}>
          ← Back to StupidPDF
        </button>

        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-updated">Last updated: August 3, 2026</p>

        <div className="privacy-highlight">
          <span className="privacy-highlight-icon" aria-hidden="true">🔒</span>
          <p>
            <strong>We don't store your files.</strong> Every document you upload is
            processed entirely in memory and discarded the moment your download
            completes — nothing is written to disk, and no copy of your file
            persists on our servers after the response is sent.
          </p>
        </div>

        <section className="privacy-section">
          <h2>What we process</h2>
          <p>
            When you use a tool on StupidPDF, the file you upload is sent directly
            to our backend over HTTPS, held in memory only for the duration of the
            request, transformed according to the tool you selected (merge, compress,
            convert, etc.), and streamed back to you as a download. Once the response
            finishes, the file and its contents are gone.
          </p>
        </section>

        <section className="privacy-section">
          <h2>What we don't do</h2>
          <ul className="privacy-list">
            <li>We don't save uploaded or converted files to disk or a database.</li>
            <li>We don't require an account, so we don't store names, emails, or profiles tied to your files.</li>
            <li>We don't read, scan, or share the contents of your documents with any third party.</li>
            <li>We don't sell user data — there isn't any file data to sell.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>What we do collect</h2>
          <p>
            We use privacy-respecting web analytics (page views, general traffic
            patterns) to understand how the site is used, and standard server
            logs (timestamps, error messages, and general request metadata) for
            debugging and abuse prevention. These logs never include the contents
            of your files.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Third-party hosting</h2>
          <p>
            The app is hosted using third-party infrastructure providers for the
            frontend and backend. These providers may process standard connection
            metadata (such as IP address) as part of delivering the service, in
            line with their own privacy policies.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Contact</h2>
          <p>
            Questions about this policy? Reach out via the project's GitHub
            repository.
          </p>
        </section>
      </div>
    </main>
  );
}
