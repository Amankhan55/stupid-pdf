import React from "react";

// Standard icon container props
const defaultProps = {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  className: "custom-svg-icon"
};

/* ─── 1. MERGE ICON (Emerald & Cyan Dual-Gradient) ─────────────────────── */
export const MergeIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <defs>
      <linearGradient id="merge-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14F195" />
        <stop offset="100%" stopColor="#00C9FF" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="4" rx="1.5" fill="url(#merge-grad-1)" opacity="0.85" />
    <path d="M12 21V11" stroke="#14F195" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M12 11L7 6" stroke="#00C9FF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M12 11L17 6" stroke="#00C9FF" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="12" cy="11" r="2.5" fill="#14F195" />
  </svg>
);

/* ─── 2. SPLIT ICON (Electric Pink & Purple Dual-Tone) ─────────────────── */
export const SplitIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <circle cx="6" cy="6" r="3" fill="#FF5D73" />
    <circle cx="6" cy="18" r="3" fill="#9B6DFF" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" stroke="#FF5D73" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" stroke="#9B6DFF" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" stroke="#FFBE3D" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

/* ─── 3. COMPRESS ICON (Sapphire Blue & Sunset Amber Squeeze) ──────────── */
export const CompressIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <rect x="3" y="11" width="18" height="2" rx="1" fill="#FFBE3D" />
    <path d="M12 2V9" stroke="#4D8DFF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M9 6L12 9L15 6" stroke="#4D8DFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 22V15" stroke="#00C9FF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M15 18L12 15L9 18" stroke="#00C9FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── 4. EXTRACT PAGES ICON (Warm Amber & Mint Page Pull) ─────────────── */
export const ExtractIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M5 21V3H11" stroke="#FFBE3D" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M5 12H19" stroke="#14F195" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 7L19 12L14 17" stroke="#14F195" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="5" y1="3" x2="5" y2="21" stroke="#FF5D73" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/* ─── 5. DELETE PAGES ICON (Crimson Red & Coral Trash Bin) ─────────────── */
export const DeleteIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M3 6H21" stroke="#FF5D73" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6" fill="rgba(255, 93, 115, 0.15)" stroke="#FF5D73" strokeWidth="2" />
    <path d="M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" fill="#FF5D73" opacity="0.3" stroke="#FF5D73" strokeWidth="2" />
    <line x1="10" y1="11" x2="10" y2="17" stroke="#FFBE3D" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="11" x2="14" y2="17" stroke="#FFBE3D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ─── 6. REARRANGE ICON (Violet Purple & Pink Dual Swap) ───────────────── */
export const RearrangeIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M8 18L4 14L8 10" stroke="#9B6DFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 14H18" stroke="#9B6DFF" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M16 10L20 6L16 2" stroke="#FF5D73" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 6H6" stroke="#FF5D73" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="12" y1="2" x2="12" y2="22" stroke="#00C9FF" strokeWidth="1.5" strokeDasharray="3 3" />
  </svg>
);

/* ─── 7. ROTATE PAGES ICON (Solana Emerald & Cyan Arc) ─────────────────── */
export const RotateIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M21 12A9 9 0 0 1 12 21A9 9 0 0 1 3 12A9 9 0 0 1 12 3H21" stroke="#14F195" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M17 7L22 3L17 -1" stroke="#00C9FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" fill="#00C9FF" />
  </svg>
);

/* ─── 8. DUPLICATE ICON (Indigo Blue & Cyan Overlapping Pages) ─────────── */
export const DuplicateIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <rect width="13" height="13" x="8" y="8" rx="2.5" fill="rgba(0, 201, 255, 0.2)" stroke="#00C9FF" strokeWidth="2" />
    <rect width="13" height="13" x="3" y="3" rx="2.5" fill="rgba(77, 141, 255, 0.3)" stroke="#4D8DFF" strokeWidth="2" />
    <circle cx="17.5" cy="17.5" r="1.5" fill="#14F195" />
  </svg>
);

/* ─── 9. REVERSE ICON (Sunset Amber & Crimson Chevrons) ────────────────── */
export const ReverseIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M11 17L6 12L11 7" stroke="#FFBE3D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 17L13 12L18 7" stroke="#FF5D73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── 10. INSERT BLANK ICON (Mint Green & Bright Emerald Plus) ─────────── */
export const InsertBlankIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <rect width="18" height="18" x="3" y="3" rx="3" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" fill="rgba(16, 185, 129, 0.08)" />
    <line x1="12" y1="8" x2="12" y2="16" stroke="#14F195" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="#14F195" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/* ─── 11. ADD PDF ICON (Royal Blue Page with Emerald Plus) ─────────────── */
