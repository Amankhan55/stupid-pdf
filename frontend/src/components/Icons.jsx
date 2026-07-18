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
