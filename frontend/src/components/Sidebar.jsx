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
  AddPdfIcon,
  PdfToImageIcon,
  ImageToPdfIcon,
  WordToPdfIcon,
  PdfToWordIcon,
  UnlockIcon,
} from "./Icons";

export const PDF_TOOLS = [
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
  { id: "unlock-pdf",      icon: UnlockIcon,      label: "Unlock PDF" },
];

export const CONVERSION_TOOLS = [
  { id: "pdf-to-images",   icon: PdfToImageIcon,  label: "PDF to Images" },
  { id: "images-to-pdf",   icon: ImageToPdfIcon,  label: "Images to PDF" },
  { id: "word-to-pdf",     icon: WordToPdfIcon,   label: "Word to PDF" },
  { id: "pdf-to-word",     icon: PdfToWordIcon,   label: "PDF to Word" },
];

export const TOOLS = [...PDF_TOOLS, ...CONVERSION_TOOLS];


export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="tool-sidebar">
      {/* PDF Processing group */}
      <div className="tool-sidebar-section">
        <div className="tool-sidebar-label">PDF Processing</div>
        {PDF_TOOLS.filter((t) => t.id !== "unlock-pdf").map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              className={`tool-sidebar-item${active === tool.id ? " active" : ""}`}
              onClick={() => onSelect(tool.id)}
            >
              <span className="sidebar-item-icon">
                <Icon width="15" height="15" />
              </span>
              {tool.label}
            </button>
          );
        })}
      </div>

      {/* Security group */}
      <div className="tool-sidebar-section">
        <div className="tool-sidebar-label">Security</div>
        <button
          className={`tool-sidebar-item${active === "unlock-pdf" ? " active" : ""}`}
          onClick={() => onSelect("unlock-pdf")}
        >
          <span className="sidebar-item-icon">
            <UnlockIcon width="15" height="15" />
          </span>
          Unlock PDF
        </button>
      </div>

      {/* Conversion group */}
      <div className="tool-sidebar-section">
        <div className="tool-sidebar-label">Conversion</div>
        {CONVERSION_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              className={`tool-sidebar-item${active === tool.id ? " active" : ""}`}
              onClick={() => onSelect(tool.id)}
            >
              <span className="sidebar-item-icon">
                <Icon width="15" height="15" />
              </span>
              {tool.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
