#!/usr/bin/env node

/**
 * IndexNow submission script.
 *
 * Reads sitemap.xml and submits all URLs to IndexNow (Bing, Yandex, etc.)
 * for faster discovery and indexing of new or updated content.
 *
 * Usage: node scripts/indexnow.mjs
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITEMAP_PATH = join(__dirname, "..", "public", "sitemap.xml");

const HOST = "ooshare.io";
const KEY = "e4ff7c91ec4a4ef3bb47bd9a023974ed";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function getUrlsFromSitemap() {
  const xml = readFileSync(SITEMAP_PATH, "utf-8");
  const urls = [...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)];
  return urls.map((m) => m[1]);
}

async function submit() {
  const urlList = getUrlsFromSitemap();
  console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  if (res.ok || res.status === 202) {
    console.log(`Success! ${res.status} — ${urlList.length} URLs submitted.`);
  } else {
    const text = await res.text();
    console.error(`Failed: ${res.status} ${res.statusText}\n${text}`);
    process.exit(1);
  }
}

submit();
