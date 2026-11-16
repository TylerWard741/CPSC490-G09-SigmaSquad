// Browser tests for task #78 (responsive dashboard), run in real Chromium via
// Playwright because jsdom does no layout. Each test opens the built page
// (web/dist) at a given viewport width with the API stubbed, selects a vehicle,
// and measures what the browser actually laid out.
// First run on a machine: `npx playwright install chromium` in prototype/.
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const DIST_DIR = path.join(__dirname, "..", "..", "web", "dist");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
// Common phone widths, then tablet and desktop. The table layout starts at
// 768px (Tailwind's md breakpoint).
const PHONE_WIDTHS = [320, 375, 414];
const WIDE_WIDTHS = [768, 1100];
const MIN_TAP_TARGET_PX = 44;

const VEHICLES = {
  vehicles: [
    { id: 1, make: "Toyota", model: "Camry", year: 2020, trim: "LE", nickname: "Daily driver with a very long nickname" },
    { id: 2, make: "Honda", model: "Civic", year: 2022, trim: "Sport", nickname: null },
  ],
};
const RECORDS = {
  service_records: [
    { id: 12, vehicle_id: 1, service_type_id: 2, service_type: "Tire rotation", service_date: "2025-09-14", mileage: 36000, notes: "Rotated front to back and checked tread depth on all four tires" },
    // An unbroken string is the case most likely to push the page wider than the screen.
    { id: 11, vehicle_id: 1, service_type_id: 1, service_type: "Oil change", service_date: "2025-03-02", mileage: 30500, notes: "A".repeat(80) },
  ],
};

let server;
let baseUrl;
let browser;

before(async () => {
  server = http.createServer((request, response) => {
    const file = request.url.split("#")[0].split("?")[0];
    const target = path.join(DIST_DIR, file === "/" ? "index.html" : file);
    if (!target.startsWith(DIST_DIR) || !fs.existsSync(target)) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "Content-Type": TYPES[path.extname(target)] || "application/octet-stream" });
    response.end(fs.readFileSync(target));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  await new Promise((resolve) => server?.close(resolve));
});

// Opens the dashboard at one width with a vehicle selected and its records shown.
async function openDashboard(width) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.route("**/users/1/vehicles", (route) => route.fulfill({ json: VEHICLES }));
  await page.route("**/vehicles/*/service-records", (route) => route.fulfill({ json: RECORDS }));
  await page.goto(`${baseUrl}/#dashboard`);
  await page.locator(".vehicle-button").first().click();
  await page.locator("#dash-records-table").waitFor({ state: "visible" });
  return page;
}

async function cellTops(page) {
  return page.locator("#dash-records tr").first().locator("td").evaluateAll(
    (cells) => cells.map((cell) => Math.round(cell.getBoundingClientRect().top)),
  );
}

for (const width of [...PHONE_WIDTHS, ...WIDE_WIDTHS]) {
  test(`#78: at ${width}px the page is no wider than the screen (no horizontal scroll)`, async () => {
    const page = await openDashboard(width);
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    await page.close();
    assert.equal(clientWidth, width);
    assert.ok(scrollWidth <= clientWidth, `page is ${scrollWidth}px wide on a ${clientWidth}px screen`);
  });

  test(`#78: at ${width}px every visible button and field is at least ${MIN_TAP_TARGET_PX}px tall`, async () => {
    const page = await openDashboard(width);
    const heights = await page.locator("button, input, select").evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height).filter((height) => height > 0),
    );
    await page.close();
    assert.ok(heights.length > 0, "found no controls to measure");
    assert.ok(Math.min(...heights) >= MIN_TAP_TARGET_PX, `smallest control is ${Math.min(...heights)}px`);
  });
}

for (const width of PHONE_WIDTHS) {
  test(`#78: at ${width}px each service record is a stacked card and the column headings are hidden`, async () => {
    const page = await openDashboard(width);
    const headingsVisible = await page.locator("#dash-records-table thead").isVisible();
    const tops = await cellTops(page);
    await page.close();
    assert.equal(headingsVisible, false);
    // Stacked: every field of the record sits lower than the one before it.
    assert.deepEqual(tops, [...tops].sort((a, b) => a - b));
    assert.equal(new Set(tops).size, tops.length, `cells share a row: ${tops}`);
  });
}

for (const width of WIDE_WIDTHS) {
  test(`#78: at ${width}px the records are a table row with column headings`, async () => {
    const page = await openDashboard(width);
    const headingsVisible = await page.locator("#dash-records-table thead").isVisible();
    const tops = await cellTops(page);
    await page.close();
    assert.equal(headingsVisible, true);
    assert.equal(new Set(tops).size, 1, `cells are not on one row: ${tops}`);
  });
}

test("#78: the page declares a device-width viewport so phones don't zoom out", () => {
  const html = fs.readFileSync(path.join(DIST_DIR, "index.html"), "utf8");
  assert.match(html, /<meta[^>]+name="viewport"[^>]+width=device-width/);
});
