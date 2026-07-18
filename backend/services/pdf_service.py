import io
import json
import zipfile
from typing import List
import PyPDF2


def merge_pdfs(pdf_bytes_list: List[bytes]) -> bytes:
    """Merge multiple PDFs into one."""
    writer = PyPDF2.PdfWriter()
    for pdf_bytes in pdf_bytes_list:
        reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        for page in reader.pages:
            writer.add_page(page)
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def split_pdf(pdf_bytes: bytes, split_at: List[int]) -> List[bytes]:
    """
    Split PDF at given page numbers (1-indexed).
    Returns a list of PDF byte strings.
    split_at=[3, 6] on a 9-page doc → [pages 1-2], [pages 3-5], [pages 6-9]
    """
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    total = len(reader.pages)

    # Build split boundaries (0-indexed start of each chunk)
    boundaries = [0] + [p - 1 for p in sorted(split_at) if 0 < p <= total] + [total]
    boundaries = sorted(set(boundaries))

    result = []
    for i in range(len(boundaries) - 1):
        start = boundaries[i]
        end = boundaries[i + 1]
        writer = PyPDF2.PdfWriter()
        for idx in range(start, end):
            writer.add_page(reader.pages[idx])
        out = io.BytesIO()
        writer.write(out)
        result.append(out.getvalue())
    return result


