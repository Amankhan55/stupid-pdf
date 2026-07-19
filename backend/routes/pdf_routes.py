import io
import json
import logging
import zipfile
from typing import List, Optional
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import StreamingResponse

from services import pdf_service

router = APIRouter(prefix="/api")
logger = logging.getLogger("pdf_routes")


def _pdf_response(data: bytes, filename: str = "output.pdf") -> StreamingResponse:
    return StreamingResponse(
        io.BytesIO(data),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


def _zip_response(pdf_list: List[bytes], base_filename: str = "split") -> StreamingResponse:
    """Return multiple PDFs packed in a ZIP."""
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for i, pdf_bytes in enumerate(pdf_list, start=1):
            zf.writestr(f"{base_filename}_part_{i}.pdf", pdf_bytes)
    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{base_filename}.zip"'},
    )


def _zip_files_response(files_list: List[tuple], zip_name: str) -> StreamingResponse:
    """Return multiple files of any type packed in a ZIP."""
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for name, data in files_list:
            zf.writestr(name, data)
    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{zip_name}"'},
    )


def _server_error(operation: str, e: Exception):
    """Log the real exception server-side; never leak internals to the client."""
    logger.exception("Unexpected error while trying to %s", operation)
    raise HTTPException(status_code=500, detail=f"Failed to {operation}. Please check your file(s) and try again.")


def _parse_page_list(raw: str, field_name: str = "pages") -> List[int]:
    """Parse a comma-separated list of page numbers, e.g. '1, 3, 5' -> [1, 3, 5]."""
    try:
        return [int(p.strip()) for p in raw.split(",") if p.strip()]
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f'Invalid "{field_name}": must be comma-separated page numbers, e.g. "1,3,5".',
        )


MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024       # 50 MB
MAX_DOCX_SIZE_BYTES = 20 * 1024 * 1024      # 20 MB
MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024     # 15 MB
MAX_MERGE_FILE_SIZE = 25 * 1024 * 1024      # 25 MB
MAX_SIGNATURE_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB
MAX_IMAGES_TO_PDF_FILES = 25

def validate_file_bytes(file_bytes: bytes, filename: str, max_size: int = MAX_PDF_SIZE_BYTES, allowed_exts: list = ["pdf"]):
    """Validate file size and extension on backend."""
    if len(file_bytes) > max_size:
        max_mb = int(max_size / (1024 * 1024))
        size_mb = len(file_bytes) / (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f'File "{filename}" ({size_mb:.1f} MB) exceeds maximum limit of {max_mb} MB.'
        )
    ext = filename.split(".")[-1].lower() if filename and "." in filename else ""
    if allowed_exts and ext not in allowed_exts:
        exts_str = ", ".join([f".{e}" for e in allowed_exts])
        raise HTTPException(
            status_code=400,
            detail=f'Invalid file format for "{filename}". Allowed formats: {exts_str}.'
        )


# ─── Info ──────────────────────────────────────────────────────────────────────

