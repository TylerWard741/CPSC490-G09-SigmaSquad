// UI tests for stories #77 and #79, named by definition of done. Like vehicle-select.test.js,
// these run the real built page from web/dist in jsdom; only fetch is replaced,
// by a fake server that implements the contract in docs/specs/vehicle-service-api.md.
// web/dist is built by `npm install` in prototype/ (the postinstall script).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const DIST_DIR = path.join(__dirname, "..", "..", "web", "dist");
const BUILT_HTML = fs.readFileSync(path.join(DIST_DIR, "index.html"), "utf8");
// The bundle has no imports or exports, so it runs as a classic script; the
// module tag is removed and the bundle is evaluated by openPage instead.
const SCRIPT_TAG = /<script type="module"[^>]*src="\/([^"]+)"[^>]*><\/script>/;
const HTML = BUILT_HTML.replace(SCRIPT_TAG, "");
const SCRIPT = fs.readFileSync(path.join(DIST_DIR, BUILT_HTML.match(SCRIPT_TAG)[1]), "utf8");

const VEHICLES = {
  1: { make: "Toyota", model: "Camry", year: 2020, trim: "LE" },
  2: { make: "Honda", model: "Civic", year: 2022, trim: "Sport", nickname: "Commuter" },
  3: { make: "Toyota", model: "Corolla", year: 2021, trim: "L" },
};
// Newest service_date first, as the API lists them.
const RECORDS = {
  1: [
    { id: 12, vehicle_id: 1, service_type_id: 2, service_type: "Tire rotation", service_date: "2025-09-14", mileage: 36000, notes: null },
    { id: 11, vehicle_id: 1, service_type_id: 1, service_type: "Oil change", service_date: "2025-03-02", mileage: 30500, notes: "Synthetic 0W-20" },
  ],
  2: [
    { id: 20, vehicle_id: 2, service_type_id: 3, service_type: "Brake pads", service_date: "2024-06-01", mileage: 50000, notes: "<img src=x>" },
  ],
};

const SERVICE_TYPES = [
  { id: 3, name: "Brake pads" },
  { id: 1, name: "Oil change" },
  { id: 2, name: "Tire rotation" },
];

function json(status, body) {
  return { ok: status < 400, status, json: async () => body };
}

// Like a real 204 response, the body is empty and json() rejects.
function noContent() {
  return { ok: true, status: 204, json: async () => { throw new SyntaxError("Unexpected end of JSON input"); } };
}

function newestFirst(records) {
  return [...records].sort((a, b) => b.service_date.localeCompare(a.service_date));
}

function patchRecord(record, body) {
  if (body.service_date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(body.service_date)) {
    return json(400, { error: "service_date must be a valid date in YYYY-MM-DD format." });
  }
  if (body.mileage !== undefined && !(Number.isInteger(body.mileage) && body.mileage >= 0)) {
    return json(400, { error: "mileage must be a whole number of 0 or more." });
  }
  const type = SERVICE_TYPES.find((t) => t.id === (body.service_type_id ?? record.service_type_id));
  if (!type) return json(404, { error: "Service type could not be found." });
  Object.assign(record, body, { service_type: type.name });
  return json(200, { service_record: { ...record } });
}

function createServer(saved = [1, 2, 3]) {
  const server = {
    saved: [...saved],
    records: structuredClone(RECORDS),
    calls: [],
    down: false,
    delays: new Map(),
    confirm: true,
    confirmations: [],
  };
  server.fetch = async (href, options = {}) => {
    const method = options.method || "GET";
    server.calls.push({ href, method, body: options.body && JSON.parse(options.body) });
    const delay = server.delays.get(href);
    if (delay) await delay;
    if (server.down === "network") throw new TypeError("Failed to fetch");
    if (server.down) {
      return json(503, { error: "The vehicle database can't be reached. Please try again." });
    }

    const url = new URL(href, "http://test");
    const route = url.pathname;
    let match;
    if (route === "/users/1/vehicles" && method === "GET") {
      const vehicles = server.saved.map((id) => ({ id, trim_id: id, nickname: null, ...VEHICLES[id] }));
      return json(200, { vehicles });
    }
    if ((match = route.match(/^\/vehicles\/(\d+)\/service-records$/)) && method === "GET") {
      const id = Number(match[1]);
      if (!server.saved.includes(id)) return json(404, { error: "Vehicle could not be found." });
      return json(200, { service_records: newestFirst(server.records[id] || []) });
    }
    if ((match = route.match(/^\/vehicles\/(\d+)$/)) && method === "DELETE") {
      const id = Number(match[1]);
      if (!server.saved.includes(id)) return json(404, { error: "Vehicle could not be found." });
      server.saved = server.saved.filter((saved) => saved !== id);
      delete server.records[id];
      return noContent();
    }
    if (route === "/service-types" && method === "GET") {
      return json(200, { service_types: SERVICE_TYPES });
    }
    if ((match = route.match(/^\/service-records\/(\d+)$/))) {
      const id = Number(match[1]);
      const owner = Object.keys(server.records).find((vehicle) =>
        server.records[vehicle].some((record) => record.id === id),
      );
      if (!owner) return json(404, { error: "Service record could not be found." });
      if (method === "PATCH") {
        return patchRecord(server.records[owner].find((record) => record.id === id), JSON.parse(options.body));
      }
      if (method === "DELETE") {
        server.records[owner] = server.records[owner].filter((record) => record.id !== id);
        return noContent();
      }
    }
    return json(404, { error: "not found" });
  };
  return server;
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 5));

