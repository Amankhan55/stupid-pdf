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
  ProtectIcon,
  WatermarkIcon,
  PageNumbersIcon,
  ExtractTextIcon,
  ExtractImagesIcon,
  ExcelIcon,
  SignatureIcon,
  AnnotateIcon,
} from "./Icons";

const HomeIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PDF_TOOLS = [
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

const EDITING_TOOLS = [
  { id: "add-watermark",   icon: WatermarkIcon,    label: "Add Watermark" },
  { id: "add-page-numbers",icon: PageNumbersIcon,  label: "Add Page Numbers" },
  { id: "add-signature",   icon: SignatureIcon,    label: "Add Signature" },
  { id: "annotate-pdf",    icon: AnnotateIcon,     label: "Annotate PDF" },
];

const UTILITY_TOOLS = [
  { id: "extract-text",    icon: ExtractTextIcon,   label: "Extract Text" },
  { id: "extract-images",  icon: ExtractImagesIcon, label: "Extract Images" },
];

const SECURITY_TOOLS = [
  { id: "unlock-pdf",  icon: UnlockIcon,   label: "Unlock PDF" },
  { id: "protect-pdf", icon: ProtectIcon,  label: "Protect PDF" },
];

const CONVERSION_TOOLS = [
  { id: "pdf-to-images",   icon: PdfToImageIcon,   label: "PDF to Images" },
  { id: "images-to-pdf",   icon: ImageToPdfIcon,   label: "Images to PDF" },
  { id: "word-to-pdf",     icon: WordToPdfIcon,    label: "Word to PDF" },
  { id: "pdf-to-word",     icon: PdfToWordIcon,    label: "PDF to Word" },
  { id: "pdf-to-excel",    icon: ExcelIcon,        label: "PDF to Excel" },
];

const TOOLS = [...PDF_TOOLS, ...EDITING_TOOLS, ...UTILITY_TOOLS, ...SECURITY_TOOLS, ...CONVERSION_TOOLS];

export { TOOLS, PDF_TOOLS, EDITING_TOOLS, UTILITY_TOOLS, SECURITY_TOOLS, CONVERSION_TOOLS };

export default function Sidebar({ active, onSelect }) {
  const renderSection = (label, tools, padTop = "16px") => (
    <>
      <div className="sidebar-section-label" style={{ paddingTop: padTop }}>{label}</div>
      {tools.map((tool) => {
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
    </>
  );

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {/* Dashboard Link */}
        <button
          className={`sidebar-item${active === "home" ? " active" : ""}`}
          onClick={() => onSelect("home")}
          style={{ margin: "12px 0" }}
        >
          <span className="icon">
            <HomeIcon />
          </span>
          <span>Home Dashboard</span>
        </button>

        {renderSection("PDF Processing", PDF_TOOLS, "0")}
        {renderSection("PDF Editing", EDITING_TOOLS)}
        {renderSection("Utilities", UTILITY_TOOLS)}
        {renderSection("Security", SECURITY_TOOLS)}
        {renderSection("PDF Conversion", CONVERSION_TOOLS)}
      </nav>
    </aside>
  );
}