export const AddPdfIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="rgba(77, 141, 255, 0.15)" stroke="#4D8DFF" strokeWidth="2" />
    <path d="M14 2V8H20" stroke="#4D8DFF" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="12" cy="15" r="4" fill="#14F195" />
    <path d="M12 13V17M10 15H14" stroke="#040906" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ─── 12. PDF TO IMAGES ICON (Cyan Frame + Gold Sun + Violet Arrow) ─────── */
export const PdfToImageIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H12" stroke="#00C9FF" strokeWidth="2" />
    <circle cx="9" cy="9" r="2.5" fill="#FFBE3D" />
    <path d="M21 15L17.9 11.9C17.1 11.1 15.9 11.1 15.1 11.9L6 21" stroke="#00C9FF" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 2H22V8" stroke="#9B6DFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 8L22 2" stroke="#FF5D73" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/* ─── 13. IMAGE TO PDF ICON (Violet Image + Emerald Page) ──────────────── */
export const ImageToPdfIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M4 22H18C19.1 22 20 21.1 20 20V7.5L14.5 2H6C4.9 2 4 2.9 4 4V14" stroke="#14F195" strokeWidth="2" fill="rgba(20, 241, 149, 0.1)" />
    <polyline points="14 2 14 8 20 8" stroke="#14F195" strokeWidth="2" />
    <circle cx="9" cy="18" r="2.5" fill="#FFBE3D" />
    <path d="M13 18L17 14" stroke="#9B6DFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/* ─── 14. WORD TO PDF ICON (MS Word Blue & Emerald PDF) ───────────────── */
export const WordToPdfIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="rgba(43, 87, 154, 0.2)" stroke="#4D8DFF" strokeWidth="2" />
    <polyline points="14 2 14 8 20 8" stroke="#4D8DFF" strokeWidth="2" />
    <rect x="7" y="11" width="10" height="8" rx="1.5" fill="#14F195" />
    <text x="8.5" y="17" fontSize="6.5" fontWeight="900" fill="#040906" fontFamily="sans-serif">PDF</text>
  </svg>
);

/* ─── 15. PDF TO WORD ICON (Emerald PDF & Word Blue Export Arrow) ─────── */
export const PdfToWordIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="rgba(20, 241, 149, 0.12)" stroke="#14F195" strokeWidth="2" />
    <polyline points="14 2 14 8 20 8" stroke="#14F195" strokeWidth="2" />
    <path d="M8 14L12 18L16 14" stroke="#4D8DFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9V18" stroke="#4D8DFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/* ─── 16. UNLOCK PDF ICON (Security Violet, Gold & Emerald Shackle) ────── */
export const UnlockIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <rect x="3" y="11" width="18" height="11" rx="3" fill="rgba(155, 109, 255, 0.2)" stroke="#9B6DFF" strokeWidth="2" />
    <path d="M7 11V7C7 4.2 9.2 2 12 2C14.5 2 16.6 3.8 16.9 6.3" stroke="#14F195" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1.5" fill="#FFBE3D" />
  </svg>
);

/* ─── 17. GENERAL FILE ICON ───────────────────────────────────────────── */
export const FileIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M15 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V7L15 2Z" fill="rgba(20, 241, 149, 0.15)" stroke="#14F195" strokeWidth="2" />
    <path d="M14 2V7H19" stroke="#14F195" strokeWidth="2" />
  </svg>
);

export const UploadCloudIcon = (props) => (
  <svg {...defaultProps} {...props} width="40" height="40">
    <path d="M4 14.899A7 7 0 1 1 15.71 8H17.5A4.5 4.5 0 0 1 20 16.242" stroke="#14F195" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 12V21" stroke="#00C9FF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M9 15L12 12L15 15" stroke="#00C9FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── 17. PROTECT ICON (Purple/Pink Shield Lock) ────────────────────────── */
export const ProtectIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <defs>
      <linearGradient id="protect-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9B6DFF" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z"
      fill="url(#protect-grad)" opacity="0.25" stroke="url(#protect-grad)" strokeWidth="1.8" strokeLinejoin="round" />
    <rect x="9" y="11" width="6" height="5" rx="1" stroke="url(#protect-grad)" strokeWidth="2" />
    <path d="M12 8a2 2 0 0 1 2 2v1H10v-1a2 2 0 0 1 2-2z" stroke="url(#protect-grad)" strokeWidth="1.8" />
    <circle cx="12" cy="13.5" r="0.8" fill="#ec4899" />
  </svg>
);

