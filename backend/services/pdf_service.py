import io
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

