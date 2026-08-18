import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { formatZodErrors, ValidationErrorDetail } from "../src/schemas/strictSchemas";

/**
 * Express middleware that validates req.body against a strict Zod schema.
 * If validation fails, it immediately terminates the request with HTTP 400 Bad Request
 * and returns structured error details.
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Disallow non-object/undefined body on POST/PUT
    if (req.body === undefined || req.body === null) {
      return res.status(400).json({
        success: false,
        error: "Validation failed: Request body is missing or empty.",
        code: "INVALID_REQUEST_BODY",
        details: [
          {
            field: "body",
            message: "Request payload must be a non-empty JSON object",
            code: "custom",
          },
        ],
      });
    }

    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      const formatted = formatZodErrors(parseResult.error);
      return res.status(400).json({
        success: false,
        error: formatted.summary,
        code: "SCHEMA_VALIDATION_ERROR",
        details: formatted.details,
      });
    }

    // Assign validated and typed data back to req.body
    req.body = parseResult.data;
    next();
  };
}

/**
 * Express middleware that validates req.query against a strict Zod schema.
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.query);

    if (!parseResult.success) {
      const formatted = formatZodErrors(parseResult.error);
      return res.status(400).json({
        success: false,
        error: formatted.summary,
        code: "SCHEMA_QUERY_VALIDATION_ERROR",
        details: formatted.details,
      });
    }

    req.query = parseResult.data as any;
    next();
  };
}