async function openPage(t, { server = createServer(), hash = "#dashboard" } = {}) {
  const dom = new JSDOM(HTML, { runScripts: "outside-only", url: `http://test/${hash}` });
  t.after(() => dom.window.close());
  dom.window.fetch = server.fetch;
  dom.window.confirm = (message) => {
    server.confirmations.push(message);
    return server.confirm;
  };
  dom.window.eval(SCRIPT);
  const doc = dom.window.document;
  // React renders asynchronously; wait for the page before its first fetch settles.
  const ready = hash === "#dashboard" ? "dash-vehicles" : "make";
  while (!doc.getElementById(ready)) await settle();
  await settle();

  // The four data columns; the Actions column (#79) holds only buttons.
  const rows = () =>
    [...doc.querySelectorAll("#dash-records tr")].map((tr) =>
      [...tr.cells].slice(0, 4).map((cell) => cell.textContent),
    );
  const recordRow = (id) => doc.querySelector(`#dash-records tr[data-record-id="${id}"]`);
  const buttonIn = (scope, text) => [...scope.querySelectorAll("button")].find((b) => b.textContent === text);
  const page = {
    server,
    doc,
    vehicleLabels: () => [...doc.querySelectorAll("#dash-vehicles [data-vehicle-id]")].map((b) => b.textContent),
    error: () => (doc.getElementById("dash-error").hidden ? "" : doc.getElementById("dash-error-text").textContent),
    message: () => (doc.getElementById("dash-history-message").hidden ? "" : doc.getElementById("dash-history-message").textContent),
    recordsTableHidden: () => doc.getElementById("dash-records-table").hidden,
    rows,
    async clickVehicle(id) {
      doc.querySelector(`[data-vehicle-id="${id}"]`).click();
      await settle();
    },
    async click(id) {
      doc.getElementById(id).click();
      await settle();
    },
    status: () => (doc.getElementById("dash-status").hidden ? "" : doc.getElementById("dash-status").textContent),
    recordRow,
    async recordAction(id, text) {
      buttonIn(recordRow(id), text).click();
      await settle();
    },
    fill(id, name, value) {
      const input = recordRow(id).querySelector(`[name="${name}"]`);
      input.value = value;
      input.dispatchEvent(new dom.window.Event("input"));
    },
    async deleteVehicle(id) {
      doc.querySelector(`[data-delete-vehicle-id="${id}"]`).click();
      await settle();
    },
  };
  return page;
}

test("DoD1: the dashboard lists every vehicle saved to the demo user's account", async (t) => {
  const page = await openPage(t);
  assert.deepEqual(page.vehicleLabels(), [
    "2020 Toyota Camry LE",
    "Commuter (2022 Honda Civic Sport)",
    "2021 Toyota Corolla L",
  ]);
  assert.equal(page.doc.getElementById("dash-vehicles-empty").hidden, true);
});

test("DoD1: a user with no saved vehicles sees the empty state", async (t) => {
  const page = await openPage(t, { server: createServer([]) });
  assert.deepEqual(page.vehicleLabels(), []);
  assert.equal(page.doc.getElementById("dash-vehicles-empty").hidden, false);
});

