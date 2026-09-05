import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

const LEGACY_ROOT_CANDIDATES = [
  path.resolve(process.cwd(), "legacy"),
  path.resolve(process.cwd(), "docs"),
  path.resolve(process.cwd(), "..", "docs")
];

const legacyRoot =
  LEGACY_ROOT_CANDIDATES.find((candidate) => fs.existsSync(candidate)) ??
  LEGACY_ROOT_CANDIDATES[2];

export type LegacyDocument = {
  title: string;
  description: string;
  html: string;
  sourcePath: string;
};

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function walkHtmlFiles(dir: string, rootDir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkHtmlFiles(fullPath, rootDir));
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".html")) {
      continue;
    }
    files.push(toPosix(path.relative(rootDir, fullPath)));
  }
  return files.sort();
}

function extractFirst(pattern: RegExp, input: string): string {
  return pattern.exec(input)?.[1]?.trim() ?? "";
}

function keepRenderableHead(headContent: string): string {
  return headContent
    .replace(/<meta[^>]*charset[^>]*>\s*/gi, "")
    .replace(/<meta[^>]*name=["']viewport["'][^>]*>\s*/gi, "")
    .replace(/<meta[^>]*name=["']description["'][^>]*>\s*/gi, "")
    .replace(/<title[\s\S]*?<\/title>\s*/gi, "")
    .trim();
}

export function loadLegacyDocument(relativeHtmlPath: string): LegacyDocument {
  const sourcePath = path.join(legacyRoot, relativeHtmlPath);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Legacy page not found: ${relativeHtmlPath}`);
  }

  const rawHtml = fs.readFileSync(sourcePath, "utf8");
  const headContent = extractFirst(/<head[^>]*>([\s\S]*?)<\/head>/i, rawHtml);
  const bodyContent = extractFirst(/<body[^>]*>([\s\S]*?)<\/body>/i, rawHtml);

  if (!headContent || !bodyContent) {
    throw new Error(`Invalid legacy HTML format: ${relativeHtmlPath}`);
  }

  const title = extractFirst(/<title[^>]*>([\s\S]*?)<\/title>/i, rawHtml);
  const description = extractFirst(
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
    rawHtml
  );

  const renderableHead = keepRenderableHead(headContent);
  const html = `${renderableHead}\n${bodyContent}`;

  return {
    title: title || "Personal Homepage",
    description,
    html,
    sourcePath
  };
}

export function buildLegacyMetadata(relativeHtmlPath: string): Metadata {
  const page = loadLegacyDocument(relativeHtmlPath);
  return {
    title: page.title,
    description: page.description || undefined
  };
}

export function slugToLegacySource(slug: string[]): string | null {
  const slugPath = slug.join("/");
  const indexCandidate = `${slugPath}/index.html`;
  const htmlCandidate = `${slugPath}.html`;

  const indexPath = path.join(legacyRoot, indexCandidate);
  if (fs.existsSync(indexPath)) {
    return indexCandidate;
  }

  const htmlPath = path.join(legacyRoot, htmlCandidate);
  if (fs.existsSync(htmlPath)) {
    return htmlCandidate;
  }

  return null;
}

export function listLegacySlugs(): string[][] {
  const htmlFiles = walkHtmlFiles(legacyRoot, legacyRoot);

  return htmlFiles
    .map((relativeHtmlPath) => {
      if (relativeHtmlPath === "index.html") {
        return [];
      }
      if (relativeHtmlPath.endsWith("/index.html")) {
        return relativeHtmlPath
          .replace(/\/index\.html$/i, "")
          .split("/")
          .filter(Boolean);
      }
      return relativeHtmlPath
        .replace(/\.html$/i, "")
        .split("/")
        .filter(Boolean);
    })
    .filter((slug) => slug.length > 0);
}
