# Stupid PDF — PDF Conversion Features

This plan outlines the design and integration of 4 new document conversion tools.

## Proposed Tech Stack additions

| Feature | Backend Library | Strategy |
|---------|-----------------|----------|
| **PDF to Images** | `pymupdf` (fitz) | Render each page as a Pixmap image at 150 DPI. Pack PNG/JPG files into a single download ZIP. |
| **Images to PDF** | `Pillow` (PIL) | Convert image files (PNG/JPG) to RGB and save them sequentially into a single PDF document. |
| **Word to PDF** | `mammoth` + `xhtml2pdf` | Convert `.docx` structure into HTML using `mammoth`, then compile the HTML layout into PDF using `xhtml2pdf`. Completely cross-platform and stateless (no Microsoft Word or LibreOffice needed). |
| **PDF to Word** | `pdf2docx` | Parse PDF structures, extract text/images/tables, and save them to a `.docx` file using temporary file buffers. |

---

## Proposed Changes

### Backend — Python FastAPI

#### [MODIFY] [requirements.txt](file:///Users/amanullakhan/Developer/stupid-pdf/backend/requirements.txt)
Add dependencies:
- `pymupdf`
- `pdf2docx`
- `mammoth`
- `xhtml2pdf`
- `python-docx`

#### [MODIFY] [services/pdf_service.py](file:///Users/amanullakhan/Developer/stupid-pdf/backend/services/pdf_service.py)
Add conversion functions:
- `pdf_to_images(pdf_bytes, format="png") -> List[Tuple[str, bytes]]` (returns names and byte contents of images)
- `images_to_pdf(image_bytes_list: List[bytes]) -> bytes`
- `word_to_pdf(docx_bytes: bytes) -> bytes`
- `pdf_to_word(pdf_bytes: bytes) -> bytes`

#### [MODIFY] [routes/pdf_routes.py](file:///Users/amanullakhan/Developer/stupid-pdf/backend/routes/pdf_routes.py)
Add endpoints:
- `POST /api/pdf-to-images` (Accepts optional format: `png`/`jpg`, returns ZIP)
- `POST /api/images-to-pdf` (Accepts multiple image files, returns PDF)
- `POST /api/word-to-pdf` (Accepts docx file, returns PDF)
- `POST /api/pdf-to-word` (Accepts PDF file, returns docx)

---

### Frontend — React + Vite

#### [MODIFY] [src/components/Icons.jsx](file:///Users/amanullakhan/Developer/stupid-pdf/frontend/src/components/Icons.jsx)
Add custom SVG icons:
- `PdfToImageIcon`
- `ImageToPdfIcon`
- `WordToPdfIcon`
- `PdfToWordIcon`

#### [MODIFY] [src/components/Sidebar.jsx](file:///Users/amanullakhan/Developer/stupid-pdf/frontend/src/components/Sidebar.jsx)
Add the 4 tools into the `TOOLS` list sidebar menu.

#### [MODIFY] [src/api/pdf.js](file:///Users/amanullakhan/Developer/stupid-pdf/frontend/src/api/pdf.js)
Implement Axios routes:
- `pdfToImages(file, format, filename)`
- `imagesToPdf(files, filename)`
- `wordToPdf(file, filename)`
- `pdfToWord(file, filename)`

#### [MODIFY] [src/components/ToolPage.jsx](file:///Users/amanullakhan/Developer/stupid-pdf/frontend/src/components/ToolPage.jsx)
- Update `TOOL_META` definitions.
- Update `FileUpload` upload configurations:
  - `images-to-pdf` tool accepts multiple image files (`image/*`) instead of PDFs.
  - `word-to-pdf` tool accepts `.docx` files instead of PDFs.
- Update `handleSubmit()` to route API requests to the corresponding helper functions.
- Update `renderControls()` to display the format selector (PNG vs JPG) for the PDF to Images tool.

---

## Verification Plan

### Automated Build Checks
- Run `npm run build` inside `frontend/` to confirm compiling is clean.

### Manual Verification
- **PDF to Images**: Convert a 2-page PDF and verify a ZIP file containing `page_1.png` and `page_2.png` is generated.
- **Images to PDF**: Upload two JPG images and verify they are correctly merged into a single multi-page PDF document.
- **Word to PDF**: Upload a `.docx` file and verify it downloads as a styled PDF.
- **PDF to Word**: Convert a PDF and verify it opens correctly in Word/Pages as editable text.