def compress_pdf(pdf_bytes: bytes, level: str = "medium") -> bytes:
    """
    Compress PDF at one of three levels using only PyPDF2 3.0.1 APIs:
      - "low"    : lossless rewrite — just copying pages strips unused/orphan
                   objects that accumulate in edited PDFs.
      - "medium" : low + strip embedded links and JavaScript.
      - "high"   : medium + zlib-compress every page's content stream.
    """
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    writer = PyPDF2.PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    if level in ("medium", "high"):
        # Remove links (reduces cross-reference table bloat)
        try:
            writer.remove_links()
        except Exception:
            pass

    if level == "high":
        # Compress each page's content stream with zlib
        for page in writer.pages:
            try:
                page.compress_content_streams()
            except Exception:
                pass  # skip pages whose streams can't be recompressed

    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def extract_pages(pdf_bytes: bytes, pages: List[int]) -> bytes:
    """Extract specific pages (1-indexed) from PDF."""
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    writer = PyPDF2.PdfWriter()
    total = len(reader.pages)
    for p in pages:
        idx = p - 1
        if 0 <= idx < total:
            writer.add_page(reader.pages[idx])
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def delete_pages(pdf_bytes: bytes, pages: List[int]) -> bytes:
    """Delete specific pages (1-indexed) from PDF."""
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    writer = PyPDF2.PdfWriter()
    total = len(reader.pages)
    pages_to_delete = set(p - 1 for p in pages)
    for idx in range(total):
        if idx not in pages_to_delete:
            writer.add_page(reader.pages[idx])
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def rearrange_pages(pdf_bytes: bytes, new_order: List[int]) -> bytes:
    """
    Rearrange pages in the given order (1-indexed).
    new_order=[3,1,2] → page 3 becomes first, page 1 second, page 2 third.
    """
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    writer = PyPDF2.PdfWriter()
    total = len(reader.pages)
    for p in new_order:
        idx = p - 1
        if 0 <= idx < total:
            writer.add_page(reader.pages[idx])
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def rotate_pages(pdf_bytes: bytes, pages: List[int], angle: int) -> bytes:
    """
    Rotate specific pages (1-indexed) by angle (90, 180, 270).
    If pages is empty, rotates all pages.
    """
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    writer = PyPDF2.PdfWriter()
    total = len(reader.pages)
    pages_to_rotate = set(p - 1 for p in pages) if pages else set(range(total))
    for idx in range(total):
        page = reader.pages[idx]
        if idx in pages_to_rotate:
            page = page.rotate(angle)
        writer.add_page(page)
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def duplicate_pages(pdf_bytes: bytes, pages: List[int], times: int = 1) -> bytes:
    """
    Duplicate specific pages (1-indexed) inserting copies right after each.
    times=1 means each page appears twice total.
    """
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    writer = PyPDF2.PdfWriter()
    total = len(reader.pages)
    pages_to_dup = set(p - 1 for p in pages) if pages else set(range(total))
    for idx in range(total):
        writer.add_page(reader.pages[idx])
        if idx in pages_to_dup:
            for _ in range(times):
                writer.add_page(reader.pages[idx])
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def reverse_page_order(pdf_bytes: bytes) -> bytes:
    """Reverse the page order of a PDF."""
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    writer = PyPDF2.PdfWriter()
    for page in reversed(reader.pages):
        writer.add_page(page)
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def insert_blank_pages(pdf_bytes: bytes, positions: List[int]) -> bytes:
    """
    Insert blank pages before the given positions (1-indexed).
    position=1 inserts a blank page at the very beginning.
    position=total+1 appends a blank page at the end.
    """
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    total = len(reader.pages)

    # Get dimensions from first page for blank page sizing
    first_page = reader.pages[0]
    width = float(first_page.mediabox.width)
    height = float(first_page.mediabox.height)

    writer = PyPDF2.PdfWriter()

    # We insert blank pages by building the new sequence
    insert_before = set(p - 1 for p in positions)  # 0-indexed insertion points
    # Also handle appending (position = total + 1)
    append_count = sum(1 for p in positions if p > total)

    for idx in range(total):
        if idx in insert_before:
            writer.add_blank_page(width=width, height=height)
        writer.add_page(reader.pages[idx])

    for _ in range(append_count):
        writer.add_blank_page(width=width, height=height)

    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def add_pdf_to_existing(base_pdf_bytes: bytes, new_pdf_bytes: bytes, position: int) -> bytes:
    """
    Insert new_pdf into base_pdf at the given position (1-indexed).
    position=1 → insert at beginning.
    position=total+1 → append at end.
    """
    base_reader = PyPDF2.PdfReader(io.BytesIO(base_pdf_bytes))
    new_reader = PyPDF2.PdfReader(io.BytesIO(new_pdf_bytes))
    writer = PyPDF2.PdfWriter()

    total = len(base_reader.pages)
    insert_at = max(0, min(position - 1, total))

    # Pages before insertion point
    for idx in range(insert_at):
        writer.add_page(base_reader.pages[idx])

    # Inserted PDF pages
    for page in new_reader.pages:
        writer.add_page(page)

    # Remaining base pages
    for idx in range(insert_at, total):
        writer.add_page(base_reader.pages[idx])

    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def get_pdf_info(pdf_bytes: bytes) -> dict:
    """Return basic info about a PDF (page count, etc.)."""
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    first_page = reader.pages[0] if reader.pages else None
    return {
        "page_count": len(reader.pages),
        "width": float(first_page.mediabox.width) if first_page else 0,
        "height": float(first_page.mediabox.height) if first_page else 0,
    }


def pdf_to_images(pdf_bytes: bytes, image_format: str = "png") -> List[tuple]:
    """
    Convert all pages of a PDF to images.
    Returns a list of tuples containing (filename, image_bytes).
    """
    import fitz  # PyMuPDF
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    image_list = []

    for i in range(len(doc)):
        page = doc.load_page(i)
        pix = page.get_pixmap(dpi=150)
        img_bytes = pix.tobytes(image_format)
        image_list.append((f"page_{i+1}.{image_format}", img_bytes))

    return image_list


