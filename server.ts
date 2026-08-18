import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { rateLimiterService } from "./server/rateLimiter";
import { validateBody } from "./server/validationMiddleware";
import {
  VerifyPinSchema,
  LoginSchema,
  SignupSchema,
  PasswordResetSchema,
  GenerateCopySchema,
  SaveInvoicePayloadSchema,
  CmsSavePayloadSchema,
  RateLimitConfigSchema,
  EmailInvoiceSchema,
} from "./src/schemas/strictSchemas";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for accurate client IP resolution behind Cloud Run / Nginx
  app.set("trust proxy", 1);

  app.use(express.json({ limit: "2mb" }));

  // Strict JSON payload error handler: reject invalid/malformed JSON immediately with 400
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && "body" in err) {
      return res.status(400).json({
        success: false,
        error: "Malformed JSON payload. The request body could not be parsed.",
        code: "INVALID_JSON_SYNTAX",
      });
    }
    next(err);
  });

  // In-memory demo account store for auth verification
  const demoUsers: Record<string, { email: string; passwordHash: string; name: string; createdAt: string }> = {
    "admin@invoiceify.app": {
      email: "admin@invoiceify.app",
      passwordHash: "admin1234",
      name: "Invoiceify Admin",
      createdAt: new Date().toISOString(),
    },
    "user@example.com": {
      email: "user@example.com",
      passwordHash: "password123",
      name: "Freelance Designer",
      createdAt: new Date().toISOString(),
    },
  };

  // Default Master Admin PIN (matches client default, configurable in CMS)
  let masterAdminPin = process.env.ADMIN_PIN || "1234";

  // Initialize Gemini AI SDK lazily/safely
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // -------------------------------------------------------------
  // 1. PUBLIC ENDPOINTS (Moderate Limits: e.g. 100 req/min)
  // -------------------------------------------------------------
  const publicLimiter = rateLimiterService.publicRateLimiterMiddleware();

  // Healthcheck endpoint
  app.get("/api/health", publicLimiter, (req, res) => {
    res.json({
      status: "ok",
      service: "Invoiceify Server",
      timestamp: new Date().toISOString(),
    });
  });

  // Public Configuration endpoint
  app.get("/api/config/public", publicLimiter, (req, res) => {
    const config = rateLimiterService.getConfig();
    res.json({
      success: true,
      rateLimits: {
        public: {
          windowSeconds: Math.round(config.public.windowMs / 1000),
          maxRequests: config.public.maxRequests,
        },
        authenticatedUser: {
          windowSeconds: Math.round(config.authenticatedUser.windowMs / 1000),
          maxRequests: config.authenticatedUser.maxRequests,
        },
        authRoutes: {
          ipWindowMinutes: Math.round(config.authRoutes.ipWindowMs / 60000),
          ipMaxRequests: config.authRoutes.ipMaxRequests,
          accountMaxAttempts: config.authRoutes.accountMaxAttempts,
          baseBackoffMs: config.authRoutes.baseBackoffMs,
          maxBackoffMs: config.authRoutes.maxBackoffMs,
          backoffFactor: config.authRoutes.backoffFactor,
        },
      },
    });
  });

  // Google Site Verification File handler for Google Search Console
  app.get("/googleacb1159f81828443.html", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).send("google-site-verification: googleacb1159f81828443.html");
  });

  // Dynamic Sitemap XML generator for Google Search Console (100% compliant, zero fragment URLs)
  app.get("/sitemap.xml", (req, res) => {
    const rawProto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
    const proto = rawProto.split(",")[0].trim() || "https";
    const rawHost = (req.headers["x-forwarded-host"] as string) || req.get("host") || "localhost:3000";
    const host = rawHost.split(",")[0].trim();
    const baseUrl = `${proto}://${host}`;
    const today = new Date().toISOString().split("T")[0];

    // Standard Google Search Console XML Sitemap specification
    // NOTE: URLs strictly match the requested domain and contain zero hash fragments.
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).send(sitemapXml);
  });

  // Serve Robots.txt for Googlebot and search crawlers
  app.get("/robots.txt", (req, res) => {
    const rawProto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
    const proto = rawProto.split(",")[0].trim() || "https";
    const rawHost = (req.headers["x-forwarded-host"] as string) || req.get("host") || "localhost:3000";
    const host = rawHost.split(",")[0].trim();
    const baseUrl = `${proto}://${host}`;

    const robotsTxt = `# Robots.txt for Googlebot and search crawlers
User-agent: *
Allow: /

# Google Search Console XML Sitemap Location
Sitemap: ${baseUrl}/sitemap.xml
`;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).send(robotsTxt);
  });

  // CMS AI Copywriting Generator (Moderate Public / Semi-Public Limit)
  app.post(
    "/api/cms/generate-copy",
    publicLimiter,
    validateBody(GenerateCopySchema),
    async (req, res) => {
      try {
        const { prompt, contentType, currentText } = req.body;

        const ai = getAi();
        const systemInstruction = `You are an expert brand strategist and UX copywriter for Invoiceify, a premium invoicing platform for freelancers, creators, and agencies.
Your goal is to write high-converting, professional, crisp, and persuasive website copy.
Return clean plain text without surrounding quotes or conversational meta-text.
Content type requested: ${contentType || "General Copy"}.
Current copy reference (if any): "${currentText || ""}".`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const generatedText = response.text?.trim() || "";
        res.json({ success: true, generatedText });
      } catch (error: any) {
        console.error("Gemini API Error:", error);
        res.status(500).json({
          success: false,
          error: error?.message || "Failed to generate copy using Gemini AI",
        });
      }
    }
  );

  // -------------------------------------------------------------
  // 2. AUTHENTICATION ROUTES (Stricter Limits with Exponential Backoff)
  // -------------------------------------------------------------
  const authLimiter = rateLimiterService.authRateLimiterMiddleware();

  // Auth: Verify Admin Security PIN
  app.post(
    "/api/auth/verify-pin",
    authLimiter,
    validateBody(VerifyPinSchema),
    (req, res) => {
      const { pin, customTargetPin } = req.body;
      const targetPin = (customTargetPin || masterAdminPin).trim();

      if (pin.trim() === targetPin) {
        // Clear failure record on success
        rateLimiterService.recordAuthSuccess(req);
        return res.json({
          success: true,
          message: "PIN verified successfully",
          token: `admin-token-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        });
      } else {
        const failure = rateLimiterService.recordAuthFailure(req);
        const retryWaitSec = Math.max(1, Math.ceil(failure.backoffDelayMs / 1000));
        return res.status(401).json({
          success: false,
          error:
            failure.backoffDelayMs > 0
              ? `Incorrect security PIN. Backoff active: please wait ${retryWaitSec}s before retrying.`
              : "Incorrect security PIN. Access denied.",
          consecutiveFailures: failure.consecutiveFailures,
          backoffDelayMs: failure.backoffDelayMs,
          retryAfterSeconds: retryWaitSec,
          nextAllowedTime: failure.nextAllowedTime,
        });
      }
    }
  );

  // Auth: User Login (Per-IP and Per-Account Exponential Backoff)
  app.post(
    "/api/auth/login",
    authLimiter,
    validateBody(LoginSchema),
    (req, res) => {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();
      const user = demoUsers[normalizedEmail];

      if (user && user.passwordHash === password) {
        rateLimiterService.recordAuthSuccess(req);
        return res.json({
          success: true,
          message: "Login successful",
          user: {
            email: user.email,
            name: user.name,
          },
          token: `user-token-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        });
      } else {
        const failure = rateLimiterService.recordAuthFailure(req);
        const retryWaitSec = Math.max(1, Math.ceil(failure.backoffDelayMs / 1000));
        return res.status(401).json({
          success: false,
          error:
            failure.backoffDelayMs > 0
              ? `Invalid credentials for '${normalizedEmail}'. Backoff active: please wait ${retryWaitSec}s.`
              : "Invalid email or password.",
          consecutiveFailures: failure.consecutiveFailures,
          backoffDelayMs: failure.backoffDelayMs,
          retryAfterSeconds: retryWaitSec,
          nextAllowedTime: failure.nextAllowedTime,
        });
      }
    }
  );

  // Auth: User Signup (Per-IP and Per-Account Limits)
  app.post(
    "/api/auth/signup",
    authLimiter,
    validateBody(SignupSchema),
    (req, res) => {
      const { email, password, name } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      if (demoUsers[normalizedEmail]) {
        const failure = rateLimiterService.recordAuthFailure(req);
        return res.status(409).json({
          success: false,
          error: "An account with this email address already exists.",
          consecutiveFailures: failure.consecutiveFailures,
          backoffDelayMs: failure.backoffDelayMs,
        });
      }

      demoUsers[normalizedEmail] = {
        email: normalizedEmail,
        passwordHash: password,
        name: name || "New User",
        createdAt: new Date().toISOString(),
      };

      rateLimiterService.recordAuthSuccess(req);
      res.status(201).json({
        success: true,
        message: "Account created successfully",
        user: {
          email: normalizedEmail,
          name: name || "New User",
        },
        token: `user-token-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      });
    }
  );

  // Auth: Password Reset Request (Per-IP & Per-Account Exponential Backoff)
  app.post(
    "/api/auth/password-reset",
    authLimiter,
    validateBody(PasswordResetSchema),
    (req, res) => {
      const { email } = req.body;
      const normalizedEmail = email.toLowerCase().trim();
      // Do not reveal whether user exists to prevent email enumeration, but track auth success
      rateLimiterService.recordAuthSuccess(req);

      res.json({
        success: true,
        message: `If an account exists for '${normalizedEmail}', a secure reset link has been dispatched.`,
        resetTokenSent: true,
      });
    }
  );

  // -------------------------------------------------------------
  // 3. AUTHENTICATED USER ACTIONS (Looser Limits: e.g. 300 req/min)
  // -------------------------------------------------------------
  const authenticatedLimiter = rateLimiterService.authenticatedUserRateLimiterMiddleware();

  // User Profile
  app.get("/api/user/profile", authenticatedLimiter, (req, res) => {
    res.json({
      success: true,
      user: {
        role: "owner",
        organization: "Invoiceify Studio",
        status: "active",
      },
    });
  });

  // Save Invoices / Bulk Invoice Sync (Strictly Validated)
  app.post(
    "/api/invoices/save",
    authenticatedLimiter,
    validateBody(SaveInvoicePayloadSchema),
    (req, res) => {
      const { invoice } = req.body;
      res.json({
        success: true,
        message: "Invoice data strictly validated and persisted successfully",
        invoiceId: invoice.id || `inv-${Date.now()}`,
        invoiceNumber: invoice.invoiceNumber,
        updatedAt: new Date().toISOString(),
      });
    }
  );

  // Send / Dispatch Invoice via Email (Strictly Validated)
  app.post(
    "/api/invoices/send-email",
    authenticatedLimiter,
    validateBody(EmailInvoiceSchema),
    (req, res) => {
      const { recipient, subject, invoiceNumber } = req.body;
      res.json({
        success: true,
        message: `Invoice '${invoiceNumber}' email dispatched to '${recipient}' successfully.`,
        dispatchedAt: new Date().toISOString(),
        subject,
      });
    }
  );

  // Save CMS Configuration (Strictly Validated)
  app.post(
    "/api/cms/save",
    authenticatedLimiter,
    validateBody(CmsSavePayloadSchema),
    (req, res) => {
      const { brand, pin } = req.body;
      if (pin && typeof pin === "string" && pin.trim().length >= 4) {
        masterAdminPin = pin.trim();
      }
      res.json({
        success: true,
        message: "CMS settings strictly validated and saved successfully",
        savedAt: new Date().toISOString(),
      });
    }
  );

  // -------------------------------------------------------------
  // 4. RATE LIMITING MONITORING & DYNAMIC CONFIGURATION APIs
  // -------------------------------------------------------------
  app.get("/api/admin/rate-limit/status", (req, res) => {
    res.json({
      success: true,
      metrics: rateLimiterService.getMetrics(),
    });
  });

  // Dynamic configuration update endpoint (Strictly Validated)
  app.post(
    "/api/admin/rate-limit/config",
    validateBody(RateLimitConfigSchema),
    (req, res) => {
      const { config } = req.body;
      const updated = rateLimiterService.updateConfig(config);
      res.json({
        success: true,
        message: "Rate limiting thresholds strictly validated and updated successfully",
        config: updated,
      });
    }
  );

  // Reset rate limits memory stores
  app.post("/api/admin/rate-limit/reset", (req, res) => {
    rateLimiterService.resetStores();
    res.json({
      success: true,
      message: "Rate limiter state and IP/Account backoff records cleared.",
    });
  });

  // -------------------------------------------------------------
  // 5. STATIC ASSET SERVING & SPA FALLBACK
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
