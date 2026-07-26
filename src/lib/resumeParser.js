import "pdf-parse/worker"; // must be imported before PDFParse — fixes worker setup in Next.js/serverless
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extracts plain text from a resume file buffer.
 * @param {Buffer} buffer - raw file bytes
 * @param {"pdf"|"docx"} fileType
 * @returns {Promise<string>}
 */
export async function extractTextFromResume(buffer, fileType) {
  if (fileType === "pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text.trim();
  }

  if (fileType === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

/**
 * Determines file type from filename/mimetype. Throws if unsupported.
 * @param {string} filename
 * @returns {"pdf"|"docx"}
 */
export function getFileType(filename) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx")) return "docx";
  throw new Error("Only .pdf and .docx files are supported");
}
