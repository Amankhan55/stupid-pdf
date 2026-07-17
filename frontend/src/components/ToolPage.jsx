import { useState } from "react";
import FileUpload from "./FileUpload";
import {
  mergePdfs,
  splitPdf,
  compressPdf,
  extractPages,
  deletePages,
  rearrangePages,
  rotatePages,
  duplicatePages,
  reversePdf,
  insertBlankPages,
  addPdfToExisting,
  pdfToImages,
  imagesToPdf,
  wordToPdf,
  pdfToWord,
  unlockPdf,
} from "../api/pdf";
import {
  MergeIcon,
  SplitIcon,
  CompressIcon,
  ExtractIcon,
  DeleteIcon,
  RearrangeIcon,
  RotateIcon,
  DuplicateIcon,
  ReverseIcon,
  InsertBlankIcon,
  AddPdfIcon,
  PdfToImageIcon,
  ImageToPdfIcon,
  WordToPdfIcon,
  PdfToWordIcon,
  UnlockIcon,
} from "./Icons";

// ─── Drag-to-Rearrange list ────────────────────────────────────────────────────
function DragList({ pages, setPages }) {
  const [dragIdx, setDragIdx] = useState(null);

  function onDragStart(idx) { setDragIdx(idx); }

  function onDragOver(e, idx) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const updated = [...pages];
    const [removed] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, removed);
    setDragIdx(idx);
    setPages(updated);
  }

  function onDragEnd() { setDragIdx(null); }

  return (
    <div className="drag-list">
      {pages.map((p, idx) => (
        <div
          key={idx}
          className={`drag-item${dragIdx === idx ? " dragging" : ""}`}
          draggable
          onDragStart={() => onDragStart(idx)}
          onDragOver={(e) => onDragOver(e, idx)}
          onDragEnd={onDragEnd}
        >
          <span className="drag-handle">⠿</span>
          <span className="page-num">{idx + 1}</span>
          <span className="page-label">→ Original page {p}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Status Bar ────────────────────────────────────────────────────────────────
function StatusBar({ status, message }) {
  if (!status) return null;
  
  // Custom SVG status icons matching the Cyberpunk theme
  const renderIcon = () => {
    if (status === "loading") return <span className="spinner" />;
    if (status === "success") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  };

  return (
    <div className={`status-bar ${status}`}>
      {renderIcon()}
      <span>{message}</span>
    </div>
  );
}

// ─── Tool Configs ──────────────────────────────────────────────────────────────
const TOOL_META = {
  "merge": {
    icon: MergeIcon,
    title: "Merge PDFs",
    desc: "Combine multiple PDF files into a single document in the order you upload them.",
    tag: "Combine",
  },
  "split": {
    icon: SplitIcon,
    title: "Split PDF",
    desc: "Split a PDF into separate parts at the page numbers you specify.",
    tag: "Divide",
  },
  "compress": {
    icon: CompressIcon,
    title: "Compress PDF",
    desc: "Reduce the file size of your PDF by removing redundant data and compressing streams.",
    tag: "Optimize",
  },
  "extract-pages": {
    icon: ExtractIcon,
    title: "Extract Pages",
    desc: "Pull out specific pages from your PDF and save them as a new document.",
    tag: "Select",
  },
  "delete-pages": {
    icon: DeleteIcon,
    title: "Delete Pages",
    desc: "Remove specific pages from your PDF permanently.",
    tag: "Remove",
  },
  "rearrange-pages": {
    icon: RearrangeIcon,
    title: "Rearrange Pages",
    desc: "Drag pages to reorder them exactly how you want.",
    tag: "Reorder",
  },
  "rotate-pages": {
    icon: RotateIcon,
    title: "Rotate Pages",
    desc: "Rotate specific pages (or all pages) by 90°, 180°, or 270°.",
    tag: "Transform",
  },
  "duplicate-pages": {
    icon: DuplicateIcon,
    title: "Duplicate Pages",
    desc: "Duplicate specific pages, inserting copies immediately after the original.",
    tag: "Copy",
  },
  "reverse": {
    icon: ReverseIcon,
    title: "Reverse Page Order",
    desc: "Flip the entire page order of your PDF — last page becomes first.",
    tag: "Flip",
  },
  "insert-blank": {
    icon: InsertBlankIcon,
    title: "Insert Blank Pages",
    desc: "Insert empty pages at specified positions in your PDF.",
    tag: "Insert",
  },
  "add-pdf": {
    icon: AddPdfIcon,
    title: "Add PDF to Existing",
    desc: "Insert an entire PDF into another at any page position.",
    tag: "Merge at Position",
  },
  "pdf-to-images": {
    icon: PdfToImageIcon,
    title: "PDF to Images",
    desc: "Convert PDF pages into PNG or JPG images packed into a ZIP.",
    tag: "Convert",
  },
  "images-to-pdf": {
    icon: ImageToPdfIcon,
    title: "Images to PDF",
    desc: "Convert a list of images into a single combined PDF document.",
    tag: "Convert",
  },
  "word-to-pdf": {
    icon: WordToPdfIcon,
    title: "Word to PDF",
    desc: "Convert Microsoft Word .docx documents into PDF format.",
    tag: "Convert",
  },
  "pdf-to-word": {
    icon: PdfToWordIcon,
    title: "PDF to Word",
    desc: "Convert PDF documents back into editable Word .docx files.",
    tag: "Convert",
  },
  "unlock-pdf": {
    icon: UnlockIcon,
    title: "Unlock PDF",
    desc: "Remove password protection from a locked PDF. Enter the correct password to unlock and download an unprotected copy.",
    tag: "Security",
  },
};

// ─── Main ToolPage Component ───────────────────────────────────────────────────
export default function ToolPage({ toolId }) {
  const [files, setFiles] = useState([]);
  const [files2, setFiles2] = useState([]); // second file for add-pdf
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  // Form inputs
  const [splitAt, setSplitAt] = useState("");
  const [pages, setPages] = useState("");
  const [angle, setAngle] = useState("90");
  const [times, setTimes] = useState("1");
  const [positions, setPositions] = useState("");
  const [addPosition, setAddPosition] = useState("1");
  const [rearrangeOrder, setRearrangeOrder] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [compressLevel, setCompressLevel] = useState("medium");
  const [compressSavings, setCompressSavings] = useState(null); // { original, compressed }
  const [outputFilename, setOutputFilename] = useState("");
  const [imageFormat, setImageFormat] = useState("png"); // for pdf-to-images
  const [pdfPassword, setPdfPassword] = useState(""); // for unlock-pdf

  const meta = TOOL_META[toolId] || {};

  function resetState() {
    setFiles([]);
    setFiles2([]);
    setStatus(null);
    setMessage("");
    setSplitAt("");
    setPages("");
    setAngle("90");
    setTimes("1");
    setPositions("");
    setAddPosition("1");
    setRearrangeOrder([]);
    setTotalPages(0);
    setCompressLevel("medium");
    setCompressSavings(null);
    setOutputFilename("");
    setImageFormat("png");
    setPdfPassword("");
  }

  // When files change on rearrange tool, initialise the order
  function handleRearrangeFiles(newFiles) {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      // We'll get page count from file info via FileUpload's internal state;
      // as a fallback we won't know until user provides count. 
      // Reset the order — will be re-built once page count is known.
      setRearrangeOrder([]);
      setTotalPages(0);
    }
  }

  function buildRearrangeOrder(count) {
    setTotalPages(count);
    setRearrangeOrder(Array.from({ length: count }, (_, i) => i + 1));
  }

  async function handleSubmit() {
    if (files.length === 0) {
      setStatus("error");
      setMessage("Please upload a PDF file first.");
      return;
    }

    setStatus("loading");
    setMessage("Processing your PDF…");

    try {
      switch (toolId) {
        case "merge":
          if (files.length < 2) throw new Error("Please upload at least 2 PDF files.");
          await mergePdfs(files, outputFilename);
          break;
        case "split":
          if (!splitAt.trim()) throw new Error("Please enter page numbers to split at.");
          await splitPdf(files[0], splitAt.trim(), outputFilename);
          break;
        case "compress": {
          const savings = await compressPdf(files[0], compressLevel, outputFilename);
          setCompressSavings(savings);
          break;
        }
        case "extract-pages":
          if (!pages.trim()) throw new Error("Please enter page numbers to extract.");
          await extractPages(files[0], pages.trim(), outputFilename);
          break;
        case "delete-pages":
          if (!pages.trim()) throw new Error("Please enter page numbers to delete.");
          await deletePages(files[0], pages.trim(), outputFilename);
          break;
        case "rearrange-pages":
          if (rearrangeOrder.length === 0) throw new Error("Please upload a PDF and set page order.");
          await rearrangePages(files[0], rearrangeOrder.join(","), outputFilename);
          break;
        case "rotate-pages":
          await rotatePages(files[0], pages.trim(), parseInt(angle), outputFilename);
          break;
        case "duplicate-pages":
          await duplicatePages(files[0], pages.trim(), parseInt(times), outputFilename);
          break;
        case "reverse":
          await reversePdf(files[0], outputFilename);
          break;
        case "insert-blank":
          if (!positions.trim()) throw new Error("Please enter page positions for blank pages.");
          await insertBlankPages(files[0], positions.trim(), outputFilename);
          break;
        case "add-pdf":
          if (files2.length === 0) throw new Error("Please upload the PDF to insert.");
          await addPdfToExisting(files[0], files2[0], parseInt(addPosition), outputFilename);
          break;
        case "pdf-to-images":
          await pdfToImages(files[0], imageFormat, outputFilename);
          break;
        case "images-to-pdf":
          if (files.length === 0) throw new Error("Please upload at least one image file.");
          await imagesToPdf(files, outputFilename);
          break;
        case "word-to-pdf":
          await wordToPdf(files[0], outputFilename);
          break;
        case "pdf-to-word":
          await pdfToWord(files[0], outputFilename);
          break;
        case "unlock-pdf":
          await unlockPdf(files[0], pdfPassword, outputFilename);
          break;
        default:
          throw new Error("Unknown tool.");
      }
      setStatus("success");
      setMessage("Done! Your PDF has been downloaded.");
    } catch (err) {
      setStatus("error");
      setMessage(err?.response?.data?.detail || err.message || "Something went wrong.");
    }
  }

  const canSubmit = files.length > 0 && status !== "loading";

  // ─── Render extra controls per tool ───
  function renderControls() {
    switch (toolId) {
      case "compress":
        return (
          <div>
            <div className="form-group">
              <label>Compression Level</label>
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                {[
                  { id: "low",    label: "Low Quality",    statusColor: "#10b981", desc: "Safest — removes unused objects" },
                  { id: "medium", label: "Medium Quality", statusColor: "#fbbf24", desc: "Balanced — removes duplicates & orphans" },
                  { id: "high",   label: "High Quality",   statusColor: "#f43f5e", desc: "Maximum — also compresses content streams" },
                ].map(({ id, label, statusColor, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCompressLevel(id)}
                    style={{
                      flex: 1,
                      padding: "12px 10px",
                      borderRadius: "var(--radius-sm)",
                      border: compressLevel === id
                        ? "2px solid var(--accent-start)"
                        : "1px solid var(--border)",
                      background: compressLevel === id
                        ? "linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(79, 172, 254, 0.1))"
                        : "var(--bg-input)",
                      color: compressLevel === id ? "var(--text-primary)" : "var(--text-secondary)",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all var(--transition)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 700, fontSize: "0.85rem" }}>
                      <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: statusColor }} />
                      {label}
                    </div>
                    <div style={{ fontSize: "0.7rem", marginTop: "4px", opacity: 0.75 }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>
            {compressSavings && compressSavings.originalSize > 0 && (
              <div className="info-panel" style={{ marginTop: "16px" }}>
                <div className="info-stat">
                  <div className="stat-value">
                    {(compressSavings.originalSize / 1024).toFixed(0)} KB
                  </div>
                  <div className="stat-label">Original Size</div>
                </div>
                <div className="info-stat">
                  <div className="stat-value">
                    {(compressSavings.compressedSize / 1024).toFixed(0)} KB
                  </div>
                  <div className="stat-label">Compressed Size</div>
                </div>
                <div className="info-stat">
                  <div className="stat-value" style={{
                    background: "linear-gradient(135deg, #10b981, #34d399)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    {compressSavings.originalSize > 0
                      ? Math.max(0, Math.round(
                          (1 - compressSavings.compressedSize / compressSavings.originalSize) * 100
                        ))
                      : 0}%
                  </div>
                  <div className="stat-label">Size Reduction</div>
                </div>
              </div>
            )}
          </div>
        );

      case "split":
        return (
          <div className="form-group">
            <label>Split Before Pages</label>
            <input
              className="form-input"
              placeholder="e.g. 3, 6  (split before page 3 and 6)"
              value={splitAt}
              onChange={(e) => setSplitAt(e.target.value)}
            />
            <span className="form-hint">
              Comma-separated page numbers. E.g. "3,6" on a 9-page PDF creates parts: 1-2, 3-5, 6-9.
            </span>
          </div>
        );

      case "extract-pages":
      case "delete-pages":
        return (
          <div className="form-group">
            <label>Page Numbers</label>
            <input
              className="form-input"
              placeholder="e.g. 1, 3, 5"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
            />
            <span className="form-hint">Comma-separated page numbers (1-indexed).</span>
          </div>
        );

      case "rearrange-pages":
        return (
          <div className="form-group">
            <label>Total Page Count</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                className="form-input"
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={totalPages || ""}
                onChange={(e) => {
                  const n = parseInt(e.target.value);
                  if (n > 0) buildRearrangeOrder(n);
                }}
                style={{ flex: 1 }}
              />
            </div>
            <span className="form-hint">Enter the total number of pages, then drag to reorder.</span>
            {rearrangeOrder.length > 0 && (
              <DragList pages={rearrangeOrder} setPages={setRearrangeOrder} />
            )}
          </div>
        );

      case "rotate-pages":
        return (
          <>
            <div className="form-group">
              <label>Pages to Rotate</label>
              <input
                className="form-input"
                placeholder="e.g. 1, 3 — leave blank to rotate all"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              />
              <span className="form-hint">Leave blank to rotate all pages.</span>
            </div>
            <div className="form-group">
              <label>Rotation Angle</label>
              <select
                className="form-input"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
              >
                <option value="90">90° Clockwise</option>
                <option value="180">180° (Flip)</option>
                <option value="270">270° (90° Counter-clockwise)</option>
              </select>
            </div>
          </>
        );

      case "duplicate-pages":
        return (
          <>
            <div className="form-group">
              <label>Pages to Duplicate</label>
              <input
                className="form-input"
                placeholder="e.g. 2, 4 — leave blank for all"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
              />
              <span className="form-hint">Leave blank to duplicate all pages.</span>
            </div>
            <div className="form-group">
              <label>Number of Copies</label>
              <input
                className="form-input"
                type="number"
                min="1"
                max="10"
                value={times}
                onChange={(e) => setTimes(e.target.value)}
              />
              <span className="form-hint">How many additional copies to insert after each page.</span>
            </div>
          </>
        );

      case "insert-blank":
        return (
          <div className="form-group">
            <label>Insert Before Positions</label>
            <input
              className="form-input"
              placeholder="e.g. 1, 4 — use page_count+1 to append"
              value={positions}
              onChange={(e) => setPositions(e.target.value)}
            />
            <span className="form-hint">
              Comma-separated page numbers. Use the total page count + 1 to append at the end.
            </span>
          </div>
        );

      case "add-pdf":
        return (
          <>
            <div className="form-group">
              <label>PDF to Insert</label>
              <FileUpload
                multiple={false}
                files={files2}
                setFiles={setFiles2}
                label="Drop the PDF to insert here"
                showInfo={false}
              />
            </div>
            <div className="form-group">
              <label>Insert at Page Position</label>
              <input
                className="form-input"
                type="number"
                min="1"
                value={addPosition}
                onChange={(e) => setAddPosition(e.target.value)}
              />
              <span className="form-hint">
                1 = insert at beginning. Use base PDF page count + 1 to append at end.
              </span>
            </div>
          </>
        );

      case "pdf-to-images":
        return (
          <div className="form-group">
            <label>Output Image Format</label>
            <select
              className="form-input"
              value={imageFormat}
              onChange={(e) => setImageFormat(e.target.value)}
            >
              <option value="png">PNG (Portable Network Graphics)</option>
              <option value="jpg">JPG (Joint Photographic Experts Group)</option>
            </select>
          </div>
        );

      case "unlock-pdf":
        return (
          <div className="form-group">
            <label>PDF Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter the PDF password (leave blank if only owner-locked)"
              value={pdfPassword}
              onChange={(e) => setPdfPassword(e.target.value)}
            />
            <span className="form-hint">
              Enter the password used to lock this PDF. Leave blank to attempt removing owner-only restrictions.
            </span>
          </div>
        );

      default:
        return null;
    }
  }

  const Icon = meta.icon;

  return (
    <div key={toolId}>
      <div className="page-header">
        <div className="tag" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          {Icon && <Icon width="12" height="12" />} <span>{meta.tag}</span>
        </div>
        <h2>{meta.title}</h2>
        <p>{meta.desc}</p>
      </div>

      <div className="card">
        <FileUpload
          multiple={toolId === "merge" || toolId === "images-to-pdf"}
          files={files}
          setFiles={toolId === "rearrange-pages" ? handleRearrangeFiles : setFiles}
          label={
            toolId === "merge"
              ? "Drop multiple PDFs here (they'll be merged in order)"
              : toolId === "images-to-pdf"
              ? "Drop one or more images here (PNG/JPG)"
              : toolId === "word-to-pdf"
              ? "Drop your Word document (.docx) here"
              : toolId === "add-pdf"
              ? "Drop the base PDF here"
              : "Drop your PDF here"
          }
          showInfo={toolId !== "word-to-pdf" && toolId !== "images-to-pdf"}
          accept={
            toolId === "images-to-pdf"
              ? "image/*"
              : toolId === "word-to-pdf"
              ? ".docx"
              : "application/pdf"
          }
        />

        {renderControls()}

        {/* ── Output Filename ── */}
        <div className="form-group" style={{ marginTop: "24px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-start)" }}>
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>Output Filename</span>
            <span style={{
              background: "rgba(0, 242, 254, 0.12)",
              border: "1px solid rgba(0, 242, 254, 0.25)",
              color: "#a5f3fc",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "2px 7px",
              borderRadius: "99px",
            }}>Optional</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="form-input"
              placeholder={toolId === "split" && splitAt.includes(",") ? "e.g. my-split  (saves as my-split.zip)" : "e.g. my-document  (saves as my-document.pdf)"}
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              style={{ paddingRight: "80px" }}
            />
            {outputFilename.trim() && (
              <span style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                fontWeight: 600,
                pointerEvents: "none",
              }}>
                {toolId === "split" && splitAt.includes(",") ? ".zip" : ".pdf"}
              </span>
            )}
          </div>
          <span className="form-hint">Leave blank to use the default filename. The .pdf extension is added automatically.</span>
        </div>

        <StatusBar status={status} message={message} />

        <div className="action-bar">
          <span className="info-text">
            {files.length > 0 ? (
              <>
                <strong>{files.length}</strong> file{files.length !== 1 ? "s" : ""} ready
              </>
            ) : (
              "No files selected"
            )}
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-secondary" onClick={resetState}>
              Reset
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {status === "loading" ? (
                <><span className="spinner" /> Processing…</>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {Icon && <Icon width="16" height="16" />}
                  <span>{meta.title}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