def images_to_pdf(image_bytes_list: List[bytes]) -> bytes:
    """Convert a list of images to a single combined PDF."""
    from PIL import Image
    images = []

    for img_bytes in image_bytes_list:
        img = Image.open(io.BytesIO(img_bytes))
        # Ensure conversion to RGB format so it fits in PDF standard
        if img.mode != "RGB":
            img = img.convert("RGB")
        images.append(img)

    if not images:
        raise ValueError("At least one image is required.")

    output = io.BytesIO()
    # Save all images merged sequentially into a single PDF stream
    images[0].save(output, format="PDF", save_all=True, append_images=images[1:])
    return output.getvalue()


def word_to_pdf(docx_bytes: bytes) -> bytes:
    """Convert .docx file bytes to a styled PDF using mammoth & xhtml2pdf."""
    import mammoth
    from xhtml2pdf import pisa

    # Convert DOCX layout markup to clean HTML
    result = mammoth.convert_to_html(io.BytesIO(docx_bytes))
    html_content = result.value

    # We xhtml2pdf compile the HTML markup to PDF stream
    pdf_io = io.BytesIO()
    pisa_status = pisa.CreatePDF(html_content, dest=pdf_io)
    
    if pisa_status.err:
        raise RuntimeError("Failed to convert HTML template layout to PDF.")

    return pdf_io.getvalue()


def unlock_pdf(pdf_bytes: bytes, password: str = "") -> bytes:
    """
    Remove password protection from an encrypted PDF.
    Tries the provided password first, then an empty string as owner password.
    Returns the decrypted PDF bytes.
    Raises ValueError if the PDF is not encrypted or the password is incorrect.
    """
    reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))

    if not reader.is_encrypted:
        raise ValueError("This PDF is not password-protected.")

    # Try decrypting with the provided password; PyPDF2 tries both user & owner
    result = reader.decrypt(password)
    if result == 0:
        raise ValueError("Incorrect password. Please provide the correct PDF password.")

    # Re-write all pages to a new writer — this strips the encryption entirely
    writer = PyPDF2.PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def pdf_to_word(pdf_bytes: bytes) -> bytes:
    """Convert PDF to editable .docx Word file using pdf2docx."""
    import tempfile
    import os
    from pdf2docx import Converter

    # Write PDF stream to named temp file for pdf2docx converter utility
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_in:
        temp_in.write(pdf_bytes)
        pdf_path = temp_in.name

    docx_path = pdf_path.replace(".pdf", ".docx")

    try:
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()

        with open(docx_path, "rb") as f:
            docx_bytes = f.read()

        return docx_bytes
    finally:
        # Clean up both temporary files from the server OS disk
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        if os.path.exists(docx_path):
            os.remove(docx_path)


# ─── NEW FEATURES ─────────────────────────────────────────────────────────────


def protect_pdf(pdf_bytes: bytes, password: str) -> bytes:
    """
    Encrypt a PDF with AES-256 password protection using PyMuPDF.
    Both user and owner password are set to the provided password.
    """
    import fitz
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    output = io.BytesIO()
    doc.save(
        output,
        encryption=fitz.PDF_ENCRYPT_AES_256,
        user_pw=password,
        owner_pw=password,
        permissions=int(
            fitz.PDF_PERM_ACCESSIBILITY
            | fitz.PDF_PERM_PRINT
            | fitz.PDF_PERM_COPY
            | fitz.PDF_PERM_ANNOTATE
        ),
    )
    return output.getvalue()