test("DoD1: a failed vehicle list shows an error", async (t) => {
  const server = createServer();
  server.down = true;
  const page = await openPage(t, { server });
  assert.match(page.error(), /can't be reached/);
  assert.deepEqual(page.vehicleLabels(), []);
});

test("DoD2: selecting a vehicle requests its records and lists them newest first", async (t) => {
  const page = await openPage(t);
  await page.clickVehicle(1);
  const request = page.server.calls.find((call) => call.href === "/vehicles/1/service-records");
  assert.ok(request, "should request /vehicles/1/service-records");
  assert.equal(request.method, "GET");
  assert.deepEqual(page.rows(), [
    ["2025-09-14", "Tire rotation", "36000", ""],
    ["2025-03-02", "Oil change", "30500", "Synthetic 0W-20"],
  ]);
  assert.equal(page.recordsTableHidden(), false);
  assert.equal(page.doc.querySelector('[data-vehicle-id="1"]').getAttribute("aria-pressed"), "true");
  assert.equal(page.doc.querySelector('[data-vehicle-id="2"]').getAttribute("aria-pressed"), "false");
});

test("DoD2: switching vehicles shows the other vehicle's records", async (t) => {
  const page = await openPage(t);
  await page.clickVehicle(1);
  await page.clickVehicle(2);
  assert.deepEqual(page.rows(), [["2024-06-01", "Brake pads", "50000", "<img src=x>"]]);
  assert.equal(page.doc.querySelector("#dash-records img"), null);
  assert.match(page.doc.getElementById("dash-history-title").textContent, /Commuter/);
});

test("DoD2: a vehicle with no records shows the empty state", async (t) => {
  const page = await openPage(t);
  await page.clickVehicle(3);
  assert.equal(page.message(), "No service records yet.");
  assert.equal(page.recordsTableHidden(), true);
  assert.deepEqual(page.rows(), []);
});

test("DoD2: a slow response for a previously selected vehicle is ignored", async (t) => {
  const page = await openPage(t);
  let release;
  page.server.delays.set("/vehicles/1/service-records", new Promise((resolve) => { release = resolve; }));
  await page.clickVehicle(1);
  await page.clickVehicle(2);
  release();
  await settle();
  assert.deepEqual(page.rows(), [["2024-06-01", "Brake pads", "50000", "<img src=x>"]]);
});

test("DoD2: when the API returns 503, selecting shows an error and Retry recovers", async (t) => {
  const page = await openPage(t);
  page.server.down = true;
  await page.clickVehicle(1);

  assert.match(page.error(), /can't be reached/);
  assert.deepEqual(page.rows(), []);

  page.server.down = false;
  await page.click("dash-retry");

  assert.equal(page.error(), "");
  assert.deepEqual(page.rows()[0], ["2025-09-14", "Tire rotation", "36000", ""]);
});

test("DoD2: when the API returns 503 on first load, Retry recovers the vehicle list", async (t) => {
  const server = createServer();
  server.down = true;
  const page = await openPage(t, { server });
  assert.match(page.error(), /can't be reached/);

  server.down = false;
  await page.click("dash-retry");
  assert.equal(page.error(), "");
  assert.equal(page.vehicleLabels().length, 3);
});

test("the dashboard is only shown with the #dashboard hash, and the pages link to each other", async (t) => {
  const page = await openPage(t, { hash: "" });
  assert.equal(page.doc.getElementById("dash-vehicles"), null);
  assert.equal(page.doc.querySelector('a[href="#dashboard"]').textContent, "Dashboard");
  assert.equal(page.doc.querySelector('a[href="#"]').textContent, "Add a vehicle");
});

test("#79 DoD1: editing a service record saves it and the table shows the change", async (t) => {
  const page = await openPage(t);
  await page.clickVehicle(1);
  await page.recordAction(11, "Edit");
  assert.equal(page.recordRow(11).querySelector('[name="service_type_id"]').value, "1");
  page.fill(11, "mileage", "30750");
  page.fill(11, "notes", "Full synthetic 0W-20");
  page.recordRow(11).querySelector('[name="service_type_id"]').value = "3";
  await page.recordAction(11, "Save");

  const patch = page.server.calls.find((call) => call.method === "PATCH");
  assert.equal(patch.href, "/service-records/11");
  assert.deepEqual(patch.body, {
    service_date: "2025-03-02",
    service_type_id: 3,
    mileage: 30750,
    notes: "Full synthetic 0W-20",
  });
  assert.deepEqual(page.rows(), [
    ["2025-09-14", "Tire rotation", "36000", ""],
    ["2025-03-02", "Brake pads", "30750", "Full synthetic 0W-20"],
  ]);
  assert.equal(page.status(), "Service record updated.");
});

test("#79 DoD1: changing a record's date re-sorts the history newest first", async (t) => {
  const page = await openPage(t);
  await page.clickVehicle(1);
  await page.recordAction(11, "Edit");
  page.fill(11, "service_date", "2025-10-01");
  await page.recordAction(11, "Save");
  assert.deepEqual(page.rows().map((row) => row[0]), ["2025-10-01", "2025-09-14"]);
});

test("#79 DoD1: Cancel leaves the record unchanged and sends nothing", async (t) => {
  const page = await openPage(t);
  await page.clickVehicle(1);
  await page.recordAction(11, "Edit");
  page.fill(11, "mileage", "1");
  await page.recordAction(11, "Cancel");
  assert.equal(page.server.calls.some((call) => call.method === "PATCH"), false);
  assert.deepEqual(page.rows()[1], ["2025-03-02", "Oil change", "30500", "Synthetic 0W-20"]);
});

test("#79 DoD1: a rejected edit shows the server's message and keeps the form open", async (t) => {
  const page = await openPage(t);
  await page.clickVehicle(1);
  await page.recordAction(11, "Edit");
  page.fill(11, "mileage", "-5");
  await page.recordAction(11, "Save");
  assert.match(page.error(), /mileage/);
  assert.ok(page.recordRow(11).querySelector('[name="mileage"]'), "the edit form should stay open");
  assert.equal(page.server.records[1].find((record) => record.id === 11).mileage, 30500);

  page.fill(11, "mileage", "30600");
  await page.recordAction(11, "Save");
  assert.equal(page.error(), "");
  assert.equal(page.rows()[1][2], "30600");
});

test("#79 DoD2: deleting a service record after confirming removes it", async (t) => {
  const page = await openPage(t);
  await page.clickVehicle(1);
  await page.recordAction(12, "Delete");
  assert.match(page.server.confirmations[0], /Tire rotation/);
  assert.ok(page.server.calls.some((call) => call.method === "DELETE" && call.href === "/service-records/12"));
  assert.deepEqual(page.rows(), [["2025-03-02", "Oil change", "30500", "Synthetic 0W-20"]]);
  assert.equal(page.status(), "Service record deleted.");
});

test("#79 DoD2: deleting the last record shows the empty state", async (t) => {
  const page = await openPage(t);
  await page.clickVehicle(2);
  await page.recordAction(20, "Delete");
  assert.equal(page.message(), "No service records yet.");
  assert.equal(page.recordsTableHidden(), true);
});

test("#79 DoD2: declining the confirmation deletes nothing", async (t) => {
  const page = await openPage(t);
  page.server.confirm = false;
  await page.clickVehicle(1);
  await page.recordAction(12, "Delete");
  await page.deleteVehicle(1);
  assert.equal(page.server.calls.some((call) => call.method === "DELETE"), false);
  assert.equal(page.rows().length, 2);
  assert.equal(page.vehicleLabels().length, 3);
});

test("#79 DoD2: deleting the selected vehicle removes it and clears its history", async (t) => {
  const page = await openPage(t);
  await page.clickVehicle(1);
  await page.deleteVehicle(1);
  assert.match(page.server.confirmations[0], /2020 Toyota Camry LE/);
  assert.ok(page.server.calls.some((call) => call.method === "DELETE" && call.href === "/vehicles/1"));
  assert.deepEqual(page.vehicleLabels(), ["Commuter (2022 Honda Civic Sport)", "2021 Toyota Corolla L"]);
  assert.deepEqual(page.rows(), []);
  assert.equal(page.message(), "Select a vehicle to see its service history.");
  assert.equal(page.status(), "Deleted 2020 Toyota Camry LE.");
});

test("#79 DoD2: deleting another vehicle keeps the selected vehicle's history", async (t) => {
  const page = await openPage(t);
  await page.clickVehicle(1);
  await page.deleteVehicle(3);
  assert.equal(page.vehicleLabels().length, 2);
  assert.equal(page.rows().length, 2);
  assert.equal(page.doc.querySelector('[data-vehicle-id="1"]').getAttribute("aria-pressed"), "true");
});

test("#79 DoD2: when deleting a vehicle returns 503, Retry deletes it", async (t) => {
  const page = await openPage(t);
  page.server.down = true;
  await page.deleteVehicle(2);
  assert.match(page.error(), /can't be reached/);
  assert.equal(page.vehicleLabels().length, 3);

  page.server.down = false;
  await page.click("dash-retry");
  assert.equal(page.error(), "");
  assert.deepEqual(page.vehicleLabels(), ["2020 Toyota Camry LE", "2021 Toyota Corolla L"]);
});
