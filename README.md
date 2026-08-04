# ⚡ StupidPDF

> **Stupidly Simple. Blazingly Fast.**
> *No accounts. No subscriptions. No stored files. Just instant PDF tools powered by a zero-storage processing engine.*

[![AGPL-3.0 License](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Live App](https://img.shields.io/badge/Live%20App-stupidpdf.live-14F195)](https://stupid-pdf-opal.vercel.app/)

**Live Web App:** [https://stupid-pdf-opal.vercel.app/](https://stupid-pdf-opal.vercel.app/)

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

* 🎯 **Animated Progress Bar with Real-time Percentage:** Visual feedback during processing with Axios upload progress tracking (0–50%) + smooth simulated server processing (50–90%) snapping to 100% on completion with glowing neon indicators.
* 📍 **Live PDF Page Preview (`pdfjs-dist`):** High-fidelity canvas rendering of actual uploaded PDF pages in browser. Click or drag to position signatures directly over document text.
* ✍️ **Custom Signature Canvas:** Interactive draw pad featuring 6 preset color swatches, a custom color picker, stroke thickness slider (1–8px), and a real-time pen tip preview dot.
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
- **Rate Limiting:** SlowAPI

---

## 📁 Repository Structure

```
stupid-pdf/
├── backend/
│   ├── main.py                   # FastAPI application & CORS configuration
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment variable template (copy to .env)
│   ├── routes/
│   │   ├── pdf_routes.py         # PDF tool API endpoints (20+ routes)
│   │   └── contact_routes.py     # Contact form endpoint
│   └── services/
│       ├── pdf_service.py        # PDF processing logic (PyMuPDF, PyPDF2)
│       └── email_service.py      # Contact form email delivery (Gmail SMTP)
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx               # Root application router & layout
        ├── index.css             # Core design system tokens & styles
        ├── api/
        │   ├── pdf.js            # PDF API client
        │   └── contact.js        # Contact API client
        └── components/
            ├── Navbar.jsx        # Glass top navigation bar
            ├── Sidebar.jsx       # Categorized tool navigation sidebar
            ├── HomePage.jsx      # Hero dashboard & tool card grid
            ├── ToolPage.jsx      # Main tool execution container & previews
            ├── FileUpload.jsx    # Drag-and-drop file upload zone
            ├── ContactPage.jsx   # Contact form page
            ├── PrivacyPolicy.jsx # Privacy policy page
            └── Icons.jsx         # Custom SVG icon set
```

---

## 💻 Local Setup & Installation

### Prerequisites
- **Node.js** v18+
- **Python** v3.10+

### 1. Clone the Repository

```bash
git clone https://github.com/Amankhan55/stupid-pdf.git
cd stupid-pdf
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section below)

# Start the FastAPI backend server
python main.py
```

* Backend API: `http://localhost:8000`
* Interactive Swagger Docs: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install npm dependencies
npm install

# Start the Vite dev server
npm run dev
```

* Frontend app: `http://localhost:5173`

---

## 🔧 Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in values:

```env
# Gmail address used to send contact form emails
GMAIL_ADDRESS=your-email@gmail.com

# Gmail App Password (NOT your account password)
# Generate at: https://myaccount.google.com/apppasswords (requires 2FA)
GMAIL_APP_PASSWORD=your-app-password

# Allowed frontend origins for CORS (comma-separated, defaults to * if unset)
ALLOWED_ORIGINS=http://localhost:5173

# Set to "true" to enable uvicorn auto-reload in development
DEBUG=true
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 🛡️ Privacy & Security

StupidPDF operates on a **stateless, privacy-first principle**:
- All operations process data in-memory (`io.BytesIO`) — no files are written to the server disk.
- Zero tracking, zero file storage, and zero user data logging.
- Uploaded files are discarded immediately upon streaming the result back to the client.
- Rate limiting is enforced on all API endpoints to prevent abuse.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feat/your-feature-name`
5. Open a Pull Request.

---

## 📄 License

The source code is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See [LICENSE](LICENSE) for the full text.

> ⚠️ **Brand Assets Notice:** The name "StupidPDF", the logo, icons, screenshots, and other brand assets are **not** covered by the AGPL license and may not be used without prior written permission. See [NOTICE.md](NOTICE.md) for details.

---

## 💬 Contact & Support

Found a bug or have a feature request? [Open an issue](https://github.com/Amankhan55/stupid-pdf/issues) or use the [Contact page](https://stupid-pdf-opal.vercel.app/contact) on the live app.