@router.post("/info")
async def get_info(file: UploadFile = File(...)):
    """Return page count and dimensions for a PDF."""
    data = await file.read()
    validate_file_bytes(data, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        return pdf_service.get_pdf_info(data)
    except Exception as e:
        logger.warning("Could not read PDF info for %s: %s", file.filename, e)
        raise HTTPException(status_code=400, detail="Could not read this PDF. Make sure it's a valid, non-corrupted file.")


# ─── Merge ─────────────────────────────────────────────────────────────────────

@router.post("/merge")
async def merge(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files are required to merge.")
    if len(files) > 20:
        raise HTTPException(status_code=400, detail="Maximum 20 files allowed for PDF Merge.")
    pdf_bytes_list = []
    for f in files:
        data = await f.read()
        validate_file_bytes(data, f.filename, MAX_MERGE_FILE_SIZE, ["pdf"])
        pdf_bytes_list.append(data)
    try:
        result = pdf_service.merge_pdfs(pdf_bytes_list)
        return _pdf_response(result, "merged.pdf")
    except Exception as e:
        _server_error("merge PDF files", e)


# ─── Split ─────────────────────────────────────────────────────────────────────

@router.post("/split")
async def split(
    file: UploadFile = File(...),
    split_at: str = Form(...),  # comma-separated page numbers e.g. "3,6"
):
    pages = _parse_page_list(split_at, "split_at")
    data = await file.read()
    validate_file_bytes(data, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        parts = pdf_service.split_pdf(data, pages)
        if len(parts) == 1:
            return _pdf_response(parts[0], "split.pdf")
        return _zip_response(parts, "split")
    except Exception as e:
        _server_error("split PDF", e)

# ─── Compress ──────────────────────────────────────────────────────────────────

@router.post("/compress")
async def compress(
    file: UploadFile = File(...),
    level: str = Form("medium"),  # "low", "medium", or "high"
):
    """
    Compress a PDF at three levels:
    - low: lossless structural cleanup (safest)
    - medium: low + deflate streams/fonts/images, strip links (default)
    - high: medium + re-encode embedded images at reduced quality/resolution
    """
    if level not in ("low", "medium", "high"):
        raise HTTPException(status_code=400, detail="level must be 'low', 'medium', or 'high'")
    data = await file.read()
    validate_file_bytes(data, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        original_size = len(data)
        result = pdf_service.compress_pdf(data, level)
        compressed_size = len(result)
        response = _pdf_response(result, "compressed.pdf")
        response.headers["X-Original-Size"] = str(original_size)
        response.headers["X-Compressed-Size"] = str(compressed_size)
        response.headers["Access-Control-Expose-Headers"] = "X-Original-Size, X-Compressed-Size"
        return response
    except Exception as e:
        _server_error("compress PDF", e)


# ─── Extract Pages ─────────────────────────────────────────────────────────────

@router.post("/extract-pages")
async def extract_pages(
    file: UploadFile = File(...),
    pages: str = Form(...),  # comma-separated e.g. "1,3,5"
):
    page_list = _parse_page_list(pages, "pages")
    data = await file.read()
    validate_file_bytes(data, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.extract_pages(data, page_list)
        return _pdf_response(result, "extracted.pdf")
    except Exception as e:
        _server_error("extract pages", e)


# ─── Delete Pages ──────────────────────────────────────────────────────────────

@router.post("/delete-pages")
async def delete_pages(
    file: UploadFile = File(...),
    pages: str = Form(...),  # comma-separated e.g. "2,4"
):
    page_list = _parse_page_list(pages, "pages")
    data = await file.read()
    validate_file_bytes(data, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.delete_pages(data, page_list)
        return _pdf_response(result, "deleted.pdf")
    except Exception as e:
        _server_error("delete pages", e)


# ─── Rearrange Pages ───────────────────────────────────────────────────────────

@router.post("/rearrange-pages")
async def rearrange_pages(
    file: UploadFile = File(...),
    order: str = Form(...),  # comma-separated new order e.g. "3,1,2"
):
    new_order = _parse_page_list(order, "order")
    data = await file.read()
    validate_file_bytes(data, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.rearrange_pages(data, new_order)
        return _pdf_response(result, "rearranged.pdf")
    except Exception as e:
        _server_error("rearrange pages", e)


# ─── Rotate Pages ──────────────────────────────────────────────────────────────

@router.post("/rotate-pages")
async def rotate_pages(
    file: UploadFile = File(...),
    pages: str = Form(""),   # comma-separated; empty = all pages
    angle: int = Form(90),   # 90, 180, or 270
):
    if angle not in (90, 180, 270):
        raise HTTPException(status_code=400, detail="Angle must be 90, 180, or 270.")
    page_list = _parse_page_list(pages, "pages")
    data = await file.read()
    validate_file_bytes(data, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.rotate_pages(data, page_list, angle)
        return _pdf_response(result, "rotated.pdf")
    except Exception as e:
        _server_error("rotate pages", e)


# ─── Duplicate Pages ───────────────────────────────────────────────────────────

@router.post("/duplicate-pages")
async def duplicate_pages(
    file: UploadFile = File(...),
    pages: str = Form(""),   # empty = duplicate all
    times: int = Form(1),
):
    page_list = _parse_page_list(pages, "pages")
    data = await file.read()
    validate_file_bytes(data, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.duplicate_pages(data, page_list, times)
        return _pdf_response(result, "duplicated.pdf")
    except Exception as e:
        _server_error("duplicate pages", e)


# ─── Reverse ───────────────────────────────────────────────────────────────────

@router.post("/reverse")
async def reverse(file: UploadFile = File(...)):
    data = await file.read()
    validate_file_bytes(data, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.reverse_page_order(data)
        return _pdf_response(result, "reversed.pdf")
    except Exception as e:
        _server_error("reverse page order", e)


# ─── Insert Blank Pages ────────────────────────────────────────────────────────

@router.post("/insert-blank")
async def insert_blank(
    file: UploadFile = File(...),
    positions: str = Form(...),  # comma-separated positions e.g. "1,4"
):
    pos_list = _parse_page_list(positions, "positions")
    data = await file.read()
    validate_file_bytes(data, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.insert_blank_pages(data, pos_list)
        return _pdf_response(result, "with_blanks.pdf")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        _server_error("insert blank pages", e)


# ─── Add PDF to Existing ───────────────────────────────────────────────────────

@router.post("/add-pdf")
async def add_pdf(
    base_file: UploadFile = File(...),
    new_file: UploadFile = File(...),
    position: int = Form(...),  # 1-indexed; use page_count+1 to append
):
    base_data = await base_file.read()
    validate_file_bytes(base_data, base_file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    new_data = await new_file.read()
    validate_file_bytes(new_data, new_file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.add_pdf_to_existing(base_data, new_data, position)
        return _pdf_response(result, "combined.pdf")
    except Exception as e:
        _server_error("add PDF to existing file", e)


# ─── PDF Conversions ──────────────────────────────────────────────────────────

@router.post("/pdf-to-images")
async def pdf_to_images_route(
    file: UploadFile = File(...),
    format: str = Form("png"),  # "png" or "jpg"
):
    if format not in ("png", "jpg"):
        raise HTTPException(status_code=400, detail="Format must be 'png' or 'jpg'.")
    data = await file.read()
    validate_file_bytes(data, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        images = pdf_service.pdf_to_images(data, format)
        return _zip_files_response(images, "images.zip")
    except Exception as e:
        _server_error("convert PDF to images", e)


@router.post("/images-to-pdf")
async def images_to_pdf_route(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="At least one image is required.")
    if len(files) > MAX_IMAGES_TO_PDF_FILES:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_IMAGES_TO_PDF_FILES} images allowed.")
    image_bytes_list = []
    for f in files:
        data = await f.read()
        validate_file_bytes(data, f.filename, MAX_IMAGE_SIZE_BYTES, ["png", "jpg", "jpeg", "webp"])
        image_bytes_list.append(data)
    try:
        result = pdf_service.images_to_pdf(image_bytes_list)
        return _pdf_response(result, "images_combined.pdf")
    except Exception as e:
        _server_error("convert images to PDF", e)


@router.post("/word-to-pdf")
async def word_to_pdf_route(file: UploadFile = File(...)):
    docx_bytes = await file.read()
    validate_file_bytes(docx_bytes, file.filename, MAX_DOCX_SIZE_BYTES, ["docx"])
    try:
        result = pdf_service.word_to_pdf(docx_bytes)
        return _pdf_response(result, "converted.pdf")
    except Exception as e:
        _server_error("convert Word document to PDF", e)


@router.post("/pdf-to-word")
async def pdf_to_word_route(file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    validate_file_bytes(pdf_bytes, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.pdf_to_word(pdf_bytes)
        return StreamingResponse(
            io.BytesIO(result),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": 'attachment; filename="converted.docx"'},
        )
    except Exception as e:
        _server_error("convert PDF to Word", e)


@router.post("/unlock-pdf")
async def unlock_pdf_route(
    file: UploadFile = File(...),
    password: str = Form(""),
):
    """Remove password protection from an encrypted PDF."""
    pdf_bytes = await file.read()
    validate_file_bytes(pdf_bytes, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.unlock_pdf(pdf_bytes, password)
        return _pdf_response(result, "unlocked.pdf")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        _server_error("unlock PDF", e)


# ─── NEW ROUTES ────────────────────────────────────────────────────────────────


@router.post("/protect-pdf")
async def protect_pdf_route(
    file: UploadFile = File(...),
    password: str = Form(...),
):
    """Encrypt a PDF with AES-256 password protection."""
    if not password or not password.strip():
        raise HTTPException(status_code=400, detail="Password cannot be empty.")
    pdf_bytes = await file.read()
    validate_file_bytes(pdf_bytes, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.protect_pdf(pdf_bytes, password)
        return _pdf_response(result, "protected.pdf")
    except Exception as e:
        _server_error("protect PDF", e)


@router.post("/add-watermark")
async def add_watermark_route(
    file: UploadFile = File(...),
    text: str = Form("CONFIDENTIAL"),
    opacity: float = Form(0.3),
    angle: float = Form(45.0),
    font_size: int = Form(48),
    color: str = Form("808080"),  # hex without #
):
    """Overlay a text watermark on every page of a PDF."""
    # Parse hex color to RGB tuple
    hex_c = color.lstrip("#")
    if len(hex_c) == 3:
        hex_c = "".join(c * 2 for c in hex_c)
    try:
        rgb = (int(hex_c[0:2], 16) / 255, int(hex_c[2:4], 16) / 255, int(hex_c[4:6], 16) / 255)
    except (ValueError, IndexError):
        raise HTTPException(status_code=400, detail='Invalid color. Use a 3 or 6 character hex code, e.g. "808080".')

    pdf_bytes = await file.read()
    validate_file_bytes(pdf_bytes, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.add_watermark(pdf_bytes, text, opacity, angle, font_size, rgb)
        return _pdf_response(result, "watermarked.pdf")
    except Exception as e:
        _server_error("add watermark", e)


@router.post("/add-page-numbers")
async def add_page_numbers_route(
    file: UploadFile = File(...),
    position: str = Form("bottom-center"),
    font_size: int = Form(10),
    start_number: int = Form(1),
    prefix: str = Form("Page"),
):
    """Stamp page numbers onto every page of a PDF."""
    valid_positions = {
        "bottom-center", "bottom-left", "bottom-right",
        "top-center", "top-left", "top-right"
    }
    if position not in valid_positions:
        raise HTTPException(status_code=400, detail=f"position must be one of {valid_positions}")
    pdf_bytes = await file.read()
    validate_file_bytes(pdf_bytes, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.add_page_numbers(pdf_bytes, position, font_size, start_number, prefix)
        return _pdf_response(result, "numbered.pdf")
    except Exception as e:
        _server_error("add page numbers", e)


@router.post("/extract-text")
async def extract_text_route(file: UploadFile = File(...)):
    """Extract all text from a PDF and return as a .txt file."""
    pdf_bytes = await file.read()
    validate_file_bytes(pdf_bytes, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        text = pdf_service.extract_text(pdf_bytes)
        return StreamingResponse(
            io.BytesIO(text.encode("utf-8")),
            media_type="text/plain; charset=utf-8",
            headers={"Content-Disposition": 'attachment; filename="extracted_text.txt"'},
        )
    except Exception as e:
        _server_error("extract text", e)


@router.post("/extract-images")
async def extract_images_route(file: UploadFile = File(...)):
    """Extract all embedded images from a PDF and return as a ZIP."""
    pdf_bytes = await file.read()
    validate_file_bytes(pdf_bytes, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        images = pdf_service.extract_images_from_pdf(pdf_bytes)
        return _zip_files_response(images, "extracted_images.zip")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        _server_error("extract images", e)


@router.post("/pdf-to-excel")
async def pdf_to_excel_route(file: UploadFile = File(...)):
    """Extract tables from a PDF and return as an .xlsx file."""
    pdf_bytes = await file.read()
    validate_file_bytes(pdf_bytes, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.pdf_to_excel(pdf_bytes)
        return StreamingResponse(
            io.BytesIO(result),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": 'attachment; filename="extracted_tables.xlsx"'},
        )
    except Exception as e:
        _server_error("convert PDF to Excel", e)


@router.post("/add-signature")
async def add_signature_route(
    file: UploadFile = File(...),
    signature: UploadFile = File(...),
    page_num: int = Form(1),
    x: float = Form(100.0),
    y: float = Form(650.0),
    width: float = Form(200.0),
    height: float = Form(80.0),
):
    """Embed a signature image onto a specific page of a PDF."""
    pdf_bytes = await file.read()
    validate_file_bytes(pdf_bytes, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    sig_bytes = await signature.read()
    validate_file_bytes(sig_bytes, signature.filename, MAX_SIGNATURE_IMAGE_SIZE, ["png", "jpg", "jpeg", "webp"])
    try:
        result = pdf_service.add_signature(pdf_bytes, sig_bytes, page_num, x, y, width, height)
        return _pdf_response(result, "signed.pdf")
    except Exception as e:
        _server_error("add signature", e)


@router.post("/annotate-pdf")
async def annotate_pdf_route(
    file: UploadFile = File(...),
    annotations: str = Form(...),  # JSON string
):
    """Add text box or highlight annotations to a PDF."""
    try:
        ann_list = json.loads(annotations)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in annotations field.")
    if not isinstance(ann_list, list):
        raise HTTPException(status_code=400, detail="annotations must be a JSON array.")

    pdf_bytes = await file.read()
    validate_file_bytes(pdf_bytes, file.filename, MAX_PDF_SIZE_BYTES, ["pdf"])
    try:
        result = pdf_service.annotate_pdf(pdf_bytes, ann_list)
        return _pdf_response(result, "annotated.pdf")
    except Exception as e:
        _server_error("annotate PDF", e)
