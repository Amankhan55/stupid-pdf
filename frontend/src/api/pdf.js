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

export async function mergePdfs(files, filename = "") {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  await downloadBlob(
    api.post("/merge", form, { responseType: "blob" }),
    withExt(filename, "pdf")
  );
}

export async function splitPdf(file, splitAt, filename = "") {
  const form = buildForm({ file, split_at: splitAt });
  const isMulti = splitAt.includes(",");
  const name = filename.trim();
  const dlName = isMulti
    ? withExt(name, "zip")
    : withExt(name, "pdf");
  await downloadBlob(api.post("/split", form, { responseType: "blob" }), dlName);
}

export async function compressPdf(file, level = "medium", filename = "") {
  const form = buildForm({ file, level });
  const res = await api.post("/compress", form, { responseType: "blob" });
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

export async function extractPages(file, pages, filename = "") {
  const form = buildForm({ file, pages });
  await downloadBlob(
    api.post("/extract-pages", form, { responseType: "blob" }),
    withExt(filename, "pdf")
  );
}

export async function deletePages(file, pages, filename = "") {
  const form = buildForm({ file, pages });
  await downloadBlob(
    api.post("/delete-pages", form, { responseType: "blob" }),
    withExt(filename, "pdf")
  );
}

export async function rearrangePages(file, order, filename = "") {
  const form = buildForm({ file, order });
  await downloadBlob(
    api.post("/rearrange-pages", form, { responseType: "blob" }),
    withExt(filename, "pdf")
  );
}

export async function rotatePages(file, pages, angle, filename = "") {
  const form = buildForm({ file, pages, angle });
  await downloadBlob(
    api.post("/rotate-pages", form, { responseType: "blob" }),
    withExt(filename, "pdf")
  );
}

export async function duplicatePages(file, pages, times, filename = "") {
  const form = buildForm({ file, pages, times });
  await downloadBlob(
    api.post("/duplicate-pages", form, { responseType: "blob" }),
    withExt(filename, "pdf")
  );
}

export async function reversePdf(file, filename = "") {
  const form = buildForm({ file });
  await downloadBlob(
    api.post("/reverse", form, { responseType: "blob" }),
    withExt(filename, "pdf")
  );
}

export async function insertBlankPages(file, positions, filename = "") {
  const form = buildForm({ file, positions });
  await downloadBlob(api.post("/insert-blank", form, { responseType: "blob" }), withExt(filename, "pdf"));
}

export async function addPdfToExisting(baseFile, newFile, position, filename = "") {
  const form = new FormData();
  form.append("base_file", baseFile);
  form.append("new_file", newFile);
  form.append("position", position);
  await downloadBlob(
    api.post("/add-pdf", form, { responseType: "blob" }),
    withExt(filename, "pdf")
  );
}

export async function pdfToImages(file, format = "png", filename = "") {
  const form = buildForm({ file, format });
  await downloadBlob(
    api.post("/pdf-to-images", form, { responseType: "blob" }),
    withExt(filename, "zip")
  );
}

export async function imagesToPdf(files, filename = "") {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  await downloadBlob(
    api.post("/images-to-pdf", form, { responseType: "blob" }),
    withExt(filename, "pdf")
  );
}

export async function wordToPdf(file, filename = "") {
  const form = buildForm({ file });
  await downloadBlob(
    api.post("/word-to-pdf", form, { responseType: "blob" }),
    withExt(filename, "pdf")
  );
}

export async function pdfToWord(file, filename = "") {
  const form = buildForm({ file });
  await downloadBlob(
    api.post("/pdf-to-word", form, { responseType: "blob" }),
    withExt(filename, "docx")
  );
}

