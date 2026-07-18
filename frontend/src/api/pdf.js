import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({ baseURL: BASE_URL });

function buildForm(fields) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      value.forEach((v) => form.append(key, v));
    } else {
      form.append(key, value);
    }
  }
  return form;
}

/** Ensure filename always ends with the right extension */
function withExt(name, ext) {
  if (!name || !name.trim()) return `output.${ext}`;
  const trimmed = name.trim();
  return trimmed.endsWith(`.${ext}`) ? trimmed : `${trimmed}.${ext}`;
}

async function downloadBlob(promise, filename) {
  const res = await promise;
  const url = URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function getPdfInfo(file) {
  const form = buildForm({ file });
  const res = await api.post("/info", form);
  return res.data;
}

export async function mergePdfs(files, filename = "", onProgress) {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  await downloadBlob(
    api.post("/merge", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function splitPdf(file, splitAt, filename = "", onProgress) {
  const form = buildForm({ file, split_at: splitAt });
  const isMulti = splitAt.includes(",");
  const name = filename.trim();
  const dlName = isMulti
    ? withExt(name, "zip")
    : withExt(name, "pdf");
  await downloadBlob(api.post("/split", form, { responseType: "blob", onUploadProgress: onProgress }), dlName);
}

export async function compressPdf(file, level = "medium", filename = "", onProgress) {
  const form = buildForm({ file, level });
  const res = await api.post("/compress", form, { responseType: "blob", onUploadProgress: onProgress });
  const originalSize = parseInt(res.headers["x-original-size"] || "0");
  const compressedSize = parseInt(res.headers["x-compressed-size"] || "0");
  const url = URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = withExt(filename, "pdf");
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return { originalSize, compressedSize };
}

export async function extractPages(file, pages, filename = "", onProgress) {
  const form = buildForm({ file, pages });
  await downloadBlob(
    api.post("/extract-pages", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function deletePages(file, pages, filename = "", onProgress) {
  const form = buildForm({ file, pages });
  await downloadBlob(
    api.post("/delete-pages", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function rearrangePages(file, order, filename = "", onProgress) {
  const form = buildForm({ file, order });
  await downloadBlob(
    api.post("/rearrange-pages", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function rotatePages(file, pages, angle, filename = "", onProgress) {
  const form = buildForm({ file, pages, angle });
  await downloadBlob(
    api.post("/rotate-pages", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function duplicatePages(file, pages, times, filename = "", onProgress) {
  const form = buildForm({ file, pages, times });
  await downloadBlob(
    api.post("/duplicate-pages", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function reversePdf(file, filename = "", onProgress) {
  const form = buildForm({ file });
  await downloadBlob(
    api.post("/reverse", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function insertBlankPages(file, positions, filename = "", onProgress) {
  const form = buildForm({ file, positions });
  await downloadBlob(api.post("/insert-blank", form, { responseType: "blob", onUploadProgress: onProgress }), withExt(filename, "pdf"));
}

export async function addPdfToExisting(baseFile, newFile, position, filename = "", onProgress) {
  const form = new FormData();
  form.append("base_file", baseFile);
  form.append("new_file", newFile);
  form.append("position", position);
  await downloadBlob(
    api.post("/add-pdf", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function pdfToImages(file, format = "png", filename = "", onProgress) {
  const form = buildForm({ file, format });
  await downloadBlob(
    api.post("/pdf-to-images", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "zip")
  );
}

export async function imagesToPdf(files, filename = "", onProgress) {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  await downloadBlob(
    api.post("/images-to-pdf", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function wordToPdf(file, filename = "", onProgress) {
  const form = buildForm({ file });
  await downloadBlob(
    api.post("/word-to-pdf", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function pdfToWord(file, filename = "", onProgress) {
  const form = buildForm({ file });
  await downloadBlob(
    api.post("/pdf-to-word", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "docx")
  );
}

export async function unlockPdf(file, password = "", filename = "", onProgress) {
  const form = buildForm({ file, password });
  await downloadBlob(
    api.post("/unlock-pdf", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

// ─── NEW API FUNCTIONS ─────────────────────────────────────────────────────────

export async function protectPdf(file, password, filename = "", onProgress) {
  const form = buildForm({ file, password });
  await downloadBlob(
    api.post("/protect-pdf", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function addWatermark(file, text, opacity, angle, fontSize, color, filename = "", onProgress) {
  const form = buildForm({ file, text, opacity, angle, font_size: fontSize, color });
  await downloadBlob(
    api.post("/add-watermark", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function addPageNumbers(file, position, fontSize, startNumber, prefix, filename = "", onProgress) {
  const form = buildForm({ file, position, font_size: fontSize, start_number: startNumber, prefix });
  await downloadBlob(
    api.post("/add-page-numbers", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function extractText(file, filename = "", onProgress) {
  const form = buildForm({ file });
  await downloadBlob(
    api.post("/extract-text", form, { responseType: "blob", onUploadProgress: onProgress }),
    filename && filename.trim() ? withExt(filename, "txt") : "extracted_text.txt"
  );
}

export async function extractImages(file, filename = "", onProgress) {
  const form = buildForm({ file });
  await downloadBlob(
    api.post("/extract-images", form, { responseType: "blob", onUploadProgress: onProgress }),
    filename && filename.trim() ? withExt(filename, "zip") : "extracted_images.zip"
  );
}

export async function pdfToExcel(file, filename = "", onProgress) {
  const form = buildForm({ file });
  await downloadBlob(
    api.post("/pdf-to-excel", form, { responseType: "blob", onUploadProgress: onProgress }),
    filename && filename.trim() ? withExt(filename, "xlsx") : "extracted_tables.xlsx"
  );
}

export async function addSignature(file, signatureFile, pageNum, x, y, width, height, filename = "", onProgress) {
  const form = new FormData();
  form.append("file", file);
  form.append("signature", signatureFile);
  form.append("page_num", pageNum);
  form.append("x", x);
  form.append("y", y);
  form.append("width", width);
  form.append("height", height);
  await downloadBlob(
    api.post("/add-signature", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}

export async function annotatePdf(file, annotations, filename = "", onProgress) {
  const form = buildForm({ file, annotations: JSON.stringify(annotations) });
  await downloadBlob(
    api.post("/annotate-pdf", form, { responseType: "blob", onUploadProgress: onProgress }),
    withExt(filename, "pdf")
  );
}
