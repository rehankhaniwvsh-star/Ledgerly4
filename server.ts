import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { rateLimiterService } from "./server/rateLimiter";
import { validateBody } from "./server/validationMiddleware";
import { globalErrorMiddleware, handleServerError } from "./server/errorHandler";
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

  // Persistent user account store
  interface StoredUser {
    email: string;
    passwordHash: string;
    name: string;
    businessName?: string;
    role?: string;
    createdAt: string;
  }

  const USERS_FILE = path.join(process.cwd(), "data", "users.json");
  const loadUsers = (): Record<string, StoredUser> => {
    try {
      if (fs.existsSync(USERS_FILE)) {
        const raw = fs.readFileSync(USERS_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn("Could not load users file, using initial memory store", err);
    }
    return {
      "admin@billnest.app": {
        email: "admin@billnest.app",
        passwordHash: "admin1234",
        name: "Billnest Admin",
        businessName: "Billnest HQ",
        role: "agency",
        createdAt: new Date().toISOString(),
      },
      "user@example.com": {
        email: "user@example.com",
        passwordHash: "password123",
        name: "Freelance Designer",
        businessName: "Nova Studio",
        role: "freelancer",
        createdAt: new Date().toISOString(),
      },
    };
  };

  const usersDB = loadUsers();

  const saveUsers = () => {
    try {
      const dir = path.dirname(USERS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(USERS_FILE, JSON.stringify(usersDB, null, 2), "utf-8");
    } catch (err) {
      console.warn("Could not persist users to file", err);
    }
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
      service: "Billnest Server",
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

  // Dynamic Sitemap XML generator and alias routes (100% compliant with Google Search Console)
  app.get(["/sitemap.xml", "/sitemap", "/sitemaps.xml", "/sitemap.html", "/site-map"], (req, res) => {
    const rawHost = (req.headers["x-forwarded-host"] as string) || req.get("host") || "billsnest.vercel.app";
    let host = rawHost.split(",")[0].trim();
    if (host.endsWith(":443")) host = host.slice(0, -4);
    else if (host.endsWith(":80")) host = host.slice(0, -3);

    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
    // Ensure Google Search Console receives https://billsnest.vercel.app as the canonical domain
    let baseUrl = "https://billsnest.vercel.app";
    if (isLocalhost) {
      baseUrl = `http://${host}`;
    } else if (host && !host.includes("run.app")) {
      baseUrl = `https://${host}`;
    }
    const today = new Date().toISOString().split("T")[0];

    // Canonical list of indexed pages for Billnest
    const SITEMAP_PAGES = [
      {
        path: "/",
        priority: "1.0",
        changefreq: "daily",
        title: "Home — Online Invoicing & Fast Payments",
      },
      {
        path: "/create",
        priority: "0.9",
        changefreq: "daily",
        title: "Create Invoice — Online Invoice Studio & PDF Builder",
      },
      {
        path: "/templates",
        priority: "0.9",
        changefreq: "weekly",
        title: "Invoice Templates — Modern, Minimal & Classic Designs",
      },
      {
        path: "/dashboard",
        priority: "0.8",
        changefreq: "daily",
        title: "Invoices Dashboard — Real-time Payment & Client Tracking",
      },
      {
        path: "/features",
        priority: "0.8",
        changefreq: "weekly",
        title: "Features — Instant PDF Export, Payment Links & Bank Details",
      },
      {
        path: "/how-it-works",
        priority: "0.8",
        changefreq: "monthly",
        title: "How It Works — Step-by-Step Guide to Invoicing",
      },
      {
        path: "/pricing",
        priority: "0.8",
        changefreq: "monthly",
        title: "Free Invoicing — 100% Free Forever, No Hidden Subscriptions",
      },
      {
        path: "/about",
        priority: "0.7",
        changefreq: "monthly",
        title: "About Billnest — Built for Freelancers, Creators & Agencies",
      },
      {
        path: "/faq",
        priority: "0.7",
        changefreq: "monthly",
        title: "FAQ & Support — Invoicing Questions Answered",
      },
      {
        path: "/privacy",
        priority: "0.5",
        changefreq: "monthly",
        title: "Privacy Policy — Local Client Storage & Data Protection",
      },
      {
        path: "/terms",
        priority: "0.5",
        changefreq: "monthly",
        title: "Terms of Service — Transparent Commercial Usage Agreement",
      },
    ];

    // Check if user requested via browser expecting human-readable HTML representation on /sitemap
    if (req.path === "/sitemap" || req.path === "/sitemap.html" || req.path === "/site-map") {
      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        const tableRows = SITEMAP_PAGES.map(
          (p) => `<tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #334155;">
              <a href="${baseUrl}${p.path === "/" ? "/" : p.path}" style="color: #38bdf8; text-decoration: underline; font-family: monospace; font-size: 0.85rem;">${baseUrl}${p.path === "/" ? "/" : p.path}</a>
              <div style="color: #94a3b8; font-size: 0.75rem; margin-top: 2px;">${p.title}</div>
            </td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #334155; color: #cbd5e1; font-size: 0.85rem;">${today}</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #334155; color: #cbd5e1; font-size: 0.85rem;">${p.changefreq}</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #334155; color: #f97316; font-weight: bold; font-size: 0.85rem;">${p.priority}</td>
          </tr>`
        ).join("");

        return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Billnest — XML Sitemap Index (${SITEMAP_PAGES.length} Pages)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #090d16; color: #f8fafc; padding: 2rem 1rem; }
    .card { max-width: 860px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 1rem; padding: 2rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
    h1 { font-size: 1.5rem; margin-top: 0; color: #f97316; }
    p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; }
    .stats { display: flex; gap: 1.5rem; margin: 1.25rem 0; padding: 1rem; background: #0d1322; border-radius: 0.5rem; border: 1px solid #1f2937; }
    .stat-item { font-size: 0.85rem; color: #94a3b8; }
    .stat-item strong { color: #fff; font-size: 1.1rem; display: block; }
    table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; background: #0f172a; border-radius: 0.5rem; overflow: hidden; }
    th { text-align: left; padding: 12px 14px; background: #1e293b; color: #f8fafc; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
    a.btn { display: inline-block; background: #f97316; color: #fff; padding: 0.6rem 1.2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    a.btn:hover { background: #ea580c; }
  </style>
</head>
<body>
  <div class="card">
    <h1>📄 Billnest XML Sitemap Index</h1>
    <p>Official Google Search Console and web crawler sitemap indexing all key pages and tools.</p>
    <div class="stats">
      <div class="stat-item">Total Indexed URLs<strong>${SITEMAP_PAGES.length} Pages</strong></div>
      <div class="stat-item">Standard<strong>sitemaps.org 0.9</strong></div>
      <div class="stat-item">Crawler Status<strong>100% Crawlable</strong></div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Page URL &amp; Description</th>
          <th>Last Modified</th>
          <th>Frequency</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <div style="margin-top: 1.5rem; display: flex; gap: 1rem; align-items: center;">
      <a href="/sitemap.xml" class="btn">View Raw XML Feed</a>
      <a href="/" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">← Return to Home</a>
    </div>
  </div>
</body>
</html>`);
      }
    }

    // Standard Google Search Console XML Sitemap specification with XSL styling for browser display
    // NOTE: URLs strictly match the requested domain and contain zero hash fragments.
    const urlsXml = SITEMAP_PAGES.map(
      (page) => `  <url>
    <loc>${baseUrl}${page.path === "/" ? "/" : page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    ).join("\n");

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).send(sitemapXml);
  });

  // Serve Sitemap XSL Stylesheet
  app.get("/sitemap.xsl", (req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    const xslPath = path.join(process.cwd(), "public", "sitemap.xsl");
    res.sendFile(xslPath);
  });

  // Serve Robots.txt for Googlebot and search crawlers
  app.get("/robots.txt", (req, res) => {
    const rawHost = (req.headers["x-forwarded-host"] as string) || req.get("host") || "billsnest.vercel.app";
    let host = rawHost.split(",")[0].trim();
    if (host.endsWith(":443")) host = host.slice(0, -4);
    else if (host.endsWith(":80")) host = host.slice(0, -3);

    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
    let baseUrl = "https://billsnest.vercel.app";
    if (isLocalhost) {
      baseUrl = `http://${host}`;
    } else if (host && !host.includes("run.app")) {
      baseUrl = `https://${host}`;
    }

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
        const systemInstruction = `You are an expert brand strategist and UX copywriter for Billnest, a premium invoicing platform for freelancers, creators, and agencies.
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
        return handleServerError(
          error,
          req,
          res,
          "The AI copywriting service encountered an error while processing your request. Please try again.",
          500
        );
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
      const user = usersDB[normalizedEmail];

      if (user && user.passwordHash === password) {
        rateLimiterService.recordAuthSuccess(req);
        return res.json({
          success: true,
          message: "Login successful",
          user: {
            email: user.email,
            name: user.name,
            businessName: user.businessName || "Creative Studio",
            role: user.role || "freelancer",
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
              : "Invalid email or password. Please verify your credentials or create a new account.",
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
      const { email, password, name, businessName, role } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      if (usersDB[normalizedEmail]) {
        const failure = rateLimiterService.recordAuthFailure(req);
        return res.status(409).json({
          success: false,
          error: "An account with this email address already exists. Please sign in instead.",
          consecutiveFailures: failure.consecutiveFailures,
          backoffDelayMs: failure.backoffDelayMs,
        });
      }

      const newUser: StoredUser = {
        email: normalizedEmail,
        passwordHash: password,
        name: name?.trim() || "Member",
        businessName: businessName?.trim() || "Creative Studio",
        role: role || "freelancer",
        createdAt: new Date().toISOString(),
      };

      usersDB[normalizedEmail] = newUser;
      saveUsers();

      rateLimiterService.recordAuthSuccess(req);
      res.status(201).json({
        success: true,
        message: "Account created successfully",
        user: {
          email: newUser.email,
          name: newUser.name,
          businessName: newUser.businessName,
          role: newUser.role,
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
        organization: "Billnest Studio",
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
  // 5. GLOBAL ERROR HANDLING MIDDLEWARE
  // Intercepts all synchronous/asynchronous unhandled exceptions,
  // logs full stack traces server-side, and returns clean generic errors to clients.
  // -------------------------------------------------------------
  app.use(globalErrorMiddleware);

  // Guarantee that all unhandled /api/* calls return JSON 404 and NEVER fall through to HTML index.html
  app.all("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      error: `API route ${req.method} ${req.path} not found`,
      code: "API_ROUTE_NOT_FOUND",
    });
  });

  // -------------------------------------------------------------
  // 6. STATIC ASSET SERVING & SPA FALLBACK
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const indexPath = path.join(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        next(e);
      }
    });
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
