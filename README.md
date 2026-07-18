# ⚡ StupidPDF : https://stupid-pdf-opal.vercel.app/

A premium, full-stack PDF processing web app built with **React + Vite** (frontend) and **Python FastAPI** (backend).

## Features

| Tool | Description |
|------|-------------|
| 🔗 Merge PDFs | Combine multiple PDFs into one |
| ✂️ Split PDF | Split at any page number |
| 🗜️ Compress PDF | Reduce file size |
| 📋 Extract Pages | Pull out specific pages |
| 🗑️ Delete Pages | Remove specific pages |
| ↕️ Rearrange Pages | Drag & drop to reorder |
| 🔄 Rotate Pages | Rotate pages 90°/180°/270° |
| 📎 Duplicate Pages | Duplicate specific pages |
| ⏪ Reverse Order | Flip the entire page order |
| ➕ Insert Blank Pages | Insert blank pages at any position |
| 📂 Add PDF to Existing | Insert a PDF into another |

## Project Structure

```
stupid-pdf/
├── backend/
│   ├── main.py              # FastAPI app + CORS
│   ├── requirements.txt
│   ├── routes/
│   │   └── pdf_routes.py    # 11 API endpoints
│   └── services/
│       └── pdf_service.py   # Core PDF logic (PyPDF2)
└── frontend/
    ├── index.html
    ├── package.json
    └── src/
        ├── App.jsx
        ├── index.css        # Design system
        ├── api/pdf.js       # Axios API client
        └── components/
            ├── FileUpload.jsx
            ├── Sidebar.jsx
            └── ToolPage.jsx
```

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
# API running at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```
