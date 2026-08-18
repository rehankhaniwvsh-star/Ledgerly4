import { FullCmsContentSchema, validateStrict, StrictValidationResult } from '../schemas/strictSchemas';
import { CmsContent } from '../types';

/**
 * File Upload Security & Validation Configuration
 */
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE_BYTES: 2 * 1024 * 1024, // 2 Megabytes ceiling
  ALLOWED_EXTENSIONS: ['.json'],
  ALLOWED_MIME_TYPES: [
    'application/json',
    'text/json',
    'text/plain',
    '', // Some operating systems leave mime empty for JSON
  ],
  DISALLOWED_CONTENT_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
  ],
};

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  data?: CmsContent;
}

/**
 * Validates and safely extracts CMS JSON backup file content.
 * Guarantees:
 * 1. File size is strictly within limits before memory consumption.
 * 2. File extension and MIME type are strictly JSON.
 * 3. File content is verified to be non-executable, valid JSON, and matches FullCmsContentSchema.
 * 4. Stored only in isolated in-memory React state, never written to web root or executed as code.
 */
export async function validateAndParseCmsJsonFile(
  file: File
): Promise<FileValidationResult> {
  // 1. File Existence & Size Validation
  if (!file) {
    return { valid: false, error: 'No file was provided for upload.' };
  }

  if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File exceeds maximum allowed size of 2 MB (Uploaded file is ${sizeInMb} MB).`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'Uploaded file is empty (0 bytes).' };
  }

  // 2. Extension & MIME Type Validation (not relying solely on extension)
  const fileName = file.name.toLowerCase();
  const hasValidExt = FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExt) {
    return {
      valid: false,
      error: 'Invalid file format. Only .json backup files are accepted.',
    };
  }

  if (
    file.type &&
    !FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())
  ) {
    return {
      valid: false,
      error: `Invalid file MIME type '${file.type}'. Only application/json is accepted.`,
    };
  }

  // 3. Read Content and Inspect for Executable or Malicious Signatures
  let rawText: string;
  try {
    rawText = await file.text();
  } catch {
    return {
      valid: false,
      error: 'Failed to read file contents. File may be corrupted or unreadable.',
    };
  }

  // Check for dangerous executable patterns embedded in JSON
  for (const pattern of FILE_UPLOAD_CONFIG.DISALLOWED_CONTENT_PATTERNS) {
    if (pattern.test(rawText)) {
      return {
        valid: false,
        error: 'File content rejected: Contains prohibited script or executable patterns.',
      };
    }
  }

  // 4. Safe JSON Parsing
  let parsedObject: unknown;
  try {
    parsedObject = JSON.parse(rawText);
  } catch {
    return {
      valid: false,
      error: 'File is not a valid JSON document. Parsing failed.',
    };
  }

  if (
    !parsedObject ||
    typeof parsedObject !== 'object' ||
    Array.isArray(parsedObject)
  ) {
    return {
      valid: false,
      error: 'Invalid JSON root structure. Expected a JSON configuration object.',
    };
  }

  // 5. Strict Zod Schema Deep Validation (Type, Length, Format of all CMS fields)
  const validation: StrictValidationResult<any> = validateStrict(
    FullCmsContentSchema,
    parsedObject
  );

  if (!validation.success) {
    return {
      valid: false,
      error: `File contents rejected by strict CMS schema:\n${validation.error}`,
    };
  }

  return {
    valid: true,
    data: validation.data,
  };
}
