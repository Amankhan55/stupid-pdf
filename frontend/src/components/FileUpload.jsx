import { useRef, useState } from "react";
import { getPdfInfo } from "../api/pdf";

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
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [pageInfo, setPageInfo] = useState({});

  async function processFiles(newFiles) {
    const accepted = Array.from(newFiles).filter(
      (f) => f.type === "application/pdf"
    );
    if (!accepted.length) return;

    const toAdd = multiple ? accepted : [accepted[0]];
    const combined = multiple ? [...files, ...toAdd] : toAdd;
    setFiles(combined);

    if (showInfo) {
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
  }

  return (
    <div>
      <div
        className={`upload-zone${dragOver ? " drag-over" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <span className="upload-icon">📄</span>
        <h3>{label}</h3>
        <p>
          Drag & drop {multiple ? "files" : "a file"} here, or{" "}
          <span>browse</span> to choose
        </p>
        <p style={{ marginTop: "6px" }}>PDF files only</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple={multiple}
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, idx) => {
            const info = pageInfo[file.name];
            return (
              <div key={idx} className="file-item">
                <span className="file-icon">📑</span>
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
                  className="remove-btn"
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
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
