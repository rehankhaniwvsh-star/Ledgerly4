import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

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

  // Healthcheck endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Invoiceify Server" });
  });

  // Serve Google Search Console verification file directly
  app.get("/googleacb1159f81828443.html", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send("google-site-verification: googleacb1159f81828443.html");
  });

  // Dynamic Sitemap XML generator
  app.get("/sitemap.xml", (req, res) => {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(sitemapXml);
  });

  // Serve Robots.txt
  app.get("/robots.txt", (req, res) => {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(robotsTxt);
  });

  // CMS AI Copywriting Generator
  app.post("/api/cms/generate-copy", async (req, res) => {
    try {
      const { prompt, contentType, currentText } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const ai = getAi();
      const systemInstruction = `You are an expert brand strategist and UX copywriter for Invoiceify, a premium invoicing platform for freelancers, creators, and agencies.
Your goal is to write high-converting, professional, crisp, and persuasive website copy.
Return clean plain text without surrounding quotes or conversational meta-text.
Content type requested: ${contentType || 'General Copy'}.
Current copy reference (if any): "${currentText || ''}".`;

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
  });

  // Vite development middleware vs Static Production serving
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
