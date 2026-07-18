import { useState, useRef, useEffect, useCallback } from "react";
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
  protectPdf,
  addWatermark,
  addPageNumbers,
  extractText,
  extractImages,
  pdfToExcel,
  addSignature,
  annotatePdf,
} from "../api/pdf";
import {
  MergeIcon, SplitIcon, CompressIcon, ExtractIcon, DeleteIcon,
  RearrangeIcon, RotateIcon, DuplicateIcon, ReverseIcon,
  InsertBlankIcon, AddPdfIcon, PdfToImageIcon, ImageToPdfIcon,
  WordToPdfIcon, PdfToWordIcon, UnlockIcon,
  ProtectIcon, WatermarkIcon, PageNumbersIcon,
  ExtractTextIcon, ExtractImagesIcon, ExcelIcon,
  SignatureIcon, AnnotateIcon,
} from "./Icons";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;


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
        <div key={idx} className={`drag-item${dragIdx === idx ? " dragging" : ""}`}
          draggable onDragStart={() => onDragStart(idx)}
          onDragOver={(e) => onDragOver(e, idx)} onDragEnd={onDragEnd}
        >
          <span className="drag-handle">⠿</span>
          <span className="page-num">{idx + 1}</span>
          <span className="page-label">→ Original page {p}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Animated Progress Bar ─────────────────────────────────────────────────────
function ProgressBar({ progress, message }) {
  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-header">
        <span className="progress-bar-message">
          <span className="progress-spinner-dot" />
          {message}
        </span>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        >
          <div className="progress-bar-glow" />
        </div>
      </div>
    </div>
  );
}

// ─── Status Bar ────────────────────────────────────────────────────────────────
function StatusBar({ status, message }) {
  if (!status || status === "loading") return null;
  const renderIcon = () => {
    if (status === "success") return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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

// ─── Signature Canvas ──────────────────────────────────────────────────────────
const SIG_COLORS = [
  { hex: "#14F195", label: "Neon Green" },
  { hex: "#000000", label: "Black" },
  { hex: "#1a1aff", label: "Blue" },
  { hex: "#8B0000", label: "Dark Red" },
  { hex: "#6B21A8", label: "Purple" },
  { hex: "#78716c", label: "Slate" },
];

function SignatureCanvas({ onCapture }) {
  const canvasRef      = useRef(null);
  const drawingRef     = useRef(false);
  const lastPosRef     = useRef(null);
  const hasContentRef  = useRef(false);
  const colorRef       = useRef("#000000");
  const thicknessRef   = useRef(2);

  const [color,     setColor]     = useState("#000000");
  const [thickness, setThickness] = useState(2);

  // Keep refs in sync with state so draw() always reads current values
  useEffect(() => { colorRef.current     = color;     }, [color]);
  useEffect(() => { thicknessRef.current = thickness; }, [thickness]);

  // Size the canvas buffer to CSS display size × DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr  = window.devicePixelRatio || 1;
      canvas.width  = Math.round(rect.width  * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      // Re-apply current dynamic values after every resize
      ctx.strokeStyle = colorRef.current;
      ctx.lineWidth   = thicknessRef.current;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  function getPos(e) {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const src    = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function startDraw(e) {
    e.preventDefault();
    drawingRef.current = true;
    lastPosRef.current = getPos(e);
  }

  function draw(e) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const pos    = getPos(e);
    const last   = lastPosRef.current;

    // Apply latest color + thickness on every segment
    ctx.strokeStyle = colorRef.current;
    ctx.lineWidth   = thicknessRef.current;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x,  pos.y);
    ctx.stroke();

    lastPosRef.current    = pos;
    hasContentRef.current = true;
  }

  function stopDraw() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPosRef.current = null;
    if (hasContentRef.current) {
      canvasRef.current.toBlob(
        (blob) => { if (blob) onCapture(new File([blob], "signature.png", { type: "image/png" })); },
        "image/png"
      );
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    canvas.getContext("2d").clearRect(0, 0, rect.width, rect.height);
    hasContentRef.current = false;
    onCapture(null);
  }

  return (
    <div className="signature-canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="signature-canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      {/* ── Toolbar: color + thickness ── */}
      <div className="sig-toolbar">
        {/* Color swatches */}
        <div className="sig-toolbar-group">
          {SIG_COLORS.map(({ hex, label }) => (
            <button
              key={hex}
              type="button"
              title={label}
              className={`sig-color-swatch${color === hex ? " active" : ""}`}
              style={{ background: hex }}
              onClick={() => setColor(hex)}
            />
          ))}
          {/* Free colour picker */}
          <label className="sig-color-picker-btn" title="Custom colour">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ opacity: 0, position: "absolute", width: 0, height: 0 }}
            />
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/>
              <circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12.5" r="0.5"/>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
            </svg>
          </label>
        </div>

        {/* Thickness slider */}
        <div className="sig-toolbar-group sig-thickness-group">
          <span className="sig-toolbar-label">Thickness</span>
          <input
            type="range"
            className="slider-input sig-thickness-slider"
            min="1"
            max="8"
            step="0.5"
            value={thickness}
            onChange={(e) => setThickness(parseFloat(e.target.value))}
          />
          {/* Live pen preview circle */}
          <span
            className="sig-thickness-dot"
            style={{
              width:  `${Math.max(4, thickness * 2.5)}px`,
              height: `${Math.max(4, thickness * 2.5)}px`,
              background: color,
            }}
          />
        </div>

        <button type="button" className="sig-clear-btn" onClick={clearCanvas}>Clear</button>
      </div>
    </div>
  );
}

// ─── PDF Page Canvas Renderer (using pdfjs-dist) ────────────────────────────────
function PdfPageCanvas({ file, pageNum = 1, onDimensions }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;
    let isCancelled = false;

    async function renderPage() {
      setLoading(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        if (isCancelled) return;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const total = pdf.numPages;
        const targetPage = Math.max(1, Math.min(pageNum, total));
        const page = await pdf.getPage(targetPage);
        if (isCancelled) return;

        const unscaled = page.getViewport({ scale: 1.0 });
        if (onDimensions) {
          onDimensions({ width: unscaled.width, height: unscaled.height, totalPages: total });
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        const parentWidth = parent ? parent.getBoundingClientRect().width : 360;
        const scale = (parentWidth || 360) / unscaled.width;
        const dpr = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: scale * dpr });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (!isCancelled) setLoading(false);
      } catch (err) {
        console.error("PDF render error:", err);
        if (!isCancelled) setLoading(false);
      }
    }

    renderPage();
    return () => { isCancelled = true; };
  }, [file, pageNum]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {loading && (
        <div className="pdf-preview-loading">
          <span className="progress-spinner-dot" /> Rendering page {pageNum}…
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          borderRadius: "4px"
        }}
      />
    </div>
  );
}