/* ─── 18. WATERMARK ICON (Cyan/Blue Droplet Layers) ─────────────────────── */
export const WatermarkIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <defs>
      <linearGradient id="watermark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00C9FF" />
        <stop offset="100%" stopColor="#4D8DFF" />
      </linearGradient>
    </defs>
    <path d="M12 3C12 3 6 9.5 6 14a6 6 0 0 0 12 0c0-4.5-6-11-6-11z"
      fill="url(#watermark-grad)" opacity="0.25" stroke="url(#watermark-grad)" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 14.5c0-1.5 1.5-4 3-6" stroke="#00C9FF" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    <line x1="5" y1="19" x2="19" y2="5" stroke="#4D8DFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <line x1="5" y1="21" x2="21" y2="5" stroke="#00C9FF" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
  </svg>
);

/* ─── 19. PAGE NUMBERS ICON (Amber/Orange Hash Grid) ─────────────────────── */
export const PageNumbersIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <defs>
      <linearGradient id="pagenum-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFBE3D" />
        <stop offset="100%" stopColor="#f97316" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="url(#pagenum-grad)" strokeWidth="1.8" fill="none" />
    <line x1="3" y1="15" x2="21" y2="15" stroke="url(#pagenum-grad)" strokeWidth="1.5" opacity="0.5" />
    <text x="12" y="12.5" textAnchor="middle" fontSize="6" fontWeight="700" fill="url(#pagenum-grad)" fontFamily="monospace">123</text>
    <text x="12" y="20" textAnchor="middle" fontSize="5" fill="#FFBE3D" fontFamily="monospace" opacity="0.9">pg</text>
  </svg>
);

/* ─── 20. EXTRACT TEXT ICON (Green/Teal Text Lines + Arrow) ─────────────── */
export const ExtractTextIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <defs>
      <linearGradient id="exttext-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14F195" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="13" height="18" rx="2" stroke="url(#exttext-grad)" strokeWidth="1.8" fill="none" opacity="0.7" />
    <line x1="6" y1="8"  x2="13" y2="8"  stroke="#14F195" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="6" y1="11" x2="13" y2="11" stroke="#14F195" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="6" y1="14" x2="10" y2="14" stroke="#14F195" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 13v8M15 18l3 3 3-3" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── 21. EXTRACT IMAGES ICON (Pink/Purple Image Frame + Arrow) ─────────── */
export const ExtractImagesIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <defs>
      <linearGradient id="extimg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5D73" />
        <stop offset="100%" stopColor="#9B6DFF" />
      </linearGradient>
    </defs>
    <rect x="2" y="4" width="15" height="13" rx="2" stroke="url(#extimg-grad)" strokeWidth="1.8" fill="none" />
    <circle cx="6.5" cy="8" r="1.5" fill="#FF5D73" opacity="0.8" />
    <path d="M2 13l4-4 3 3 2-2 4 4" stroke="url(#extimg-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 13v8M16 18l3 3 3-3" stroke="#9B6DFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── 22. EXCEL ICON (Green Table Grid) ─────────────────────────────────── */
export const ExcelIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <defs>
      <linearGradient id="excel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#excel-grad)" opacity="0.2" stroke="url(#excel-grad)" strokeWidth="1.8" />
    <line x1="3" y1="9"  x2="21" y2="9"  stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
    <line x1="3" y1="15" x2="21" y2="15" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
    <line x1="10" y1="3" x2="10" y2="21" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
    <path d="M5.5 12.5L7.5 10.5M7.5 12.5L5.5 10.5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="12" y1="11.5" x2="19" y2="11.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <line x1="12" y1="13.5" x2="17" y2="13.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

