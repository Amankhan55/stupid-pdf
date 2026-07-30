import { useRef, useState } from "react";
import { getPdfInfo } from "../api/pdf";
import { UploadCloudIcon, FileIcon } from "./Icons";
import { validateFiles } from "../utils/fileValidation";
import { formatBytes } from "../utils/format";

export default function FileUpload({
  multiple = false,
  files,
  setFiles,
  label = "Drop your PDF here",
  showInfo = true,
  accept = "application/pdf",
  restriction = null,
  onPageInfo = null,   // optional callback: (name, info) => void
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  async function processFiles(incomingFiles) {
    setErrorMsg(null);
    const rawArray = Array.from(incomingFiles || []);
    if (!rawArray.length) return;

    if (restriction) {
      const check = validateFiles(rawArray, restriction);
      if (!check.valid) { setErrorMsg(check.error); return; }
    }

    const toAdd = multiple ? rawArray : [rawArray[0]];
    const combined = multiple ? [...files, ...toAdd] : toAdd;

    if (restriction?.maxFiles && combined.length > restriction.maxFiles) {
      setErrorMsg(`Too many files! Maximum ${restriction.maxFiles} files allowed.`);
      return;
    }

    setFiles(combined);

    if (showInfo && (accept.includes("pdf") || restriction?.extensions?.includes("pdf"))) {
      for (const f of toAdd) {
        try {
          const info = await getPdfInfo(f);
          setPageInfo((prev) => ({ ...prev, [f.name]: info }));
          onPageInfo?.(f.name, info);
        } catch {
          // silently ignore if backend not running or non-pdf
        }
      }
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  }

  function handleDragOver(e) { e.preventDefault(); setDragOver(true); }
  function handleDragLeave() { setDragOver(false); }
  function handleChange(e) { processFiles(e.target.files); e.target.value = ""; }

  function removeFile(idx) {
    setErrorMsg(null);
    setFiles(files.filter((_, i) => i !== idx));
  }

  // Derive badge labels from restriction or accept type
  const formatBadge = restriction?.label
    ? restriction.label.split("/")[0].toUpperCase()
    : accept.includes("pdf") ? "PDF" : accept.includes("image") ? "Images" : ".DOCX";

  const sizeBadge = restriction?.maxSizeMB
    ? `Max ${restriction.maxSizeMB} MB`
    : "Max 200 MB";

  const countBadge = restriction?.maxFiles && restriction.maxFiles > 1
    ? `Up to ${restriction.maxFiles} files`
    : null;

  return (
    <div>
      <div
        className={`upload-zone${dragOver ? " drag-over" : ""}${errorMsg ? " upload-zone-error" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={`${label}. Click or press Enter to browse files.`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <span className="upload-icon-animated">
            <UploadCloudIcon
              style={{ color: errorMsg ? "var(--accent-danger, #f43f5e)" : "var(--accent-start)" }}
              aria-hidden="true"
            />
          </span>
        </div>
        <h3>{label}</h3>
        <p>
          Drag &amp; drop {multiple ? "files" : "a file"} here, or{" "}
          <span>browse</span> to choose
        </p>

        {/* Badge pills instead of plain text */}
        <div className="upload-meta-badges">
          <span className="upload-meta-badge">{formatBadge}</span>
          <span className="upload-meta-badge">{sizeBadge}</span>
          {countBadge && <span className="upload-meta-badge">{countBadge}</span>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={handleChange}
          aria-hidden="true"
        />
      </div>

      {/* ── Validation Error Banner ── */}
      {errorMsg && (
        <div className="upload-error-pill" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="upload-error-dismiss" aria-label="Dismiss error">×</button>
        </div>
      )}

      {files.length > 0 && (
        <div className="file-list" role="list" aria-label="Uploaded files">
          {files.map((file, idx) => {
            const info = pageInfo[file.name];
            return (
              <div key={idx} className="file-item" role="listitem">
                <span className="file-icon" style={{ display: "flex", color: "var(--accent-start)" }} aria-hidden="true">
                  <FileIcon width="18" height="18" />
                </span>
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">
                    {formatBytes(file.size)}
                    {info && ` · ${info.page_count} page${info.page_count !== 1 ? "s" : ""}`}
                  </div>
                </div>
                {info && (
                  <span className="file-badge" aria-label={`${info.page_count} pages`}>{info.page_count}p</span>
                )}
                <button
                  type="button"
                  className="remove-btn"
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  title="Remove"
                  aria-label={`Remove ${file.name}`}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