def add_watermark(
    pdf_bytes: bytes,
    text: str,
    opacity: float = 0.3,
    angle: float = 45.0,
    font_size: int = 48,
    color: tuple = (0.6, 0.6, 0.6),
) -> bytes:
    """
    Overlay diagonal text watermark on every page of a PDF.
    opacity: 0.0 (invisible) to 1.0 (opaque)
    angle: rotation angle in degrees (any value, not just multiples of 90)
    color: RGB tuple, each 0.0–1.0

    Uses fitz.TextWriter + rotation matrix instead of insert_text(rotate=...)
    because insert_text only accepts 0, 90, 180, 270 for the rotate parameter.
    """
    import fitz
    import math

    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    for page in doc:
        rect = page.rect
        cx = rect.width / 2
        cy = rect.height / 2

        # Build the text writer and measure the text bounding box at origin
        tw_measure = fitz.TextWriter(rect)
        font = fitz.Font("helv")
        tw_measure.append((0, 0), text, font=font, fontsize=font_size)
        text_rect = tw_measure.text_rect
        tw_w = text_rect.width
        tw_h = abs(text_rect.height)

        # Place baseline origin so the text block is visually centered on the page
        # In PyMuPDF, y increases downward; text baseline is at the y coordinate given.
        origin_x = cx - tw_w / 2
        origin_y = cy + tw_h / 4  # slight upward shift to visually center

        # Build the real TextWriter with opacity
        tw = fitz.TextWriter(rect)
        tw.append((origin_x, origin_y), text, font=font, fontsize=font_size)

        # Build a rotation matrix for arbitrary angle around the page center
        rad = math.radians(angle)
        cos_a = math.cos(rad)
        sin_a = math.sin(rad)
        rot_matrix = fitz.Matrix(cos_a, sin_a, -sin_a, cos_a, 0, 0)

        # write_text with morph=(pivot, matrix) rotates text around pivot.
        # color and opacity are valid kwargs on write_text, NOT on append().
        tw.write_text(page, color=color, opacity=opacity, morph=(fitz.Point(cx, cy), rot_matrix))


    output = io.BytesIO()
    doc.save(output)
    return output.getvalue()



def add_page_numbers(
    pdf_bytes: bytes,
    position: str = "bottom-center",
    font_size: int = 10,
    start_number: int = 1,
    prefix: str = "Page",
) -> bytes:
    """
    Stamp page numbers on every page of the PDF.
    position: 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right'
    """
    import fitz
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    margin = 28

    for i, page in enumerate(doc):
        label = f"{prefix} {i + start_number}" if prefix else str(i + start_number)
        rect = page.rect
        text_width = len(label) * font_size * 0.55  # approximate

        if "bottom" in position:
            y = rect.height - margin
        else:
            y = margin + font_size

        if "center" in position:
            x = (rect.width - text_width) / 2
        elif "left" in position:
            x = margin
        else:
            x = rect.width - text_width - margin

        page.insert_text(
            fitz.Point(x, y),
            label,
            fontsize=font_size,
            color=(0.2, 0.2, 0.2),
            overlay=True,
        )

    output = io.BytesIO()
    doc.save(output)
    return output.getvalue()


def extract_text(pdf_bytes: bytes) -> str:
    """Extract all text from a PDF and return as a plain string."""
    import fitz
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text_parts = []
    for i, page in enumerate(doc):
        text_parts.append(f"--- Page {i + 1} ---\n")
        text_parts.append(page.get_text("text"))
        text_parts.append("\n")
    return "\n".join(text_parts)


def extract_images_from_pdf(pdf_bytes: bytes) -> List[tuple]:
    """
    Extract all embedded images from a PDF.
    Returns a list of (filename, image_bytes) tuples for ZIP packaging.
    """
    import fitz
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    images = []
    img_count = 0

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        image_list = page.get_images(full=True)

        for img_index, img_info in enumerate(image_list):
            xref = img_info[0]
            try:
                base_image = doc.extract_image(xref)
                img_bytes = base_image["image"]
                img_ext = base_image["ext"]
                img_count += 1
                filename = f"page{page_num + 1}_img{img_index + 1}.{img_ext}"
                images.append((filename, img_bytes))
            except Exception:
                continue

    if not images:
        raise ValueError("No images found in this PDF.")

    return images


