import io
import json
import zipfile
from typing import List, Optional
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import StreamingResponse

from services import pdf_service

router = APIRouter(prefix="/api")


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


# ─── Info ──────────────────────────────────────────────────────────────────────

@router.post("/info")
async def get_info(file: UploadFile = File(...)):
    """Return page count and dimensions for a PDF."""
    data = await file.read()
    try:
        info = pdf_service.get_pdf_info(data)
        return info
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ─── Merge ─────────────────────────────────────────────────────────────────────

@router.post("/merge")
async def merge(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least 2 PDF files are required.")
    try:
        pdf_bytes_list = [await f.read() for f in files]
        result = pdf_service.merge_pdfs(pdf_bytes_list)
        return _pdf_response(result, "merged.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Split ─────────────────────────────────────────────────────────────────────

@router.post("/split")
async def split(
    file: UploadFile = File(...),
    split_at: str = Form(...),  # comma-separated page numbers e.g. "3,6"
):
    try:
        pages = [int(p.strip()) for p in split_at.split(",") if p.strip()]
        data = await file.read()
        parts = pdf_service.split_pdf(data, pages)
        if len(parts) == 1:
            return _pdf_response(parts[0], "split.pdf")
        return _zip_response(parts, "split")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── Compress ──────────────────────────────────────────────────────────────────

@router.post("/compress")
async def compress(
    file: UploadFile = File(...),
    level: str = Form("medium"),  # "low", "medium", or "high"
):
    """
    Compress a PDF at three levels:
    - low: remove orphan objects (safest)
    - medium: remove orphan + identical objects (default)
    - high: all of the above + compress content streams
    """
    if level not in ("low", "medium", "high"):
        raise HTTPException(status_code=400, detail="level must be 'low', 'medium', or 'high'")
    try:
        data = await file.read()
        original_size = len(data)
        result = pdf_service.compress_pdf(data, level)
        compressed_size = len(result)
        response = _pdf_response(result, "compressed.pdf")
        response.headers["X-Original-Size"] = str(original_size)
        response.headers["X-Compressed-Size"] = str(compressed_size)
        response.headers["Access-Control-Expose-Headers"] = "X-Original-Size, X-Compressed-Size"
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Extract Pages ─────────────────────────────────────────────────────────────

@router.post("/extract-pages")
async def extract_pages(
    file: UploadFile = File(...),
    pages: str = Form(...),  # comma-separated e.g. "1,3,5"
):
    try:
        page_list = [int(p.strip()) for p in pages.split(",") if p.strip()]
        data = await file.read()
        result = pdf_service.extract_pages(data, page_list)
        return _pdf_response(result, "extracted.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Delete Pages ──────────────────────────────────────────────────────────────

@router.post("/delete-pages")
async def delete_pages(
    file: UploadFile = File(...),
    pages: str = Form(...),  # comma-separated e.g. "2,4"
):
    try:
        page_list = [int(p.strip()) for p in pages.split(",") if p.strip()]
        data = await file.read()
        result = pdf_service.delete_pages(data, page_list)
        return _pdf_response(result, "deleted.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Rearrange Pages ───────────────────────────────────────────────────────────

@router.post("/rearrange-pages")
async def rearrange_pages(
    file: UploadFile = File(...),
    order: str = Form(...),  # comma-separated new order e.g. "3,1,2"
):
    try:
        new_order = [int(p.strip()) for p in order.split(",") if p.strip()]
        data = await file.read()
        result = pdf_service.rearrange_pages(data, new_order)
        return _pdf_response(result, "rearranged.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Rotate Pages ──────────────────────────────────────────────────────────────

@router.post("/rotate-pages")
async def rotate_pages(
    file: UploadFile = File(...),
    pages: str = Form(""),   # comma-separated; empty = all pages
    angle: int = Form(90),   # 90, 180, or 270
):
    try:
        page_list = [int(p.strip()) for p in pages.split(",") if p.strip()] if pages.strip() else []
        if angle not in (90, 180, 270):
            raise HTTPException(status_code=400, detail="Angle must be 90, 180, or 270.")
        data = await file.read()
        result = pdf_service.rotate_pages(data, page_list, angle)
        return _pdf_response(result, "rotated.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Duplicate Pages ───────────────────────────────────────────────────────────

@router.post("/duplicate-pages")
async def duplicate_pages(
    file: UploadFile = File(...),
    pages: str = Form(""),   # empty = duplicate all
    times: int = Form(1),
):
    try:
        page_list = [int(p.strip()) for p in pages.split(",") if p.strip()] if pages.strip() else []
        data = await file.read()
        result = pdf_service.duplicate_pages(data, page_list, times)
        return _pdf_response(result, "duplicated.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Reverse ───────────────────────────────────────────────────────────────────

@router.post("/reverse")
async def reverse(file: UploadFile = File(...)):
    try:
        data = await file.read()
        result = pdf_service.reverse_page_order(data)
        return _pdf_response(result, "reversed.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Insert Blank Pages ────────────────────────────────────────────────────────

@router.post("/insert-blank")
async def insert_blank(
    file: UploadFile = File(...),
    positions: str = Form(...),  # comma-separated positions e.g. "1,4"
):
    try:
        pos_list = [int(p.strip()) for p in positions.split(",") if p.strip()]
        data = await file.read()
        result = pdf_service.insert_blank_pages(data, pos_list)
        return _pdf_response(result, "with_blanks.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Add PDF to Existing ───────────────────────────────────────────────────────

@router.post("/add-pdf")
async def add_pdf(
    base_file: UploadFile = File(...),
    new_file: UploadFile = File(...),
    position: int = Form(...),  # 1-indexed; use page_count+1 to append
):
    try:
        base_data = await base_file.read()
        new_data = await new_file.read()
        result = pdf_service.add_pdf_to_existing(base_data, new_data, position)
        return _pdf_response(result, "combined.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── PDF Conversions ──────────────────────────────────────────────────────────

@router.post("/pdf-to-images")
async def pdf_to_images_route(
    file: UploadFile = File(...),
    format: str = Form("png"),  # "png" or "jpg"
):
    if format not in ("png", "jpg"):
        raise HTTPException(status_code=400, detail="Format must be 'png' or 'jpg'.")
    try:
        data = await file.read()
        images = pdf_service.pdf_to_images(data, format)
        return _zip_files_response(images, "images.zip")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/images-to-pdf")
async def images_to_pdf_route(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="At least one image is required.")
    try:
        image_bytes_list = [await f.read() for f in files]
        result = pdf_service.images_to_pdf(image_bytes_list)
        return _pdf_response(result, "images_combined.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/word-to-pdf")
async def word_to_pdf_route(file: UploadFile = File(...)):
    try:
        docx_bytes = await file.read()
        result = pdf_service.word_to_pdf(docx_bytes)
        return _pdf_response(result, "converted.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf-to-word")
async def pdf_to_word_route(file: UploadFile = File(...)):
    try:
        pdf_bytes = await file.read()
        result = pdf_service.pdf_to_word(pdf_bytes)
        return StreamingResponse(
            io.BytesIO(result),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": 'attachment; filename="converted.docx"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/unlock-pdf")
async def unlock_pdf_route(
    file: UploadFile = File(...),
    password: str = Form(""),
):
    """Remove password protection from an encrypted PDF."""
    try:
        pdf_bytes = await file.read()
        result = pdf_service.unlock_pdf(pdf_bytes, password)
        return _pdf_response(result, "unlocked.pdf")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── NEW ROUTES ────────────────────────────────────────────────────────────────


@router.post("/protect-pdf")
async def protect_pdf_route(
    file: UploadFile = File(...),
    password: str = Form(...),
):
    """Encrypt a PDF with AES-256 password protection."""
    if not password or not password.strip():
        raise HTTPException(status_code=400, detail="Password cannot be empty.")
    try:
        pdf_bytes = await file.read()
        result = pdf_service.protect_pdf(pdf_bytes, password)
        return _pdf_response(result, "protected.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
    try:
        pdf_bytes = await file.read()
        # Parse hex color to RGB tuple
        hex_c = color.lstrip("#")
        if len(hex_c) == 3:
            hex_c = "".join(c * 2 for c in hex_c)
        rgb = (int(hex_c[0:2], 16) / 255, int(hex_c[2:4], 16) / 255, int(hex_c[4:6], 16) / 255)
        result = pdf_service.add_watermark(pdf_bytes, text, opacity, angle, font_size, rgb)
        return _pdf_response(result, "watermarked.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
    try:
        pdf_bytes = await file.read()
        result = pdf_service.add_page_numbers(pdf_bytes, position, font_size, start_number, prefix)
        return _pdf_response(result, "numbered.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-text")
async def extract_text_route(file: UploadFile = File(...)):
    """Extract all text from a PDF and return as a .txt file."""
    try:
        pdf_bytes = await file.read()
        text = pdf_service.extract_text(pdf_bytes)
        return StreamingResponse(
            io.BytesIO(text.encode("utf-8")),
            media_type="text/plain; charset=utf-8",
            headers={"Content-Disposition": 'attachment; filename="extracted_text.txt"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-images")
async def extract_images_route(file: UploadFile = File(...)):
    """Extract all embedded images from a PDF and return as a ZIP."""
    try:
        pdf_bytes = await file.read()
        images = pdf_service.extract_images_from_pdf(pdf_bytes)
        return _zip_files_response(images, "extracted_images.zip")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pdf-to-excel")
async def pdf_to_excel_route(file: UploadFile = File(...)):
    """Extract tables from a PDF and return as an .xlsx file."""
    try:
        pdf_bytes = await file.read()
        result = pdf_service.pdf_to_excel(pdf_bytes)
        return StreamingResponse(
            io.BytesIO(result),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": 'attachment; filename="extracted_tables.xlsx"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
    try:
        pdf_bytes = await file.read()
        sig_bytes = await signature.read()
        result = pdf_service.add_signature(pdf_bytes, sig_bytes, page_num, x, y, width, height)
        return _pdf_response(result, "signed.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/annotate-pdf")
async def annotate_pdf_route(
    file: UploadFile = File(...),
    annotations: str = Form(...),  # JSON string
):
    """Add text box or highlight annotations to a PDF."""
    try:
        ann_list = json.loads(annotations)
        if not isinstance(ann_list, list):
            raise HTTPException(status_code=400, detail="annotations must be a JSON array.")
        pdf_bytes = await file.read()
        result = pdf_service.annotate_pdf(pdf_bytes, ann_list)
        return _pdf_response(result, "annotated.pdf")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in annotations field.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