/* ─── 23. SIGNATURE ICON (Blue/Purple Pen Curve) ────────────────────────── */
export const SignatureIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <defs>
      <linearGradient id="sig-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4D8DFF" />
        <stop offset="100%" stopColor="#9B6DFF" />
      </linearGradient>
    </defs>
    <path d="M3 18c2-4 4-8 6-8s2 4 4 4 4-8 6-8" stroke="url(#sig-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="3" y1="21" x2="21" y2="21" stroke="url(#sig-grad)" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
    <circle cx="19" cy="10" r="2.5" fill="url(#sig-grad)" opacity="0.3" stroke="url(#sig-grad)" strokeWidth="1.5" />
    <path d="M18 9l2 2" stroke="#4D8DFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─── 24. ANNOTATE ICON (Amber/Green Speech Bubble + Highlight) ─────────── */
export const AnnotateIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <defs>
      <linearGradient id="annotate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFBE3D" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
    </defs>
    <rect x="3" y="5" width="14" height="10" rx="2" stroke="url(#annotate-grad)" strokeWidth="1.8" fill="none" />
    <path d="M7 18l3-3H3z" fill="#FFBE3D" opacity="0.7" />
    <line x1="6" y1="9"  x2="14" y2="9"  stroke="#FFBE3D" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="12" x2="11" y2="12" stroke="#FFBE3D" strokeWidth="2" strokeLinecap="round" />
    <rect x="16" y="12" width="6" height="4" rx="1" fill="#14F195" opacity="0.3" stroke="#14F195" strokeWidth="1.5" />
    <line x1="17.5" y1="14" x2="20.5" y2="14" stroke="#14F195" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─── 25. REDACT ICON (Crimson/Pink Blocked-Out Lines) ───────────────────── */
export const RedactIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <defs>
      <linearGradient id="redact-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5D73" />
        <stop offset="100%" stopColor="#9B6DFF" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="url(#redact-grad)" strokeWidth="1.8" fill="none" />
    <line x1="6" y1="8" x2="18" y2="8" stroke="url(#redact-grad)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    <rect x="6" y="10.5" width="12" height="3.5" rx="0.5" fill="#0B0F17" stroke="url(#redact-grad)" strokeWidth="1.4" />
    <line x1="6" y1="17" x2="14" y2="17" stroke="url(#redact-grad)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
  </svg>
);

