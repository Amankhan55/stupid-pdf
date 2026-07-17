import React from "react";
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
  AddPdfIcon
} from "./Icons";

const TOOLS = [
  { id: "merge",           icon: MergeIcon,       label: "Merge PDFs" },
  { id: "split",           icon: SplitIcon,       label: "Split PDF" },
  { id: "compress",        icon: CompressIcon,    label: "Compress PDF" },
  { id: "extract-pages",   icon: ExtractIcon,     label: "Extract Pages" },
  { id: "delete-pages",    icon: DeleteIcon,      label: "Delete Pages" },
  { id: "rearrange-pages", icon: RearrangeIcon,   label: "Rearrange Pages" },
  { id: "rotate-pages",    icon: RotateIcon,      label: "Rotate Pages" },
  { id: "duplicate-pages", icon: DuplicateIcon,   label: "Duplicate Pages" },
  { id: "reverse",         icon: ReverseIcon,     label: "Reverse Order" },
  { id: "insert-blank",    icon: InsertBlankIcon, label: "Insert Blank Pages" },
  { id: "add-pdf",         icon: AddPdfIcon,      label: "Add PDF to Existing" },
];

export { TOOLS };

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/logo.png"
            alt="StupidPDF Logo"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              boxShadow: "0 0 10px rgba(0, 242, 254, 0.4)",
              objectFit: "cover"
            }}
          />
          <h1 style={{ letterSpacing: "-0.01em" }}>StupidPDF</h1>
        </div>
        <p>PDF Processing Suite</p>
      </div>

      <div className="sidebar-section-label">PDF Tools</div>

      <nav className="sidebar-nav">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              className={`sidebar-item${active === tool.id ? " active" : ""}`}
              onClick={() => onSelect(tool.id)}
            >
              <span className="icon">
                <Icon width="16" height="16" />
              </span>
              <span>{tool.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
