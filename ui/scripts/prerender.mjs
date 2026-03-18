#!/usr/bin/env node

/**
 * Post-build pre-rendering script.
 *
 * After `vite build`, this script:
 * 1. Starts a local static server on the dist/ output
 * 2. Uses Puppeteer to visit each route from sitemap.xml
 * 3. Captures the fully rendered HTML (with meta tags, schema, content)
 * 4. Writes it to dist/{route}/index.html so nginx serves pre-rendered HTML
 * 5. Generates a 404.html for proper soft-404 handling
 *
 * Routes like /s/:id are skipped (dynamic, not in sitemap).
 */

import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, "..", "dist");
const SITEMAP_PATH = join(DIST_DIR, "sitemap.xml");

// Parse sitemap.xml to extract all routes
function getRoutesFromSitemap() {
  const xml = readFileSync(SITEMAP_PATH, "utf-8");
  const urls = [...xml.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)];
  return urls.map((m) => m[1] || "/");
}

// Simple static file server for the dist folder
function startServer() {
  return new Promise((resolve) => {
    const handler = async (req, res) => {
      let urlPath = req.url.split("?")[0];
      if (urlPath === "/") urlPath = "/index.html";

      const extensions = ["", ".html", "/index.html"];
      let filePath = null;

      for (const ext of extensions) {
        const candidate = join(DIST_DIR, urlPath + ext);
        try {
          const stat = (await import("fs")).statSync(candidate);
          if (stat.isFile()) {
            filePath = candidate;
            break;
          }
        } catch {
          // file not found, try next
        }
      }

      // SPA fallback
      if (!filePath) filePath = join(DIST_DIR, "index.html");

      const content = readFileSync(filePath);
      const ext = filePath.split(".").pop();
      const mimeTypes = {
        html: "text/html",
        js: "application/javascript",
        css: "text/css",
        json: "application/json",
        svg: "image/svg+xml",
        png: "image/png",
        txt: "text/plain",
        xml: "text/xml",
      };
      res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
      res.end(content);
    };

    const server = createServer(handler);
    // Use port 0 to let the OS pick an available port
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

async function prerender() {
  const routes = getRoutesFromSitemap();
  console.log(`Pre-rendering ${routes.length} routes from sitemap.xml...`);

  const server = await startServer();
  const port = server.address().port;
  console.log(`  Static server on port ${port}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--single-process",
      "--disable-extensions",
      "--disable-background-networking",
    ],
  });

  for (const route of routes) {
    const url = `http://127.0.0.1:${port}${route}`;
    console.log(`  Rendering: ${route}`);

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for React to render content inside #root
    await page.waitForSelector("#root > *", { timeout: 10000 });

    // Small extra wait for useEffect meta tag updates to complete
    await new Promise((r) => setTimeout(r, 500));

    // Get the full HTML document
    const html = await page.content();
    await page.close();

    // Write to dist/{route}/index.html
    // For root (/), overwrite dist/index.html directly
    if (route === "/") {
      writeFileSync(join(DIST_DIR, "index.html"), html);
    } else {
      const dir = join(DIST_DIR, route);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "index.html"), html);
    }
  }

  // Generate 404.html from a non-existent route
  console.log("  Rendering: 404 page");
  const page404 = await browser.newPage();
  await page404.goto(`http://127.0.0.1:${port}/__not_found__`, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });
  await page404.waitForSelector("#root > *", { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 500));
  const html404 = await page404.content();
  await page404.close();
  writeFileSync(join(DIST_DIR, "404.html"), html404);

  await browser.close();
  server.close();
  console.log(`Done! Pre-rendered ${routes.length} pages + 404.html.`);
}

prerender().catch((err) => {
  console.error("Pre-rendering failed:", err);
  process.exit(1);
});