def pdf_to_excel(pdf_bytes: bytes) -> bytes:
    """
    Extract tables from a PDF and write to an .xlsx file.
    Uses pdfplumber for table extraction and openpyxl for Excel writing.
    """
    import pdfplumber
    from openpyxl import Workbook

    wb = Workbook()
    wb.remove(wb.active)  # Remove default empty sheet
    sheet_count = 0

    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page_num, page in enumerate(pdf.pages):
            tables = page.extract_tables()
            if not tables:
                continue

            for table_idx, table in enumerate(tables):
                sheet_count += 1
                ws = wb.create_sheet(title=f"P{page_num + 1}_T{table_idx + 1}")
                for row in table:
                    ws.append([cell if cell is not None else "" for cell in row])

    if sheet_count == 0:
        # If no tables found, extract text into a single sheet
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            ws = wb.create_sheet(title="Extracted Text")
            for page_num, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                ws.append([f"--- Page {page_num + 1} ---"])
                for line in text.split("\n"):
                    ws.append([line])
                ws.append([""])

    output = io.BytesIO()
    wb.save(output)
    return output.getvalue()


def add_signature(
    pdf_bytes: bytes,
    sig_image_bytes: bytes,
    page_num: int = 1,
    x: float = 100.0,
    y: float = 100.0,
    width: float = 200.0,
    height: float = 80.0,
) -> bytes:
    """
    Embed a signature image onto a specific page of the PDF.
    page_num: 1-indexed page number
    x, y: top-left corner position in PDF points
    width, height: size of signature in PDF points
    """
    import fitz
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    total = len(doc)
    page_idx = max(0, min(page_num - 1, total - 1))
    page = doc.load_page(page_idx)

    rect = fitz.Rect(x, y, x + width, y + height)
    page.insert_image(rect, stream=sig_image_bytes)

    output = io.BytesIO()
    doc.save(output)
    return output.getvalue()


def annotate_pdf(pdf_bytes: bytes, annotations: list) -> bytes:
    """
    Add annotations to a PDF.
    Each annotation is a dict with:
      - type: 'highlight' | 'text'
      - page: 1-indexed page number
      - x, y: position in PDF points
      - For 'highlight': x2, y2 (end of highlight rect), color (hex string)
      - For 'text': content (string), width, height
    """
    import fitz
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    def hex_to_rgb(hex_color: str) -> tuple:
        """Convert '#rrggbb' or 'rrggbb' to (r, g, b) floats 0..1."""
        hex_color = hex_color.lstrip("#")
        if len(hex_color) == 3:
            hex_color = "".join(c * 2 for c in hex_color)
        r = int(hex_color[0:2], 16) / 255
        g = int(hex_color[2:4], 16) / 255
        b = int(hex_color[4:6], 16) / 255
        return (r, g, b)

    total = len(doc)

    for ann in annotations:
        page_num = int(ann.get("page", 1))
        page_idx = max(0, min(page_num - 1, total - 1))
        page = doc.load_page(page_idx)
        ann_type = ann.get("type", "text")
        x = float(ann.get("x", 50))
        y = float(ann.get("y", 50))

        if ann_type == "highlight":
            x2 = float(ann.get("x2", x + 200))
            y2 = float(ann.get("y2", y + 20))
            color_hex = ann.get("color", "#FFFF00")
            rgb = hex_to_rgb(color_hex)
            rect = fitz.Rect(x, y, x2, y2)
            highlight = page.add_highlight_annot(rect)
            highlight.set_colors(stroke=rgb)
            highlight.update()

        elif ann_type == "text":
            content = ann.get("content", "")
            ann_width = float(ann.get("width", 200))
            ann_height = float(ann.get("height", 60))
            color_hex = ann.get("color", "#FFD700")
            rgb = hex_to_rgb(color_hex)
            rect = fitz.Rect(x, y, x + ann_width, y + ann_height)
            text_ann = page.add_freetext_annot(
                rect,
                content,
                fontsize=10,
                text_color=(0, 0, 0),
                fill_color=rgb,
                border_color=(0.5, 0.5, 0.5),
            )
            text_ann.update()

    output = io.BytesIO()
    doc.save(output)
    return output.getvalue()
