import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Check the deployable files, including routes served outside the new portfolio.
const output = path.resolve("out");
const routes = [
  "/",
  "/inside/",
  "/projects/",
  "/publications/",
  "/play/",
  "/compression_2025/",
  "/neovim-shortcuts/",
  "/projects/genbench/",
];
for (const route of routes) {
  assert.ok(
    fs.existsSync(path.join(output, route, "index.html")),
    `Missing route: ${route}`,
  );
}
for (const route of routes.slice(0, 4)) {
  const html = fs.readFileSync(path.join(output, route, "index.html"), "utf8");
  assert.equal(
    (html.match(/<h1\b/g) ?? []).length,
    1,
    `${route}: expected one h1`,
  );
  assert.ok(
    html.includes('name="description"'),
    `${route}: missing description`,
  );
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const url = new URL(
      href.replaceAll("&amp;", "&"),
      `https://www.brianboli.com${route}`,
    );
    const file = path.join(
      output,
      url.pathname.endsWith("/") ? `${url.pathname}index.html` : url.pathname,
    );
    assert.ok(fs.existsSync(file), `${route}: broken local link ${href}`);
    if (url.hash) {
      const target = fs.readFileSync(file, "utf8");
      assert.ok(
        target.includes(`id="${url.hash.slice(1)}"`),
        `${route}: missing anchor ${href}`,
      );
    }
  }
}
const papers = fs.readFileSync(
  path.join(output, "publications/index.html"),
  "utf8",
);
for (const title of [
  "LLaVA-OneVision-2",
  "OneVision-Encoder",
  "LLaVA-OneVision-1.5",
  "MMSearch-R1",
  "LongVT",
  "Findings of NAACL 2025",
]) {
  assert.ok(papers.includes(title), `Missing publication: ${title}`);
}
assert.ok(!papers.includes("2.4K GitHub stars"), "Stale star count");
console.log(
  "Export verified: 8 routes, local links and anchors, metadata, and updated publications.",
);
