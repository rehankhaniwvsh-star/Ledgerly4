import { Request, Response, NextFunction } from "express";

/**
 * Standard Server Error Response Interface
 */
export interface SafeErrorResponse {
  success: false;
  error: string;
  code: string;
  timestamp?: string;
}

/**
 * Strips sensitive internal system paths (e.g. /app/..., node_modules/...) from text
 */
export function sanitizeInternalPaths(text: string): string {
  if (!text) return "";
  return text
    .replace(/(?:\/[a-zA-Z0-9_.-]+)+/g, "[internal-path]")
    .replace(/\\(?:[a-zA-Z0-9_.-]+\\)+/g, "[internal-path]");
}

/**
 * Universal Server-Side Error Logger and Sanitizer
 * - Logs complete stack traces and details server-side for internal diagnostics.
 * - Returns clean, sanitized generic responses to clients.
 */
export function handleServerError(
  err: any,
  req: Request,
  res: Response,
  customUserMessage?: string,
  statusCode: number = 500
): Response {
  const timestamp = new Date().toISOString();
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";

  // Comprehensive Server-Side Log for Debugging
  console.error(`[Server Error] ${req.method} ${req.originalUrl} - ${timestamp}`, {
    name: err.name || "Error",
    message: err.message || "Unknown error",
    code: err.code,
    stack: err.stack,
    ip: req.ip || req.socket.remoteAddress,
    headers: {
      "user-agent": req.headers["user-agent"],
      "content-type": req.headers["content-type"],
    },
  });

  // Client-Safe Generic Message (No stack traces, no internal paths, no database error details)
  const clientMessage =
    customUserMessage ||
    "An unexpected error occurred while processing your request. Please try again later.";

  return res.status(statusCode).json({
    success: false,
    error: clientMessage,
    code: errorCode,
  });
}

/**
 * Global Express Error-Handling Middleware
 */
export function globalErrorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  // Handle malformed JSON body errors
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Malformed JSON payload. The request body could not be parsed.",
      code: "INVALID_JSON_SYNTAX",
    });
  }

  // Handle Payload Too Large errors
  if (err.type === "entity.too.large" || err.status === 413) {
    return res.status(413).json({
      success: false,
      error: "Request payload size exceeds the maximum allowed limit of 2 MB.",
      code: "PAYLOAD_TOO_LARGE",
    });
  }

  return handleServerError(
    err,
    req,
    res,
    "An unexpected server error occurred. Please try again later.",
    err.status || err.statusCode || 500
  );
}
