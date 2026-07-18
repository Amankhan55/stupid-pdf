# ⚡ StupidPDF

> **Live Web App:** [https://stupid-pdf-opal.vercel.app/](https://stupid-pdf-opal.vercel.app/)

A premium, full-stack PDF utility web application built with **React 18 + Vite** on the frontend and **Python FastAPI + PyMuPDF** on the backend. Designed with a sleek, dark-mode glassmorphic interface, stateless in-memory execution, and real-time interactive canvas previews.

---

## ✨ Features & PDF Tool Suite

### 📄 PDF Processing & Organization
| Tool | Status | Description |
|---|---|---|
| 🔗 **Merge PDFs** | 🟢 Active | Combine multiple PDF files in custom order into one document |
| ✂️ **Split PDF** | 🟢 Active | Divide a document at specified page numbers into separate files or ZIP |
| 🗜️ **Compress PDF** | 🟢 Active | Optimize file size with 3 compression levels (Low, Medium, High) |
| 📋 **Extract Pages** | 🟢 Active | Pull out specific page numbers into a new PDF document |
| 🗑️ **Delete Pages** | 🟢 Active | Permanently remove unwanted pages from a PDF |
| ↕️ **Rearrange Pages** | 🟢 Active | Visually reorder pages via drag-and-drop interface |
| 🔄 **Rotate Pages** | 🟢 Active | Rotate individual or all pages by 90°, 180°, or 270° |
| 📎 **Duplicate Pages** | 🟢 Active | Duplicate specific pages multiple times in sequence |
| ⏪ **Reverse Order** | 🟢 Active | Flip page order so the last page becomes the first |
| ➕ **Insert Blank Pages** | 🟢 Active | Surgically insert blank pages at any page position |
| 📂 **Add PDF to Existing** | 🟢 Active | Insert an entire PDF document into another at a specified page position |

### ✍️ PDF Editing & Enhancement
| Tool | Status | Description |
|---|---|---|
| 💧 **Add Watermark** | 🟢 Active | Overlay diagonal text watermarks with custom opacity, angle, font size & color picker |
| 🔢 **Add Page Numbers** | 🟢 Active | Auto-stamp page numbers in 6 header/footer positions with custom prefix & start # |
| ✍️ **Add Signature** | 🟢 Active | Draw signature with color palette & thickness slider OR upload image, with **live PDF page preview** |
| 🖍 **Annotate PDF** | 🟡 Coming Soon | Add highlight overlays and text notes visually directly on the live PDF page |

### 🔒 Security & Privacy
| Tool | Status | Description |
|---|---|---|
| 🔒 **Protect PDF** | 🟢 Active | Encrypt PDFs with AES-256 password protection |
| 🔓 **Unlock PDF** | 🟢 Active | Remove user & owner password protection from encrypted PDFs |

### 🔄 Conversions & Utilities
| Tool | Status | Description |
|---|---|---|
| 🖼️ **PDF to Images** | 🟢 Active | Render PDF pages as PNG or JPG images packaged in a ZIP |
| 🖼️ **Images to PDF** | 🟢 Active | Combine JPG/PNG images into a single formatted PDF |
| 📝 **Word to PDF** | 🟢 Active | Convert `.docx` Microsoft Word documents to clean PDF format |
| 📝 **Extract Text** | 🟢 Active | Extract all readable document text into a downloadable `.txt` file |
| 🖼️ **Extract Images** | 🟢 Active | Extract all embedded images into a `.zip` archive |
| 📊 **PDF to Excel** | 🟡 Coming Soon | Extract document table structures into an editable `.xlsx` spreadsheet |
| 📝 **PDF to Word** | 🟡 Coming Soon | Convert PDF documents back into editable `.docx` Word files |

---

## 🚀 Key User Experience Innovations

* 🎯 **Animated Progress Bar with Real-time Percentage:** Visual feedback during processing with Axios upload progress tracking (0-50%) + smooth simulated server processing (50-90%) snapping to 100% on completion with glowing neon indicators.
* 📍 **Live PDF Page Preview (`pdfjs-dist`):** High-fidelity canvas rendering of actual uploaded PDF pages in browser. Click or drag to position signatures directly over document text.
* ✍️ **Custom Signature Canvas:** Interactive draw pad featuring 6 preset color swatches, a custom color picker, stroke thickness slider (1-8px), and a real-time pen tip preview dot.
* 📂 **Header Smart File Upload:** Header CTA button opens native browser file dialog and routes selected single or multiple files straight into active tools.
* 🎨 **Glassmorphism Design System:** Tailored HSL dark-mode theme, sleek neon accents (`#14F195`, `#00C9FF`, `#9B6DFF`), subtle micro-animations, and responsive layout for mobile and desktop.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Custom Vanilla CSS Design System (CSS Variables, Flexbox/Grid, Animations)
- **HTTP Client:** Axios (with `onUploadProgress` handler)
- **PDF Rendering:** `pdfjs-dist` (HTML5 Canvas PDF Page Renderer)
- **Icons:** Custom SVG Icon Components

### Backend
- **Framework:** Python FastAPI (ASGI server via Uvicorn)
- **PDF Core Engines:** PyMuPDF (`fitz`), PyPDF2
- **Office Conversion & Parsing:** `mammoth`, `xhtml2pdf`, `pdfplumber`, `openpyxl`
- **Image Processing:** Pillow (`PIL`)

---

## 📁 Repository Structure

```
stupid-pdf/
├── backend/
│   ├── main.py                   # FastAPI application & CORS configuration
│   ├── requirements.txt          # Python dependencies
│   ├── routes/
│   │   └── pdf_routes.py         # API Endpoints (20+ routes)
│   └── services/
│       └── pdf_service.py        # Service layer (PyMuPDF, PyPDF2 logic)
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx               # Root application router & layout
        ├── index.css             # Core design system tokens & styles
        ├── api/
        │   └── pdf.js            # Frontend API client
        └── components/
            ├── Navbar.jsx        # Glass top navigation bar
            ├── Sidebar.jsx       # Categorized tool navigation sidebar
            ├── HomePage.jsx      # Hero dashboard & tool card grid
            ├── ToolPage.jsx      # Main tool execution container & previews
            ├── FileUpload.jsx    # Drag-and-drop file upload zone
            └── Icons.jsx         # Custom SVG icon set
```

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI dev server
python main.py
```
* Backend API will run at: `http://localhost:8000`
* Interactive API Documentation (Swagger): `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```
* Frontend app will run at: `http://localhost:5173`

---

## 🛡️ Privacy & Security

StupidPDF operates on a **stateless, privacy-first principle**:
- All operations process data in-memory (`io.BytesIO`) without writing temporary files to server disk.
- Zero tracking, zero file storage, and zero user data logging.
- Uploaded files are discarded immediately upon streaming the result back to the client.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
