import { useRef, useState } from "react";
import { getPdfInfo } from "../api/pdf";

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const FileDocIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default function FileUpload({
  multiple = false,
  files,
  setFiles,
  label = "Drop your PDF here",
  showInfo = true,
  accept = "application/pdf",
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [pageInfo, setPageInfo] = useState({});

  async function processFiles(newFiles) {
    const accepted = Array.from(newFiles).filter((f) => {
      if (accept === "application/pdf") return f.type === "application/pdf";
      if (accept === "image/*") return f.type.startsWith("image/");
      if (accept === ".docx") return f.name.endsWith(".docx");
      return true;
    });
    if (!accepted.length) return;

    const toAdd = multiple ? accepted : [accepted[0]];
    const combined = multiple ? [...files, ...toAdd] : toAdd;
    setFiles(combined);

    if (showInfo && accept === "application/pdf") {
      for (const f of toAdd) {
        try {
          const info = await getPdfInfo(f);
          setPageInfo((prev) => ({ ...prev, [f.name]: info }));
        } catch {
          // silently ignore if backend not running
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

  function handleDragLeave() { setDragOver(false); }

  function handleChange(e) { processFiles(e.target.files); }

  function removeFile(idx) {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    // remove cached info
    const f = files[idx];
    if (f) {
      setPageInfo((prev) => {
        const next = { ...prev };
        delete next[f.name];
        return next;
      });
    }
  }

  const acceptLabel =
    accept === "application/pdf" ? "PDF files only"
    : accept === "image/*" ? "PNG, JPG, WEBP images"
    : "Word documents (.docx)";

  return (
    <div>
      {/* Drop zone */}
      <div
        className={`upload-zone${dragOver ? " dragging" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={label}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <div className="upload-zone-icon">
          <UploadIcon />
        </div>
        <div className="upload-zone-title">{label}</div>
        <div className="upload-zone-subtitle">
          Drag & drop {multiple ? "files" : "a file"} here, or{" "}
          <span style={{ color: "var(--mint)", fontWeight: 600 }}>browse</span>
        </div>
        <div className="upload-zone-meta">{acceptLabel}</div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, idx) => {
            const info = pageInfo[file.name];
            return (
              <div key={idx} className="file-item">
                <div className="file-item-icon">
                  <FileDocIcon />
                </div>
                <span className="file-item-name">{file.name}</span>
                <span className="file-item-size">
                  {formatBytes(file.size)}
                  {info && ` · ${info.page_count}p`}
                </span>
                <button
                  className="file-item-remove"
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  title="Remove file"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            );
          })}

          {/* PDF info box for single PDF files */}
          {showInfo && files.length === 1 && pageInfo[files[0]?.name] && (
            <div className="pdf-info-box">
              <div className="pdf-info-stat">
                <div className="pdf-info-value">{pageInfo[files[0].name].page_count}</div>
                <div className="pdf-info-label">Pages</div>
              </div>
              <div className="pdf-info-stat">
                <div className="pdf-info-value">{(pageInfo[files[0].name].width / 72 * 25.4).toFixed(0)}mm</div>
                <div className="pdf-info-label">Width</div>
              </div>
              <div className="pdf-info-stat">
                <div className="pdf-info-value">{(pageInfo[files[0].name].height / 72 * 25.4).toFixed(0)}mm</div>
                <div className="pdf-info-label">Height</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