// ─── Signature Position Preview ───────────────────────────────────────────────
function SignaturePositionPreview({ pdfFile, pageNum = 1, sigFile, x, y, width, height, onChange }) {
  const wrapRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ dx: 0, dy: 0 });
  const [sigUrl, setSigUrl] = useState(null);
  const [livePos, setLivePos] = useState({ x, y });
  const [pageDims, setPageDims] = useState({ width: 595, height: 842, totalPages: 1 });

  const PDF_W = pageDims.width;
  const PDF_H = pageDims.height;

  useEffect(() => { setLivePos({ x, y }); }, [x, y]);

  useEffect(() => {
    if (!sigFile) { setSigUrl(null); return; }
    const url = URL.createObjectURL(sigFile);
    setSigUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [sigFile]);

  function clientToPdf(e) {
    if (!wrapRef.current) return { x: 0, y: 0 };
    const rect = wrapRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return {
      x: ((src.clientX - rect.left)  / rect.width)  * PDF_W,
      y: ((src.clientY - rect.top)   / rect.height) * PDF_H,
    };
  }

  function clamp(val, max) {
    return Math.round(Math.max(0, Math.min(val, max)));
  }

  function handlePageClick(e) {
    if (isDraggingRef.current) return;
    const pos  = clientToPdf(e);
    const newX = clamp(pos.x - width  / 2, PDF_W - width);
    const newY = clamp(pos.y - height / 2, PDF_H - height);
    setLivePos({ x: newX, y: newY });
    onChange(newX, newY);
  }

  function handleSigMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();
    const pos = clientToPdf(e);
    dragOffsetRef.current = { dx: pos.x - livePos.x, dy: pos.y - livePos.y };
    isDraggingRef.current = true;
  }

  function handleMouseMove(e) {
    if (!isDraggingRef.current) return;
    const pos  = clientToPdf(e);
    const newX = clamp(pos.x - dragOffsetRef.current.dx, PDF_W - width);
    const newY = clamp(pos.y - dragOffsetRef.current.dy, PDF_H - height);
    setLivePos({ x: newX, y: newY });
  }

  function handleMouseUp() {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    onChange(livePos.x, livePos.y);
  }

  const pctX = (livePos.x / PDF_W) * 100;
  const pctY = (livePos.y / PDF_H) * 100;
  const pctW = (width     / PDF_W) * 100;
  const pctH = (height    / PDF_H) * 100;

  return (
    <div className="sig-pos-preview-wrapper">
      <div className="sig-pos-preview-header">
        <span className="sig-pos-preview-label">📄 Click on actual page to place · Drag to reposition</span>
        <span className="sig-coords-live-badge">
          <span className="coords-axis">X</span>{Math.round(livePos.x)}
          <span className="coords-sep">·</span>
          <span className="coords-axis">Y</span>{Math.round(livePos.y)}
        </span>
      </div>

      <div className="sig-page-outer">
        <div
          ref={wrapRef}
          className="sig-page-inner"
          style={{ paddingTop: `${(PDF_H / PDF_W) * 100}%` }}
          onClick={handlePageClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={(e) => { e.preventDefault(); handleMouseMove(e); }}
          onTouchEnd={handleMouseUp}
        >
          <div className="sig-page-content">
            {pdfFile ? (
              <PdfPageCanvas file={pdfFile} pageNum={pageNum} onDimensions={setPageDims} />
            ) : (
              <div className="sig-page-lines">
                <div className="sig-line sig-line-h" style={{ top: '10%' }} />
                <div className="sig-line sig-line-h" style={{ top: '90%' }} />
                <div className="sig-line sig-line-v" style={{ left: '7%' }} />
                <div className="sig-line sig-line-v" style={{ left: '93%' }} />
              </div>
            )}

            <div
              className="sig-drop-box"
              style={{
                left:   `${pctX}%`,
                top:    `${pctY}%`,
                width:  `${pctW}%`,
                height: `${pctH}%`,
              }}
              onMouseDown={handleSigMouseDown}
              onTouchStart={handleSigMouseDown}
            >
              {sigUrl ? (
                <img
                  src={sigUrl}
                  alt="Signature"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', display: 'block' }}
                />
              ) : (
                <div className="sig-drop-placeholder">
                  <span>✍</span>
                </div>
              )}
              <div className="sig-drag-handle" title="Drag to move">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" opacity="0.6">
                  <circle cx="2" cy="2" r="1"/><circle cx="5" cy="2" r="1"/><circle cx="8" cy="2" r="1"/>
                  <circle cx="2" cy="5" r="1"/><circle cx="5" cy="5" r="1"/><circle cx="8" cy="5" r="1"/>
                  <circle cx="2" cy="8" r="1"/><circle cx="5" cy="8" r="1"/><circle cx="8" cy="8" r="1"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Annotate PDF Live Preview Component ─────────────────────────────────────
function AnnotatePositionPreview({
  pdfFile,
  pageNum,
  onPageChange,
  annType,
  annColor,
  annContent,
  annotations,
  onAddAnnotation,
  onRemoveAnnotation
}) {
  const wrapRef = useRef(null);
  const [pageDims, setPageDims] = useState({ width: 595, height: 842, totalPages: 1 });
  const [drawingBox, setDrawingBox] = useState(null);
  const isDrawingRef = useRef(false);

  const PDF_W = pageDims.width;
  const PDF_H = pageDims.height;

  function clientToPdf(e) {
    if (!wrapRef.current) return { x: 0, y: 0 };
    const rect = wrapRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return {
      x: Math.max(0, Math.min(PDF_W, ((src.clientX - rect.left) / rect.width) * PDF_W)),
      y: Math.max(0, Math.min(PDF_H, ((src.clientY - rect.top) / rect.height) * PDF_H)),
    };
  }

  function handleMouseDown(e) {
    if (e.target.closest('.ann-overlay-box') || e.target.closest('.ann-page-nav')) return;
    e.preventDefault();
    const pos = clientToPdf(e);
    isDrawingRef.current = true;
    setDrawingBox({ startX: pos.x, startY: pos.y, currentX: pos.x, currentY: pos.y });
  }

  function handleMouseMove(e) {
    if (!isDrawingRef.current) return;
    const pos = clientToPdf(e);
    setDrawingBox((prev) => prev ? { ...prev, currentX: pos.x, currentY: pos.y } : null);
  }

  function handleMouseUp() {
    if (!isDrawingRef.current || !drawingBox) return;
    isDrawingRef.current = false;

    const x1 = Math.min(drawingBox.startX, drawingBox.currentX);
    const y1 = Math.min(drawingBox.startY, drawingBox.currentY);
    const x2 = Math.max(drawingBox.startX, drawingBox.currentX);
    const y2 = Math.max(drawingBox.startY, drawingBox.currentY);

    setDrawingBox(null);

    // Ignore tiny accidental clicks (<5px)
    if (Math.abs(x2 - x1) < 5 && Math.abs(y2 - y1) < 5) return;

    if (annType === "highlight") {
      onAddAnnotation({
        type: "highlight",
        page: pageNum,
        x: Math.round(x1),
        y: Math.round(y1),
        x2: Math.round(x2),
        y2: Math.round(y2),
        color: annColor,
      });
    } else {
      onAddAnnotation({
        type: "text",
        page: pageNum,
        x: Math.round(x1),
        y: Math.round(y1),
        width: Math.round(Math.max(40, x2 - x1)),
        height: Math.round(Math.max(25, y2 - y1)),
        content: annContent || "Note text",
        color: annColor,
      });
    }
  }

  const currentPageAnns = annotations
    .map((ann, originalIdx) => ({ ...ann, originalIdx }))
    .filter((a) => a.page === pageNum);

  return (
    <div className="ann-preview-wrapper">
      <div className="ann-preview-header">
        <span className="ann-preview-label">
          🖍 Click &amp; drag on PDF page to draw {annType === "highlight" ? "Highlight" : "Text Box"}
        </span>
        <div className="ann-page-nav">
          <button
            type="button"
            className="ann-nav-btn"
            disabled={pageNum <= 1}
            onClick={() => onPageChange(Math.max(1, pageNum - 1))}
          >
            ‹
          </button>
          <span>Page {pageNum} of {pageDims.totalPages}</span>
          <button
            type="button"
            className="ann-nav-btn"
            disabled={pageNum >= pageDims.totalPages}
            onClick={() => onPageChange(Math.min(pageDims.totalPages, pageNum + 1))}
          >
            ›
          </button>
        </div>
      </div>

      <div className="sig-page-outer">
        <div
          ref={wrapRef}
          className="sig-page-inner"
          style={{ paddingTop: `${(PDF_H / PDF_W) * 100}%`, cursor: "crosshair" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <div className="sig-page-content">
            {pdfFile ? (
              <PdfPageCanvas file={pdfFile} pageNum={pageNum} onDimensions={setPageDims} />
            ) : (
              <div className="sig-page-lines">
                <div className="sig-line sig-line-h" style={{ top: '10%' }} />
                <div className="sig-line sig-line-h" style={{ top: '90%' }} />
              </div>
            )}

            {/* Live drawing box rubberband */}
            {drawingBox && (
              <div
                className="ann-rubberband"
                style={{
                  left: `${(Math.min(drawingBox.startX, drawingBox.currentX) / PDF_W) * 100}%`,
                  top: `${(Math.min(drawingBox.startY, drawingBox.currentY) / PDF_H) * 100}%`,
                  width: `${(Math.abs(drawingBox.currentX - drawingBox.startX) / PDF_W) * 100}%`,
                  height: `${(Math.abs(drawingBox.currentY - drawingBox.startY) / PDF_H) * 100}%`,
                  borderColor: annColor,
                  background: annType === "highlight" ? `${annColor}44` : `${annColor}22`,
                }}
              >
                <span className="ann-box-coords">
                  {Math.round(Math.min(drawingBox.startX, drawingBox.currentX))}, {Math.round(Math.min(drawingBox.startY, drawingBox.currentY))}
                </span>
              </div>
            )}

            {/* Existing page annotations overlay */}
            {currentPageAnns.map((ann) => {
              const boxX1 = ann.x;
              const boxY1 = ann.y;
              const boxW = ann.type === "highlight" ? (ann.x2 - ann.x) : ann.width;
              const boxH = ann.type === "highlight" ? (ann.y2 - ann.y) : ann.height;

              return (
                <div
                  key={ann.originalIdx}
                  className={`ann-overlay-box ann-type-${ann.type}`}
                  style={{
                    left: `${(boxX1 / PDF_W) * 100}%`,
                    top: `${(boxY1 / PDF_H) * 100}%`,
                    width: `${(boxW / PDF_W) * 100}%`,
                    height: `${(boxH / PDF_H) * 100}%`,
                    background: ann.type === "highlight" ? `${ann.color}55` : ann.color,
                    borderColor: ann.color,
                  }}
                >
                  {ann.type === "text" && (
                    <span className="ann-box-text">{ann.content || "Note"}</span>
                  )}
                  <button
                    type="button"
                    className="ann-box-del-btn"
                    onClick={(e) => { e.stopPropagation(); onRemoveAnnotation(ann.originalIdx); }}
                    title="Remove annotation"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Tool Configs ──────────────────────────────────────────────────────────────
const TOOL_META = {
  "merge":            { icon: MergeIcon,        title: "Merge PDFs",          desc: "Combine multiple PDF files into a single document in the order you upload them.",                     tag: "Combine" },
  "split":            { icon: SplitIcon,         title: "Split PDF",           desc: "Split a PDF into separate parts at the page numbers you specify.",                                    tag: "Divide" },
  "compress":         { icon: CompressIcon,      title: "Compress PDF",        desc: "Reduce the file size of your PDF by removing redundant data and compressing streams.",                tag: "Optimize" },
  "extract-pages":    { icon: ExtractIcon,       title: "Extract Pages",       desc: "Pull out specific pages from your PDF and save them as a new document.",                             tag: "Select" },
  "delete-pages":     { icon: DeleteIcon,        title: "Delete Pages",        desc: "Remove specific pages from your PDF permanently.",                                                    tag: "Remove" },
  "rearrange-pages":  { icon: RearrangeIcon,     title: "Rearrange Pages",     desc: "Drag pages to reorder them exactly how you want.",                                                   tag: "Reorder" },
  "rotate-pages":     { icon: RotateIcon,        title: "Rotate Pages",        desc: "Rotate specific pages (or all pages) by 90°, 180°, or 270°.",                                       tag: "Transform" },
  "duplicate-pages":  { icon: DuplicateIcon,     title: "Duplicate Pages",     desc: "Duplicate specific pages, inserting copies immediately after the original.",                         tag: "Copy" },
  "reverse":          { icon: ReverseIcon,       title: "Reverse Page Order",  desc: "Flip the entire page order of your PDF — last page becomes first.",                                  tag: "Flip" },
  "insert-blank":     { icon: InsertBlankIcon,   title: "Insert Blank Pages",  desc: "Insert empty pages at specified positions in your PDF.",                                             tag: "Insert" },
  "add-pdf":          { icon: AddPdfIcon,        title: "Add PDF to Existing", desc: "Insert an entire PDF into another at any page position.",                                            tag: "Merge at Position" },
  "pdf-to-images":    { icon: PdfToImageIcon,    title: "PDF to Images",       desc: "Convert PDF pages into PNG or JPG images packed into a ZIP.",                                        tag: "Convert" },
  "images-to-pdf":    { icon: ImageToPdfIcon,    title: "Images to PDF",       desc: "Convert a list of images into a single combined PDF document.",                                      tag: "Convert" },
  "word-to-pdf":      { icon: WordToPdfIcon,     title: "Word to PDF",         desc: "Convert Microsoft Word .docx documents into PDF format.",                                            tag: "Convert" },
  "pdf-to-word":      { icon: PdfToWordIcon,     title: "PDF to Word",         desc: "Convert PDF documents back into editable Word .docx files.",                                        tag: "Convert" },
  "unlock-pdf":       { icon: UnlockIcon,        title: "Unlock PDF",          desc: "Remove password protection from a locked PDF.",                                                      tag: "Security" },
  "protect-pdf":      { icon: ProtectIcon,       title: "Protect PDF",         desc: "Encrypt your PDF with AES-256 password protection to keep it secure.",                              tag: "Security" },
  "add-watermark":    { icon: WatermarkIcon,     title: "Add Watermark",       desc: "Overlay a custom text watermark on every page of your PDF.",                                        tag: "Editing" },
  "add-page-numbers": { icon: PageNumbersIcon,   title: "Add Page Numbers",    desc: "Automatically stamp page numbers at the header or footer of every page.",                           tag: "Editing" },
  "extract-text":     { icon: ExtractTextIcon,   title: "Extract Text",        desc: "Pull all readable text from your PDF and download it as a .txt file.",                              tag: "Utility" },
  "extract-images":   { icon: ExtractImagesIcon, title: "Extract Images",      desc: "Extract all embedded images from your PDF and download them as a ZIP archive.",                     tag: "Utility" },
  "pdf-to-excel":     { icon: ExcelIcon,         title: "PDF to Excel",        desc: "Extract tables from your PDF and convert them to an editable .xlsx spreadsheet.",                   tag: "Convert" },
  "add-signature":    { icon: SignatureIcon,     title: "Add Signature",       desc: "Draw or upload a signature and embed it onto a specific page of your PDF.",                        tag: "Editing" },
  "annotate-pdf":     { icon: AnnotateIcon,      title: "Annotate PDF",        desc: "Add text annotations and highlight color overlays to specific areas of your PDF.",                  tag: "Editing" },
};

// ─── Main ToolPage Component ───────────────────────────────────────────────────
export default function ToolPage({ toolId, initialFile, onSelectTool }) {
  const [files, setFiles] = useState(initialFile ? [initialFile] : []);
  const [files2, setFiles2] = useState([]);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  // Form inputs — existing
  const [splitAt, setSplitAt] = useState("");
  const [pages, setPages] = useState("");
  const [angle, setAngle] = useState("90");
  const [times, setTimes] = useState("1");
  const [positions, setPositions] = useState("");
  const [addPosition, setAddPosition] = useState("1");
  const [rearrangeOrder, setRearrangeOrder] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [compressLevel, setCompressLevel] = useState("medium");
  const [compressSavings, setCompressSavings] = useState(null);
  const [outputFilename, setOutputFilename] = useState("");
  const [imageFormat, setImageFormat] = useState("png");
  const [pdfPassword, setPdfPassword] = useState("");

  // Form inputs — new tools
  const [protectPassword, setProtectPassword] = useState("");
  const [protectConfirm, setProtectConfirm] = useState("");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkAngle, setWatermarkAngle] = useState(45);
  const [watermarkFontSize, setWatermarkFontSize] = useState(48);
  const [watermarkColor, setWatermarkColor] = useState("808080");
  const [pageNumPosition, setPageNumPosition] = useState("bottom-center");
  const [pageNumFontSize, setPageNumFontSize] = useState(10);
  const [pageNumStart, setPageNumStart] = useState(1);
  const [pageNumPrefix, setPageNumPrefix] = useState("Page");
  const [sigFile, setSigFile] = useState(null);
  const [sigMode, setSigMode] = useState("draw"); // "draw" | "upload"
  const [sigPageNum, setSigPageNum] = useState(1);
  const [sigX, setSigX] = useState(100);
  const [sigY, setSigY] = useState(650);
  const [sigWidth, setSigWidth] = useState(200);
  const [sigHeight, setSigHeight] = useState(80);
  const [annotations, setAnnotations] = useState([]);
  const [annType, setAnnType] = useState("highlight");
  const [annPage, setAnnPage] = useState(1);
  const [annX, setAnnX] = useState(50);
  const [annY, setAnnY] = useState(100);
  const [annX2, setAnnX2] = useState(300);
  const [annY2, setAnnY2] = useState(120);
  const [annContent, setAnnContent] = useState("");
  const [annColor, setAnnColor] = useState("#FFFF00");

  const progressTimerRef = useRef(null);
  const meta = TOOL_META[toolId] || {};

  function resetState() {
    setFiles([]); setFiles2([]); setStatus(null); setMessage(""); setProgress(0);
    setSplitAt(""); setPages(""); setAngle("90"); setTimes("1"); setPositions("");
    setAddPosition("1"); setRearrangeOrder([]); setTotalPages(0);
    setCompressLevel("medium"); setCompressSavings(null); setOutputFilename("");
    setImageFormat("png"); setPdfPassword("");
    setProtectPassword(""); setProtectConfirm("");
    setWatermarkText("CONFIDENTIAL"); setWatermarkOpacity(0.3); setWatermarkAngle(45);
    setWatermarkFontSize(48); setWatermarkColor("808080");
    setPageNumPosition("bottom-center"); setPageNumFontSize(10); setPageNumStart(1); setPageNumPrefix("Page");
    setSigFile(null); setSigMode("draw"); setSigPageNum(1);
    setSigX(100); setSigY(650); setSigWidth(200); setSigHeight(80);
    setAnnotations([]); setAnnType("highlight"); setAnnPage(1);
    setAnnX(50); setAnnY(100); setAnnX2(300); setAnnY2(120);
    setAnnContent(""); setAnnColor("#FFFF00");
  }

  function handleRearrangeFiles(newFiles) {
    setFiles(newFiles);
    if (newFiles.length > 0) { setRearrangeOrder([]); setTotalPages(0); }
  }

  function buildRearrangeOrder(count) {
    setTotalPages(count);
    setRearrangeOrder(Array.from({ length: count }, (_, i) => i + 1));
  }

  // ─── Smooth progress animation ─────────────────────────────────────────────
  function startProgressAnimation() {
    setProgress(0);
    // After upload reaches 50%, simulate server processing from 50→90
    let fake = 50;
    progressTimerRef.current = setInterval(() => {
      fake += (90 - fake) * 0.04; // exponential approach to 90
      setProgress(Math.min(fake, 90));
    }, 80);
  }

  function finishProgress() {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setProgress(100);
  }

  function onUploadProgress(ev) {
    if (ev.total) {
      const uploadPct = (ev.loaded / ev.total) * 50; // Upload = 0→50%
      setProgress(uploadPct);
      if (uploadPct >= 49) startProgressAnimation();
    }
  }

  useEffect(() => () => { if (progressTimerRef.current) clearInterval(progressTimerRef.current); }, []);

  async function handleSubmit() {
    if (files.length === 0) { setStatus("error"); setMessage("Please upload a PDF file first."); return; }
    setStatus("loading"); setMessage("Processing your PDF…"); setProgress(0);
    startProgressAnimation();

    try {
      switch (toolId) {
        case "merge":
          if (files.length < 2) throw new Error("Please upload at least 2 PDF files.");
          await mergePdfs(files, outputFilename, onUploadProgress); break;
        case "split":
          if (!splitAt.trim()) throw new Error("Please enter page numbers to split at.");
          await splitPdf(files[0], splitAt.trim(), outputFilename, onUploadProgress); break;
        case "compress": {
          const savings = await compressPdf(files[0], compressLevel, outputFilename, onUploadProgress);
          setCompressSavings(savings); break;
        }
        case "extract-pages":
          if (!pages.trim()) throw new Error("Please enter page numbers to extract.");
          await extractPages(files[0], pages.trim(), outputFilename, onUploadProgress); break;
        case "delete-pages":
          if (!pages.trim()) throw new Error("Please enter page numbers to delete.");
          await deletePages(files[0], pages.trim(), outputFilename, onUploadProgress); break;
        case "rearrange-pages":
          if (rearrangeOrder.length === 0) throw new Error("Please upload a PDF and set page order.");
          await rearrangePages(files[0], rearrangeOrder.join(","), outputFilename, onUploadProgress); break;
        case "rotate-pages":
          await rotatePages(files[0], pages.trim(), parseInt(angle), outputFilename, onUploadProgress); break;
        case "duplicate-pages":
          await duplicatePages(files[0], pages.trim(), parseInt(times), outputFilename, onUploadProgress); break;
        case "reverse":
          await reversePdf(files[0], outputFilename, onUploadProgress); break;
        case "insert-blank":
          if (!positions.trim()) throw new Error("Please enter page positions for blank pages.");
          await insertBlankPages(files[0], positions.trim(), outputFilename, onUploadProgress); break;
        case "add-pdf":
          if (files2.length === 0) throw new Error("Please upload the PDF to insert.");
          await addPdfToExisting(files[0], files2[0], parseInt(addPosition), outputFilename, onUploadProgress); break;
        case "pdf-to-images":
          await pdfToImages(files[0], imageFormat, outputFilename, onUploadProgress); break;
        case "images-to-pdf":
          await imagesToPdf(files, outputFilename, onUploadProgress); break;
        case "word-to-pdf":
          await wordToPdf(files[0], outputFilename, onUploadProgress); break;
        case "pdf-to-word":
          await pdfToWord(files[0], outputFilename, onUploadProgress); break;
        case "unlock-pdf":
          await unlockPdf(files[0], pdfPassword, outputFilename, onUploadProgress); break;
        // ─── New tools ───────────────────────────────────────────────────────
        case "protect-pdf":
          if (!protectPassword.trim()) throw new Error("Please enter a password.");
          if (protectPassword !== protectConfirm) throw new Error("Passwords do not match.");
          await protectPdf(files[0], protectPassword, outputFilename, onUploadProgress); break;
        case "add-watermark":
          if (!watermarkText.trim()) throw new Error("Please enter watermark text.");
          await addWatermark(files[0], watermarkText, watermarkOpacity, watermarkAngle, watermarkFontSize, watermarkColor, outputFilename, onUploadProgress); break;
        case "add-page-numbers":
          await addPageNumbers(files[0], pageNumPosition, pageNumFontSize, pageNumStart, pageNumPrefix, outputFilename, onUploadProgress); break;
        case "extract-text":
          await extractText(files[0], outputFilename, onUploadProgress); break;
        case "extract-images":
          await extractImages(files[0], outputFilename, onUploadProgress); break;
        case "pdf-to-excel":
          await pdfToExcel(files[0], outputFilename, onUploadProgress); break;
        case "add-signature":
          if (!sigFile) throw new Error("Please draw or upload your signature.");
          await addSignature(files[0], sigFile, sigPageNum, sigX, sigY, sigWidth, sigHeight, outputFilename, onUploadProgress); break;
        case "annotate-pdf":
          if (annotations.length === 0) throw new Error("Please add at least one annotation.");
          await annotatePdf(files[0], annotations, outputFilename, onUploadProgress); break;
        default:
          throw new Error("Unknown tool.");
      }
      finishProgress();
      setTimeout(() => {
        setStatus("success");
        setMessage("Done! Your file has been downloaded.");
      }, 400);
    } catch (err) {
      finishProgress();
      setTimeout(() => {
        setStatus("error");
        setMessage(err?.response?.data?.detail || err.message || "Something went wrong.");
      }, 200);
    }
  }

  const canSubmit = files.length > 0 && status !== "loading";

  // ─── Annotation helpers ────────────────────────────────────────────────────
  function addAnnotation() {
    const ann = { type: annType, page: annPage, x: annX, y: annY, color: annColor };
    if (annType === "highlight") { ann.x2 = annX2; ann.y2 = annY2; }
    if (annType === "text") { ann.content = annContent; ann.width = annX2 - annX; ann.height = annY2 - annY; }
    setAnnotations([...annotations, ann]);
  }

  // ─── Render extra controls per tool ───────────────────────────────────────
  function renderControls() {
    switch (toolId) {
      case "compress":
        return (
          <div>
            <div className="form-group">
              <label>Compression Level</label>
              <div className="compress-options">
                {[
                  { id: "low",    label: "Low Quality",    statusColor: "#10b981", desc: "Safest — removes unused objects" },
                  { id: "medium", label: "Medium Quality", statusColor: "#fbbf24", desc: "Balanced — removes duplicates & orphans" },
                  { id: "high",   label: "High Quality",   statusColor: "#f43f5e", desc: "Maximum — also compresses content streams" },
                ].map(({ id, label, statusColor, desc }) => (
                  <button key={id} type="button" onClick={() => setCompressLevel(id)}
                    className={`compress-option${compressLevel === id ? " active" : ""}`}
                  >
                    <div className="compress-option-title">
                      <span className="compress-status-dot" style={{ background: statusColor }} />{label}
                    </div>
                    <div className="compress-option-desc">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
            {compressSavings && compressSavings.originalSize > 0 && (
              <div className="info-panel" style={{ marginTop: "16px" }}>
                <div className="info-stat"><div className="stat-value">{(compressSavings.originalSize / 1024).toFixed(0)} KB</div><div className="stat-label">Original Size</div></div>
                <div className="info-stat"><div className="stat-value">{(compressSavings.compressedSize / 1024).toFixed(0)} KB</div><div className="stat-label">Compressed Size</div></div>
                <div className="info-stat">
                  <div className="stat-value" style={{ background: "linear-gradient(135deg, #10b981, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {Math.max(0, Math.round((1 - compressSavings.compressedSize / compressSavings.originalSize) * 100))}%
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
            <input className="form-input" placeholder="e.g. 3, 6  (split before page 3 and 6)" value={splitAt} onChange={(e) => setSplitAt(e.target.value)} />
            <span className="form-hint">Comma-separated page numbers. E.g. "3,6" on a 9-page PDF creates parts: 1-2, 3-5, 6-9.</span>
          </div>
        );

      case "extract-pages":
      case "delete-pages":
        return (
          <div className="form-group">
            <label>Page Numbers</label>
            <input className="form-input" placeholder="e.g. 1, 3, 5" value={pages} onChange={(e) => setPages(e.target.value)} />
            <span className="form-hint">Comma-separated page numbers (1-indexed).</span>
          </div>
        );

      case "rearrange-pages":
        return (
          <div className="form-group">
            <label>Total Page Count</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input className="form-input" type="number" min="1" placeholder="e.g. 5" value={totalPages || ""}
                onChange={(e) => { const n = parseInt(e.target.value); if (n > 0) buildRearrangeOrder(n); }} style={{ flex: 1 }} />
            </div>
            <span className="form-hint">Enter the total number of pages, then drag to reorder.</span>
            {rearrangeOrder.length > 0 && <DragList pages={rearrangeOrder} setPages={setRearrangeOrder} />}
          </div>
        );

      case "rotate-pages":
        return (
          <>
            <div className="form-group">
              <label>Pages to Rotate</label>
              <input className="form-input" placeholder="e.g. 1, 3 — leave blank to rotate all" value={pages} onChange={(e) => setPages(e.target.value)} />
              <span className="form-hint">Leave blank to rotate all pages.</span>
            </div>
            <div className="form-group">
              <label>Rotation Angle</label>
              <select className="form-input" value={angle} onChange={(e) => setAngle(e.target.value)}>
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
              <input className="form-input" placeholder="e.g. 2, 4 — leave blank for all" value={pages} onChange={(e) => setPages(e.target.value)} />
              <span className="form-hint">Leave blank to duplicate all pages.</span>
            </div>
            <div className="form-group">
              <label>Number of Copies</label>
              <input className="form-input" type="number" min="1" max="10" value={times} onChange={(e) => setTimes(e.target.value)} />
              <span className="form-hint">How many additional copies to insert after each page.</span>
            </div>
          </>
        );

      case "insert-blank":
        return (
          <div className="form-group">
            <label>Insert Before Positions</label>
            <input className="form-input" placeholder="e.g. 1, 4 — use page_count+1 to append" value={positions} onChange={(e) => setPositions(e.target.value)} />
            <span className="form-hint">Comma-separated page numbers. Use the total page count + 1 to append at the end.</span>
          </div>
        );

      case "add-pdf":
        return (
          <>
            <div className="form-group">
              <label>PDF to Insert</label>
              <FileUpload multiple={false} files={files2} setFiles={setFiles2} label="Drop the PDF to insert here" showInfo={false} />
            </div>
            <div className="form-group">
              <label>Insert at Page Position</label>
              <input className="form-input" type="number" min="1" value={addPosition} onChange={(e) => setAddPosition(e.target.value)} />
              <span className="form-hint">1 = insert at beginning. Use base PDF page count + 1 to append at end.</span>
            </div>
          </>
        );

      case "pdf-to-images":
        return (
          <div className="form-group">
            <label>Output Image Format</label>
            <select className="form-input" value={imageFormat} onChange={(e) => setImageFormat(e.target.value)}>
              <option value="png">PNG (Portable Network Graphics)</option>
              <option value="jpg">JPG (Joint Photographic Experts Group)</option>
            </select>
          </div>
        );

      case "unlock-pdf":
        return (
          <div className="form-group">
            <label>PDF Password</label>
            <input className="form-input" type="password" placeholder="Enter the PDF password (leave blank if only owner-locked)" value={pdfPassword} onChange={(e) => setPdfPassword(e.target.value)} />
            <span className="form-hint">Enter the password used to lock this PDF. Leave blank to attempt removing owner-only restrictions.</span>
          </div>
        );

      // ─── New tool controls ─────────────────────────────────────────────────

      case "protect-pdf":
        return (
          <>
            <div className="form-group">
              <label>New Password</label>
              <input className="form-input" type="password" placeholder="Enter a strong password" value={protectPassword} onChange={(e) => setProtectPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                className={`form-input${protectConfirm && protectPassword !== protectConfirm ? " input-error" : ""}`}
                type="password" placeholder="Re-enter password to confirm"
                value={protectConfirm} onChange={(e) => setProtectConfirm(e.target.value)}
              />
              {protectConfirm && protectPassword !== protectConfirm && (
                <span className="form-hint" style={{ color: "var(--accent-danger, #f43f5e)" }}>Passwords do not match.</span>
              )}
              <span className="form-hint">Your PDF will be encrypted with AES-256.</span>
            </div>
          </>
        );

      case "add-watermark":
        return (
          <>
            <div className="form-group">
              <label>Watermark Text</label>
              <input className="form-input" placeholder="e.g. CONFIDENTIAL, DRAFT" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Opacity — <strong>{Math.round(watermarkOpacity * 100)}%</strong></label>
              <input type="range" className="slider-input" min="0.05" max="1" step="0.05"
                value={watermarkOpacity} onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))} />
              <span className="form-hint">How visible the watermark is (5% = barely visible, 100% = fully opaque).</span>
            </div>
            <div className="form-group">
              <label>Rotation Angle</label>
              <select className="form-input" value={watermarkAngle} onChange={(e) => setWatermarkAngle(parseFloat(e.target.value))}>
                <option value="0">0° (Horizontal)</option>
                <option value="45">45° (Diagonal ↗)</option>
                <option value="-45">-45° (Diagonal ↘)</option>
                <option value="90">90° (Vertical)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Font Size — <strong>{watermarkFontSize}pt</strong></label>
              <input type="range" className="slider-input" min="12" max="120" step="4"
                value={watermarkFontSize} onChange={(e) => setWatermarkFontSize(parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Color</label>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {["808080", "FF0000", "0000FF", "000000", "FF8C00"].map((hex) => (
                  <button key={hex} type="button"
                    onClick={() => setWatermarkColor(hex)}
                    style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: `#${hex}`, border: watermarkColor === hex ? "3px solid var(--accent-primary)" : "2px solid rgba(255,255,255,0.2)",
                      cursor: "pointer", transition: "transform 0.15s", transform: watermarkColor === hex ? "scale(1.2)" : "scale(1)"
                    }}
                  />
                ))}
                <input type="color" value={`#${watermarkColor}`}
                  onChange={(e) => setWatermarkColor(e.target.value.replace("#", ""))}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", cursor: "pointer", background: "none" }}
                />
              </div>
            </div>
          </>
        );

      case "add-page-numbers":
        return (
          <>
            <div className="form-group">
              <label>Position</label>
              <select className="form-input" value={pageNumPosition} onChange={(e) => setPageNumPosition(e.target.value)}>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-center">Top Center</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prefix Text</label>
              <input className="form-input" placeholder="e.g. Page, p., — (leave blank for number only)" value={pageNumPrefix} onChange={(e) => setPageNumPrefix(e.target.value)} />
              <span className="form-hint">Preview: <strong>{pageNumPrefix ? `${pageNumPrefix} ${pageNumStart}` : String(pageNumStart)}</strong></span>
            </div>
            <div className="form-group">
              <label>Start Number</label>
              <input className="form-input" type="number" min="1" value={pageNumStart} onChange={(e) => setPageNumStart(parseInt(e.target.value) || 1)} />
            </div>
            <div className="form-group">
              <label>Font Size — <strong>{pageNumFontSize}pt</strong></label>
              <input type="range" className="slider-input" min="6" max="24" step="1"
                value={pageNumFontSize} onChange={(e) => setPageNumFontSize(parseInt(e.target.value))} />
            </div>
          </>
        );

      case "extract-text":
      case "extract-images":
      case "pdf-to-excel":
        return null; // No extra controls needed

      case "add-signature":
        return (
          <>
            <div className="form-group">
              <label>Signature Input</label>
              <div className="sig-mode-tabs">
                <button type="button" className={`sig-tab${sigMode === "draw" ? " active" : ""}`} onClick={() => { setSigMode("draw"); setSigFile(null); }}>✍ Draw</button>
                <button type="button" className={`sig-tab${sigMode === "upload" ? " active" : ""}`} onClick={() => setSigMode("upload")}>📁 Upload Image</button>
              </div>
              {sigMode === "draw" ? (
                <SignatureCanvas onCapture={(f) => setSigFile(f)} />
              ) : (
                <FileUpload multiple={false} files={sigFile ? [sigFile] : []}
                  setFiles={(arr) => setSigFile(arr[0] || null)}
                  label="Drop signature image here (PNG/JPG)" showInfo={false} accept="image/*" />
              )}
            </div>

            <div className="form-group">
              <label>Page Number</label>
              <input className="form-input" type="number" min="1" value={sigPageNum} onChange={(e) => setSigPageNum(parseInt(e.target.value) || 1)} />
            </div>

            {/* ── Live position preview on actual PDF page ── */}
            <div className="form-group">
              <label>Signature Position</label>
              <SignaturePositionPreview
                pdfFile={files[0]}
                pageNum={sigPageNum}
                sigFile={sigFile}
                x={sigX}
                y={sigY}
                width={sigWidth}
                height={sigHeight}
                onChange={(nx, ny) => { setSigX(nx); setSigY(ny); }}
              />
            </div>

            {/* ── Fine-tune size + position as numbers ── */}
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Fine-tune Position &amp; Size <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>(PDF points · A4 = 595×842)</span></span>
              </label>
              <div className="sig-pos-grid">
                <div><span className="form-hint">X (left)</span><input className="form-input" type="number" value={sigX} onChange={(e) => setSigX(parseFloat(e.target.value) || 0)} /></div>
                <div><span className="form-hint">Y (top)</span><input className="form-input" type="number" value={sigY} onChange={(e) => setSigY(parseFloat(e.target.value) || 0)} /></div>
                <div><span className="form-hint">Width</span><input className="form-input" type="number" value={sigWidth} onChange={(e) => setSigWidth(parseFloat(e.target.value) || 100)} /></div>
                <div><span className="form-hint">Height</span><input className="form-input" type="number" value={sigHeight} onChange={(e) => setSigHeight(parseFloat(e.target.value) || 40)} /></div>
              </div>
            </div>
          </>
        );

      case "annotate-pdf":
        return (
          <>
            <div className="form-group">
              <label>Annotation Type &amp; Options</label>
              <div className="ann-builder">
                <div className="ann-row">
                  <select className="form-input" value={annType} onChange={(e) => setAnnType(e.target.value)} style={{ flex: 1 }}>
                    <option value="highlight">🖍 Highlight Box</option>
                    <option value="text">📝 Text Note Box</option>
                  </select>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ fontSize: "12px", color: "var(--text-muted)" }}>Color:</label>
                    <input type="color" value={annColor} onChange={(e) => setAnnColor(e.target.value)}
                      style={{ width: "32px", height: "32px", borderRadius: "6px", border: "none", cursor: "pointer" }} />
                  </div>
                </div>
                {annType === "text" && (
                  <input className="form-input" placeholder="Enter text content for note box…" value={annContent} onChange={(e) => setAnnContent(e.target.value)} style={{ marginTop: "8px" }} />
                )}
              </div>
            </div>

            {/* ── Interactive PDF Page Annotation Preview ── */}
            <div className="form-group">
              <label>Interactive PDF Page Preview</label>
              <AnnotatePositionPreview
                pdfFile={files[0]}
                pageNum={annPage}
                onPageChange={(p) => setAnnPage(p)}
                annType={annType}
                annColor={annColor}
                annContent={annContent}
                annotations={annotations}
                onAddAnnotation={(newAnn) => setAnnotations([...annotations, newAnn])}
                onRemoveAnnotation={(idx) => setAnnotations(annotations.filter((_, i) => i !== idx))}
              />
            </div>

            {/* ── Manual Coordinate Input & Queue ── */}
            <div className="form-group">
              <label>Manual Coordinates (or drag on page above)</label>
              <div className="ann-builder">
                <div className="ann-coords-row">
                  <div><span className="form-hint">X1</span><input className="form-input" type="number" value={annX} onChange={(e) => setAnnX(parseFloat(e.target.value) || 0)} /></div>
                  <div><span className="form-hint">Y1</span><input className="form-input" type="number" value={annY} onChange={(e) => setAnnY(parseFloat(e.target.value) || 0)} /></div>
                  <div><span className="form-hint">X2</span><input className="form-input" type="number" value={annX2} onChange={(e) => setAnnX2(parseFloat(e.target.value) || 0)} /></div>
                  <div><span className="form-hint">Y2</span><input className="form-input" type="number" value={annY2} onChange={(e) => setAnnY2(parseFloat(e.target.value) || 0)} /></div>
                </div>
                <button type="button" className="btn btn-secondary" style={{ marginTop: "10px", width: "100%", fontSize: "13px" }} onClick={addAnnotation}>
                  + Add Manual Annotation
                </button>
              </div>
            </div>

            {annotations.length > 0 && (
              <div className="form-group">
                <label>Annotation Queue ({annotations.length})</label>
                <div className="ann-list">
                  {annotations.map((ann, i) => (
                    <div key={i} className="ann-list-item">
                      <span style={{ width: "14px", height: "14px", borderRadius: "3px", background: ann.color, flexShrink: 0, display: "inline-block" }} />
                      <span className="ann-type-badge">{ann.type}</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Page {ann.page} · ({ann.x},{ann.y})</span>
                      {ann.content && <span style={{ fontSize: "12px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "120px" }}>"{ann.content}"</span>}
                      <button type="button" onClick={() => setAnnotations(annotations.filter((_, j) => j !== i))}
                        style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "16px", lineHeight: 1 }}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  }

  // ─── Output filename extension logic ──────────────────────────────────────
  const outputExt = (() => {
    if (["extract-text"].includes(toolId)) return ".txt";
    if (["extract-images", "pdf-to-images", "split"].includes(toolId) && (toolId !== "split" || splitAt?.includes(","))) return ".zip";
    if (["pdf-to-word"].includes(toolId)) return ".docx";
    if (["pdf-to-excel"].includes(toolId)) return ".xlsx";
    return ".pdf";
  })();

  const Icon = meta.icon;

  return (
    <div key={toolId}>
      {/* Mobile Tool Header */}
      <div className="mobile-tool-header">
        <button className="mobile-back-btn" onClick={() => onSelectTool && onSelectTool("home")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back</span>
        </button>
        <span className="mobile-tool-title">{meta.title}</span>
      </div>

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
            toolId === "merge" ? "Drop multiple PDFs here (they'll be merged in order)"
            : toolId === "images-to-pdf" ? "Drop one or more images here (PNG/JPG)"
            : toolId === "word-to-pdf" ? "Drop your Word document (.docx) here"
            : toolId === "add-pdf" ? "Drop the base PDF here"
            : "Drop your PDF here"
          }
          showInfo={toolId !== "word-to-pdf" && toolId !== "images-to-pdf"}
          accept={
            toolId === "images-to-pdf" ? "image/*"
            : toolId === "word-to-pdf" ? ".docx"
            : "application/pdf"
          }
        />

        {renderControls()}

        {/* ── Output Filename ── */}
        <div className="form-group" style={{ marginTop: "24px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent-start)" }}>
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
            </svg>
            <span>Output Filename</span>
            <span style={{ background: "rgba(0,242,254,0.12)", border: "1px solid rgba(0,242,254,0.25)", color: "#a5f3fc", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 7px", borderRadius: "99px" }}>Optional</span>
          </label>
          <div style={{ position: "relative" }}>
            <input className="form-input"
              placeholder={`e.g. my-document  (saves as my-document${outputExt})`}
              value={outputFilename} onChange={(e) => setOutputFilename(e.target.value)}
              style={{ paddingRight: "80px" }}
            />
            {outputFilename.trim() && (
              <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, pointerEvents: "none" }}>
                {outputExt}
              </span>
            )}
          </div>
          <span className="form-hint">Leave blank to use the default filename.</span>
        </div>

        {/* ── Progress Bar (shown during loading) ── */}
        {status === "loading" && <ProgressBar progress={progress} message={message} />}

        {/* ── Status Bar (shown after completion) ── */}
        <StatusBar status={status} message={message} />

        <div className="action-bar">
          <span className="info-text">
            {files.length > 0 ? <><strong>{files.length}</strong> file{files.length !== 1 ? "s" : ""} ready</> : "No files selected"}
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-secondary" onClick={resetState}>Reset</button>
            <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={!canSubmit}>
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
