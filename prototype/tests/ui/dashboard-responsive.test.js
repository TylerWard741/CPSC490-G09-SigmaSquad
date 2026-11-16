// UI tests for task #78 (responsive dashboard). jsdom does no layout, so these
// check the markup the phone layout depends on; real widths are checked by hand.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const DIST_DIR = path.join(__dirname, "..", "..", "web", "dist");
const HTML = fs.readFileSync(path.join(DIST_DIR, "index.html"), "utf8");
const BUNDLE = fs
  .readdirSync(DIST_DIR, { recursive: true })
  .filter((file) => /\.(js|css)$/.test(file))
  .map((file) => fs.readFileSync(path.join(DIST_DIR, file), "utf8"))
  .join("\n");

test("the page sets a device-width viewport so phones don't zoom out", () => {
  assert.match(HTML, /<meta[^>]+name="viewport"[^>]+width=device-width/);
});

test("the records table collapses into stacked cards below the md breakpoint", () => {
  // Tailwind emits these utilities only if dashboard.tsx uses them.
  for (const utility of ["md\\:table-cell", "md\\:table-row", "md\\:table-header-group"]) {
    assert.ok(BUNDLE.includes(utility), `missing ${utility} in the built CSS`);
  }
});

test("buttons and inputs are at least 44px (2.75rem) tall for tapping", () => {
  assert.match(BUNDLE, /min-height:\s*2\.75rem/);
});
