const TOOLS = [
  { id: "merge",           icon: "🔗", label: "Merge PDFs" },
  { id: "split",           icon: "✂️",  label: "Split PDF" },
  { id: "compress",        icon: "🗜️", label: "Compress PDF" },
  { id: "extract-pages",   icon: "📋", label: "Extract Pages" },
  { id: "delete-pages",    icon: "🗑️", label: "Delete Pages" },
  { id: "rearrange-pages", icon: "↕️", label: "Rearrange Pages" },
  { id: "rotate-pages",    icon: "🔄", label: "Rotate Pages" },
  { id: "duplicate-pages", icon: "📎", label: "Duplicate Pages" },
  { id: "reverse",         icon: "⏪", label: "Reverse Order" },
  { id: "insert-blank",    icon: "➕", label: "Insert Blank Pages" },
  { id: "add-pdf",         icon: "📂", label: "Add PDF to Existing" },
];

export { TOOLS };

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>⚡ StupidPDF</h1>
        <p>PDF Processing Suite</p>
      </div>

      <div className="sidebar-section-label">PDF Tools</div>

      <nav className="sidebar-nav">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            className={`sidebar-item${active === tool.id ? " active" : ""}`}
            onClick={() => onSelect(tool.id)}
          >
            <span className="icon">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
