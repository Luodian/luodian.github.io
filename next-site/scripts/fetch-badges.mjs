#!/usr/bin/env node
/**
 * Regenerate the citation + GitHub-stars badge SVGs at Vercel build time.
 *
 * Run order matters: this MUST run AFTER `sync:assets` (which wipes and
 * re-copies public/assets from docs/assets). It overwrites the synced
 * baseline with freshly fetched numbers. If a fetch fails — e.g. Google
 * Scholar blocks the build IP, or GitHub rate-limits an unauthenticated
 * build — the existing synced SVG is left in place as a fallback and the
 * build still succeeds. This script never exits non-zero.
 *
 * Env (all optional):
 *   SCHOLAR_ID    Google Scholar user id          (default: 1_zc1-IAAAAJ)
 *   GITHUB_ORG    org whose repo stars are summed  (default: EvolvingLMMs-Lab)
 *   GITHUB_USER   user whose repo stars are summed (default: luodian)
 *   GITHUB_TOKEN  raises the GitHub API rate limit (recommended on Vercel)
 *
 * Usage: node scripts/fetch-badges.mjs
 */

import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "assets", "img");

const SCHOLAR_ID = process.env.SCHOLAR_ID || "1_zc1-IAAAAJ";
const GITHUB_ORG = process.env.GITHUB_ORG || "EvolvingLMMs-Lab";
const GITHUB_USER = process.env.GITHUB_USER || "luodian";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function ghJson(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "luodian-site-badge-fetcher",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  const resp = await fetchWithTimeout(url, { headers });
  if (!resp.ok) throw new Error(`GitHub API ${resp.status} for ${url}`);
  return resp.json();
}

async function sumStars(ownerType, name) {
  let total = 0;
  for (let page = 1; ; page += 1) {
    const repos = await ghJson(
      `https://api.github.com/${ownerType}/${name}/repos?per_page=100&page=${page}`
    );
    if (!Array.isArray(repos) || repos.length === 0) break;
    for (const repo of repos) total += repo.stargazers_count || 0;
    if (repos.length < 100) break;
  }
  return total;
}

async function getGitHubStars() {
  const org = await sumStars("orgs", GITHUB_ORG);
  const user = await sumStars("users", GITHUB_USER);
  console.log(`[badges]   stars breakdown: ${GITHUB_ORG}=${org}, ${GITHUB_USER}=${user}`);
  return org + user;
}

async function getScholarCitations() {
  const resp = await fetchWithTimeout(
    `https://scholar.google.com/citations?user=${SCHOLAR_ID}&hl=en`,
    { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" } }
  );
  if (!resp.ok) throw new Error(`Scholar HTTP ${resp.status}`);
  const html = await resp.text();
  // gsc_rsb_std is Google Scholar's stats-table cell class; first one is the
  // all-time total citation count.
  const match = html.match(/<td class="gsc_rsb_std">(\d+)<\/td>/);
  if (!match) throw new Error("citation count not found in Scholar HTML");
  return parseInt(match[1], 10);
}

function citationsSvg(count) {
  const textWidth = String(count).length * 7 + 10;
  const totalWidth = 76 + textWidth;
  const countX = 76 + Math.floor(textWidth / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="Citations: ${count}"><title>Citations: ${count}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="76" height="20" fill="#555"/><rect x="76" width="${textWidth}" height="20" fill="#007ec6"/><rect width="${totalWidth}" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><image x="5" y="3" width="14" height="14" href="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNDI4NUY0IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R29vZ2xlIFNjaG9sYXI8L3RpdGxlPjxwYXRoIGQ9Ik01LjI0MiAxMy43NjlMMCA5LjUgMTIgMGwxMiA5LjUtNS4yNDIgNC4yNjlDMTcuNTQ4IDExLjI0OSAxNC45NzggOS41IDEyIDkuNWMtMi45NzcgMC01LjU0OCAxLjc0OC02Ljc1OCA0LjI2OXpNMTIgMTBhNyA3IDAgMSAwIDAgMTQgNyA3IDAgMCAwIDAtMTR6Ii8+PC9zdmc+"/><text aria-hidden="true" x="475" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="490">Citations</text><text x="475" y="140" transform="scale(.1)" fill="#fff" textLength="490">Citations</text><text aria-hidden="true" x="${countX * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${textWidth * 10 - 100}">${count}</text><text x="${countX * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${textWidth * 10 - 100}">${count}</text></g></svg>`;
}

function starsSvg(count) {
  const countStr = count.toLocaleString("en-US");
  const textWidth = countStr.length * 8 + 10;
  const totalWidth = 80 + textWidth;
  const countX = 80 + Math.floor(textWidth / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="a"><rect width="${totalWidth}" height="20" rx="3" fill="#fff"/></mask>
  <g mask="url(#a)">
    <path fill="#555" d="M0 0h80v20H0z"/>
    <path fill="#4c1" d="M80 0h${textWidth}v20H80z"/>
    <path fill="url(#b)" d="M0 0h${totalWidth}v20H0z"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="40" y="15" fill="#010101" fill-opacity=".3">GitHub Stars</text>
    <text x="40" y="14">GitHub Stars</text>
    <text x="${countX}" y="15" fill="#010101" fill-opacity=".3">${countStr}</text>
    <text x="${countX}" y="14">${countStr}</text>
  </g>
</svg>`;
}

async function writeBadge(name, label, getValue, makeSvg) {
  const file = join(OUT_DIR, name);
  try {
    const value = await getValue();
    writeFileSync(file, makeSvg(value));
    console.log(`[badges] ${label}: ${value.toLocaleString("en-US")} -> ${name}`);
  } catch (err) {
    const note = existsSync(file)
      ? "keeping synced baseline"
      : "WARNING: no baseline SVG to fall back to";
    console.warn(`[badges] ${label} fetch failed (${err.message}); ${note}`);
  }
}

await writeBadge("github-stars.svg", "GitHub stars", getGitHubStars, starsSvg);
await writeBadge("citations.svg", "Scholar citations", getScholarCitations, citationsSvg);
console.log("[badges] done");
