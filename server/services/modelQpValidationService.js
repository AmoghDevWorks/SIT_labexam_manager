const fs = require("fs/promises");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractTextFromPdf = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const parsed = await pdfParse(buffer);
  return parsed?.text || "";
};

const extractTextFromDocx = async (filePath) => {
  const extracted = await mammoth.extractRawText({ path: filePath });
  return extracted?.value || "";
};

const extractTextWithOcr = async (filePath) => {
  const result = await Tesseract.recognize(filePath, "eng", {
    logger: () => {
      // Silence OCR logs to keep server output clean.
    },
  });

  return result?.data?.text || "";
};

const containsSubjectCode = (text, subjectCode) => {
  const rawCode = (subjectCode || "").trim();
  if (!rawCode) return false;

  const escapedCode = escapeRegex(rawCode);

  // Support explicit marker format: *SUBJECT_CODE*
  const starredPattern = new RegExp(`\\*\\s*${escapedCode}\\s*\\*`, "i");
  if (starredPattern.test(text || "")) return true;

  // Exact token match for regular text.
  const exactPattern = new RegExp(`\\b${escapedCode}\\b`, "i");
  if (exactPattern.test(text || "")) return true;

  // Fallback for OCR output that may include spaces/hyphens between characters.
  const flexiblePattern = rawCode.toUpperCase().replace(/[^A-Z0-9]/g, "")
    .split("")
    .map((ch) => escapeRegex(ch))
    .join("[\\s\\-_:]*");

  return new RegExp(flexiblePattern, "i").test(text || "");
};

const extractTextForValidation = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".pdf") {
    const pdfText = await extractTextFromPdf(filePath);
    if (pdfText.trim()) return pdfText;

    // If PDF is image-based (no embedded text), try OCR directly.
    try {
      const ocrText = await extractTextWithOcr(filePath);
      if (ocrText.trim()) return ocrText;
    } catch (error) {
      // Ignore OCR fallback failure here; final validation message will explain.
    }

    return "";
  }

  if (extension === ".docx") {
    return extractTextFromDocx(filePath);
  }

  // Legacy .doc parsing is not reliable without external tooling.
  return "";
};

const getDocumentLabel = (documentType) => {
  if (documentType === "modelQP") return "Model Question Paper";
  if (documentType === "syllabus") return "Syllabus";
  return "document";
};

const validateDocumentSubjectCode = async ({ filePath, subjectCode, documentType }) => {
  const text = await extractTextForValidation(filePath);
  const documentLabel = getDocumentLabel(documentType);

  if (!text.trim()) {
    return {
      isValid: false,
      message:
        `Could not extract text from ${documentLabel}. Upload a clear PDF or DOCX where the subject code is visible.`,
    };
  }

  if (!containsSubjectCode(text, subjectCode)) {
    return {
      isValid: false,
      message: `Subject code ${subjectCode} was not detected in the uploaded ${documentLabel}.`,
    };
  }

  return {
    isValid: true,
    message: `Subject code verified successfully in ${documentLabel}.`,
  };
};

const validateModelQpSubjectCode = async ({ filePath, subjectCode }) =>
  validateDocumentSubjectCode({ filePath, subjectCode, documentType: "modelQP" });

module.exports = {
  validateDocumentSubjectCode,
  validateModelQpSubjectCode,
};
