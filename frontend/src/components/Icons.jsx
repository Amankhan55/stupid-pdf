import React from "react";

// Standard icon props to share stroke/fill settings easily
const defaultProps = {
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "custom-svg-icon"
};

export const MergeIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M12 22V12" />
    <path d="M12 12L7 7" />
    <path d="M12 12l5-5" />
    <circle cx="12" cy="12" r="1" />
    <path d="M20 4H4v2h16V4z" />
  </svg>
);

export const SplitIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

export const CompressIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M4 14h16" />
    <path d="M4 10h16" />
    <path d="M12 3v7" />
    <path d="M12 21v-7" />
    <path d="m9 7 3 3 3-3" />
    <path d="m15 17-3-3-3 3" />
  </svg>
);

export const ExtractIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
    <path d="M5 21V3h4" />
  </svg>
);

export const DeleteIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const RearrangeIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="m8 18-4-4 4-4" />
    <path d="M4 14h16" />
    <path d="m16 10 4-4-4-4" />
    <path d="M20 6H4" />
    <path d="M12 2v20" strokeDasharray="3 3" />
  </svg>
);

export const RotateIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M21 12a9 9 0 0 1-9 9m-9-9a9 9 0 0 1 9-9h9" />
    <path d="M16 7h5V2" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

export const DuplicateIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export const ReverseIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="m11 17-5-5 5-5" />
    <path d="m18 17-5-5 5-5" />
  </svg>
);

export const InsertBlankIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" strokeDasharray="4 2" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const AddPdfIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M9 15h6" />
    <path d="M12 12v6" />
  </svg>
);

// General UI Icons
export const UploadCloudIcon = (props) => (
  <svg {...defaultProps} {...props} width="40" height="40" strokeWidth="1.5">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m9 15 3-3 3 3" />
  </svg>
);

export const FileIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
);
