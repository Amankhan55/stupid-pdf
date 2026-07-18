// ─── Centralized PDF Tool File Restrictions & Validation Logic ───────────────

export const TOOL_RESTRICTIONS = {
  "merge": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 25 * 1024 * 1024, // 25 MB per file
    maxSizeMB: 25,
    maxFiles: 20,
    label: "PDF files",
    multiple: true,
  },
  "split": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024, // 50 MB
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "compress": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "extract-pages": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "delete-pages": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "rearrange-pages": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "rotate-pages": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "duplicate-pages": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "reverse": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "insert-blank": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "add-pdf": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "add-watermark": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "add-page-numbers": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "add-signature": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
    signatureImage: {
      accept: "image/png,image/jpeg,image/jpg,image/webp,.png,.jpg,.jpeg,.webp",
      extensions: ["png", "jpg", "jpeg", "webp"],
      maxSizeBytes: 5 * 1024 * 1024, // 5 MB
      maxSizeMB: 5,
    }
  },
  "protect-pdf": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "unlock-pdf": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "extract-text": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "extract-images": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "pdf-to-images": {
    accept: ".pdf,application/pdf",
    extensions: ["pdf"],
    maxSizeBytes: 50 * 1024 * 1024,
    maxSizeMB: 50,
    maxFiles: 1,
    label: "PDF file",
    multiple: false,
  },
  "images-to-pdf": {
    accept: "image/png,image/jpeg,image/jpg,image/webp,.png,.jpg,.jpeg,.webp",
    extensions: ["png", "jpg", "jpeg", "webp"],
    maxSizeBytes: 15 * 1024 * 1024, // 15 MB per image
    maxSizeMB: 15,
    maxFiles: 25,
    label: "Image files (PNG, JPG, WEBP)",
    multiple: true,
  },
  "word-to-pdf": {
    accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extensions: ["docx"],
    maxSizeBytes: 20 * 1024 * 1024, // 20 MB
    maxSizeMB: 20,
    maxFiles: 1,
    label: "Word document (.docx)",
    multiple: false,
  },
};

/**
 * Validates a single file or array of files against a tool's restriction config.
 * Returns { valid: boolean, error: string | null }
 */
export function validateFiles(files, restriction) {
  if (!files || (Array.isArray(files) && files.length === 0)) {
    return { valid: true, error: null };
  }

  const fileArray = Array.isArray(files) ? files : [files];

  // Check file count
  if (restriction.maxFiles && fileArray.length > restriction.maxFiles) {
    return {
      valid: false,
      error: `Too many files! Maximum ${restriction.maxFiles} file${restriction.maxFiles > 1 ? 's' : ''} allowed for this tool.`,
    };
  }

  for (const file of fileArray) {
    if (!file || !file.name) continue;

    // Check file extension
    const ext = file.name.split(".").pop().toLowerCase();
    if (restriction.extensions && !restriction.extensions.includes(ext)) {
      const allowedText = restriction.extensions.map((e) => "." + e.toUpperCase()).join(", ");
      return {
        valid: false,
        error: `Invalid file type: "${file.name}". Only ${allowedText} files are allowed.`,
      };
    }

    // Check file size
    if (restriction.maxSizeBytes && file.size > restriction.maxSizeBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File too large: "${file.name}" (${sizeMB} MB). Maximum limit is ${restriction.maxSizeMB} MB per file.`,
      };
    }
  }

  return { valid: true, error: null };
}