/* ─── 26. ORIGINAL STUPIDPDF BRAND LOGO ──────────────────────────────────── */
export const StupidPdfLogo = ({ width = "36", height = "36", className = "", ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`stupid-pdf-brand-logo ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="sp-logo-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1A2333" />
        <stop offset="100%" stopColor="#0B0F17" />
      </linearGradient>
      <linearGradient id="sp-logo-bolt" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14F195" />
        <stop offset="50%" stopColor="#00C9FF" />
        <stop offset="100%" stopColor="#9B6DFF" />
      </linearGradient>
      <linearGradient id="sp-logo-border" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(20, 241, 149, 0.8)" />
        <stop offset="50%" stopColor="rgba(0, 201, 255, 0.6)" />
        <stop offset="100%" stopColor="rgba(155, 109, 255, 0.4)" />
      </linearGradient>
      <filter id="sp-logo-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#sp-logo-bg)" stroke="url(#sp-logo-border)" strokeWidth="1.5" />
    <path d="M11 10C11 8.89543 11.8954 8 13 8H22L29 15V29C29 30.1046 28.1046 31 27 31H13C11.8954 31 11 30.1046 11 29V10Z" fill="rgba(255, 255, 255, 0.05)" stroke="url(#sp-logo-bolt)" strokeWidth="1.5" />
    <path d="M22 8V15H29" stroke="url(#sp-logo-bolt)" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M21 12L14.5 20.5H19.5L18.5 27.5L25.5 19H20.5L21 12Z" fill="url(#sp-logo-bolt)" filter="url(#sp-logo-glow)" />
    <circle cx="27" cy="27" r="1.5" fill="#14F195" />
  </svg>
);

/* ─── 27. ORIGINAL POPULAR SPARK EMBLEM ─────────────────────────────────── */
export const PopularSparkIcon = ({ width = "16", height = "16", className = "", ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`popular-spark-icon ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="pop-spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14F195" />
        <stop offset="50%" stopColor="#00C9FF" />
        <stop offset="100%" stopColor="#FFBE3D" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C12.8 6.5 17.5 11.2 22 12C17.5 12.8 12.8 17.5 12 22C11.2 17.5 6.5 12.8 2 12C6.5 11.2 11.2 6.5 12 2Z"
      fill="url(#pop-spark-grad)"
    />
    <circle cx="12" cy="12" r="2" fill="#FFFFFF" opacity="0.9" />
  </svg>
);

/* ─── 28. ORIGINAL IN MEMORY ICON ─────────────────────────────────────────── */
export const InMemoryIcon = ({ width = "14", height = "14", className = "", ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`in-memory-icon ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="in-mem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14F195" />
        <stop offset="100%" stopColor="#00C9FF" />
      </linearGradient>
    </defs>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="url(#in-mem-grad)" />
  </svg>
);

/* ─── 29. ORIGINAL PRIVACY SHIELD ICON ────────────────────────────────────── */
export const PrivacyShieldIcon = ({ width = "14", height = "14", className = "", ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`privacy-shield-icon ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="priv-shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00C9FF" />
        <stop offset="100%" stopColor="#9B6DFF" />
      </linearGradient>
    </defs>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="url(#priv-shield-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0, 201, 255, 0.15)" />
    <rect x="9" y="10" width="6" height="5" rx="1" fill="url(#priv-shield-grad)" />
    <circle cx="12" cy="8.5" r="1.5" stroke="url(#priv-shield-grad)" strokeWidth="1.5" fill="none" />
  </svg>
);

/* ─── 30. ORIGINAL STATELESS ENGINE ICON ──────────────────────────────────── */
export const StatelessEngineIcon = ({ width = "14", height = "14", className = "", ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`stateless-engine-icon ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="state-eng-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9B6DFF" />
        <stop offset="100%" stopColor="#FF5D73" />
      </linearGradient>
    </defs>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="url(#state-eng-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(155, 109, 255, 0.15)" />
    <circle cx="12" cy="12" r="3" fill="url(#state-eng-grad)" />
  </svg>
);

/* ─── 31. ORIGINAL COMING SOON LOCK ICON ─────────────────────────────────── */
export const ComingSoonLockIcon = ({ width = "16", height = "16", className = "", ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`coming-soon-lock-icon ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="cs-lock-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFBE3D" />
        <stop offset="100%" stopColor="#F97316" />
      </linearGradient>
      <filter id="cs-lock-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path
      d="M7 10V7A5 5 0 0 1 17 7V10"
      stroke="url(#cs-lock-grad)"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
    <rect
      x="5"
      y="10"
      width="14"
      height="11"
      rx="3"
      fill="url(#cs-lock-grad)"
      filter="url(#cs-lock-glow)"
    />
    <circle cx="12" cy="14.5" r="1.2" fill="#0B0F17" />
    <path d="M12 15.5V18" stroke="#0B0F17" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─── 32. ORIGINAL CONTACT PAGE ICONS ────────────────────────────────────── */
export const ResponseClockIcon = ({ width = "20", height = "20", className = "", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <defs>
      <linearGradient id="resp-clk-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14F195" />
        <stop offset="100%" stopColor="#00C9FF" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="9" stroke="url(#resp-clk-grad)" strokeWidth="2" fill="rgba(20, 241, 149, 0.1)" />
    <path d="M12 7V12L15.5 14" stroke="url(#resp-clk-grad)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1.5" fill="#14F195" />
  </svg>
);

export const GitHubBranchIcon = ({ width = "20", height = "20", className = "", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <defs>
      <linearGradient id="gh-node-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00C9FF" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
    </defs>
    <path d="M6 3V15" stroke="url(#gh-node-grad)" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="6" cy="18" r="3" fill="url(#gh-node-grad)" />
    <circle cx="6" cy="6" r="3" fill="url(#gh-node-grad)" />
    <path d="M6 9C9 9 12 11 12 14" stroke="url(#gh-node-grad)" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="15" cy="16" r="3" fill="url(#gh-node-grad)" />
  </svg>
);

export const ContactUserIcon = ({ width = "16", height = "16", className = "", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M20 21C20 17.134 16.4183 14 12 14C7.58172 14 4 17.134 4 21" stroke="#14F195" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="7" r="4" stroke="#14F195" strokeWidth="2" fill="rgba(20, 241, 149, 0.15)" />
  </svg>
);

export const ContactEmailIcon = ({ width = "16", height = "16", className = "", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="3" stroke="#00C9FF" strokeWidth="2" fill="rgba(0, 201, 255, 0.1)" />
    <path d="M4 7L12 13L20 7" stroke="#00C9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TopicQuestionIcon = ({ width = "14", height = "14", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
  </svg>
);

export const TopicBugIcon = ({ width = "14", height = "14", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="8" y="6" width="8" height="14" rx="4" />
    <line x1="6" y1="10" x2="18" y2="10" />
    <line x1="6" y1="14" x2="18" y2="14" />
    <line x1="6" y1="18" x2="18" y2="18" />
    <path d="M12 2v4" />
  </svg>
);

export const TopicFeatureIcon = ({ width = "14", height = "14", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.59 2.97 1.5 4 .76.76 1.23 1.52 1.41 2.5" />
  </svg>
);

export const TopicPartnershipIcon = ({ width = "14", height = "14", ...props }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

