import { useRef, useState } from "react";
import { getPdfInfo } from "../api/pdf";
import { UploadCloudIcon, FileIcon } from "./Icons";
import { validateFiles } from "../utils/fileValidation";

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function FileUpload({
  multiple = false,
  files,
  setFiles,
  label = "Drop your PDF here",
  showInfo = true,
  accept = "application/pdf",
  restriction = null,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  async function processFiles(incomingFiles) {
    setErrorMsg(null);
    const rawArray = Array.from(incomingFiles || []);
    if (!rawArray.length) return;

    // Perform strict validation if restriction prop is provided
    if (restriction) {
      const check = validateFiles(rawArray, restriction);
      if (!check.valid) {
        setErrorMsg(check.error);
        return;
      }
    }

    const toAdd = multiple ? rawArray : [rawArray[0]];
    const combined = multiple ? [...files, ...toAdd] : toAdd;

    // Validate combined array length if maxFiles specified
    if (restriction && restriction.maxFiles && combined.length > restriction.maxFiles) {
      setErrorMsg(`Too many files! Maximum ${restriction.maxFiles} files allowed.`);
      return;
    }

    setFiles(combined);

    if (showInfo && (accept.includes("pdf") || restriction?.extensions?.includes("pdf"))) {
      for (const f of toAdd) {
        try {
          const info = await getPdfInfo(f);
          setPageInfo((prev) => ({ ...prev, [f.name]: info }));
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

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleChange(e) {
    processFiles(e.target.files);
    e.target.value = "";
  }

  function removeFile(idx) {
    setErrorMsg(null);
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
  }

  return (
    <div>
      <div
        className={`upload-zone${dragOver ? " drag-over" : ""}${errorMsg ? " upload-zone-error" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <UploadCloudIcon style={{ color: errorMsg ? "var(--accent-danger, #f43f5e)" : "var(--accent-start)" }} />
        </div>
        <h3>{label}</h3>
        <p>
          Drag &amp; drop {multiple ? "files" : "a file"} here, or{" "}
          <span>browse</span> to choose
        </p>

        {restriction ? (
          <p className="upload-limit-text">
            Allowed: <strong>{restriction.label || accept}</strong>
            {restriction.maxSizeMB && <> · Max size: <strong>{restriction.maxSizeMB} MB</strong></>}
            {restriction.maxFiles && restriction.maxFiles > 1 && <> · Max files: <strong>{restriction.maxFiles}</strong></>}
          </p>
        ) : (
          <p style={{ marginTop: "6px" }}>
            {accept === "application/pdf"
              ? "PDF files only"
              : accept === "image/*"
              ? "Image files only (PNG/JPG)"
              : "Word documents only (.docx)"}
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </div>

      {/* ── Validation Error Banner ── */}
      {errorMsg && (
        <div className="upload-error-pill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="upload-error-dismiss">×</button>
        </div>
      )}

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, idx) => {
            const info = pageInfo[file.name];
            return (
              <div key={idx} className="file-item">
                <span className="file-icon" style={{ display: "flex", color: "var(--accent-start)" }}>
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
                  <span className="file-badge">{info.page_count}p</span>
                )}
                <button
                  type="button"
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  title="Remove"
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
