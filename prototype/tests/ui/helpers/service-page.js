// Shared helpers for the service-record page tests (#85, #86, #87).
// Same approach as vehicle-select.test.js: run the real built page in jsdom, replace only fetch.
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const DIST_DIR = path.join(__dirname, "..", "..", "..", "web", "dist");
const BUILT_HTML = fs.readFileSync(path.join(DIST_DIR, "index.html"), "utf8");
const SCRIPT_TAG = /<script type="module"[^>]*src="\/([^"]+)"[^>]*><\/script>/;
const HTML = BUILT_HTML.replace(SCRIPT_TAG, "");
const SCRIPT = fs.readFileSync(path.join(DIST_DIR, BUILT_HTML.match(SCRIPT_TAG)[1]), "utf8");

const DB_DOWN = "The vehicle database can't be reached. Please try again.";
const json = (status, body) => ({ ok: status < 400, status, json: async () => body });

const SERVICE_TYPES = [
  { id: 1, name: "Oil change" },
  { id: 2, name: "Tire rotation" },
  { id: 3, name: "Brake inspection" },
];
const CAMRY = { id: 1, trim_id: 2, make: "Toyota", model: "Camry", year: 2020, trim: "SE", nickname: null };
const CIVIC = { id: 2, trim_id: 4, make: "Honda", model: "Civic", year: 2019, trim: "EX", nickname: "Commuter" };

function realDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

// Enforces the same rules as docs/specs/vehicle-service-api.md so front-end bugs show up here.
function checkNewRecord(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) return [400, "Body must be a JSON object."];
  const allowed = ["service_type_id", "service_date", "mileage", "notes"];
  const extra = Object.keys(body).find((k) => !allowed.includes(k));
  if (extra) return [400, `Unknown field: ${extra}.`];
  if (!Number.isInteger(body.service_type_id) || body.service_type_id <= 0) return [400, "service_type_id must be a positive integer."];
  if (typeof body.service_date !== "string" || !realDate(body.service_date)) return [400, "service_date must be a valid date in YYYY-MM-DD format."];
  if (body.service_date > new Date().toISOString().slice(0, 10)) return [400, "service_date cannot be in the future."];
  if (!Number.isInteger(body.mileage) || body.mileage < 0) return [400, "mileage must be an integer of 0 or more."];
  if (body.notes !== undefined && (typeof body.notes !== "string" || body.notes.length > 1000)) return [400, "notes must be text of at most 1000 characters."];
  if (!SERVICE_TYPES.some((t) => t.id === body.service_type_id)) return [404, "Service type could not be found."];
  return null;
}

function createServiceServer({ vehicles = [CAMRY], records = [] } = {}) {
  const server = { vehicles, records: [...records], calls: [], down: false, failRecords: false };
  server.fetch = async (href, options = {}) => {
    const method = options.method || "GET";
    server.calls.push({ href, method, body: options.body });
    if (server.down === "network") throw new TypeError("Failed to fetch");
    if (server.down) return json(503, { error: DB_DOWN });
    const url = new URL(href, "http://test");

    if (url.pathname === "/makes") return json(200, { makes: [] }); // the #29 part of the page asks for these
    if (url.pathname === "/users/1/vehicles") return json(200, { vehicles: server.vehicles });
    if (url.pathname === "/service-types") return json(200, { service_types: SERVICE_TYPES });

    const m = url.pathname.match(/^\/vehicles\/(\d+)\/service-records$/);
    if (!m) return json(404, { error: "Not found." });
    const vehicleId = Number(m[1]);
    if (!server.vehicles.some((v) => v.id === vehicleId)) return json(404, { error: "Vehicle could not be found." });

    if (method === "POST") {
      const problem = checkNewRecord(JSON.parse(options.body));
      if (problem) return json(problem[0], { error: problem[1] });
      const b = JSON.parse(options.body);
      const type = SERVICE_TYPES.find((t) => t.id === b.service_type_id);
      const record = {
        id: server.records.length + 1, vehicle_id: vehicleId, service_type_id: type.id, service_type: type.name,
        service_date: b.service_date, mileage: b.mileage, notes: b.notes ?? null,
      };
      server.records.push(record);
      return json(201, { service_record: record });
    }

    if (server.failRecords) return json(503, { error: DB_DOWN });
    const mine = server.records.filter((r) => r.vehicle_id === vehicleId)
      .sort((a, b) => b.service_date.localeCompare(a.service_date)); // newest first, as the spec says
    return json(200, { service_records: mine }); // no records = 200 with an empty list
  };
  return server;
}

async function openPage(server, t) {
  const dom = new JSDOM(HTML, { url: "http://127.0.0.1:5000/", runScripts: "outside-only", pretendToBeVisual: true });
  dom.window.fetch = server.fetch;
  dom.window.eval(SCRIPT);
  if (t) t.after(() => dom.window.close());
  const { window } = dom;
  return { window, document: window.document, $: (id) => window.document.getElementById(id) };
}

// React renders asynchronously, so poll until the check passes instead of sleeping a fixed time.
async function waitFor(check, timeout = 2000) {
  const start = Date.now();
  let lastError;
  for (;;) {
    try { const v = check(); if (v) return v; } catch (e) { lastError = e; }
    if (Date.now() - start > timeout) throw lastError || new Error("waitFor timed out");
    await new Promise((r) => setTimeout(r, 10));
  }
}

// React ignores .value = "x" on controlled inputs unless the NATIVE setter is used, so go through the prototype.
function setValue(window, el, value) {
  const proto = el.tagName === "SELECT" ? window.HTMLSelectElement.prototype
    : el.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype
    : window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
  el.dispatchEvent(new window.Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
}

module.exports = { openPage, createServiceServer, waitFor, setValue, CAMRY, CIVIC, DB_DOWN };