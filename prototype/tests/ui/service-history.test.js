const { test } = require("node:test");
const assert = require("node:assert/strict");
const { openPage, createServiceServer, waitFor, setValue, CAMRY, CIVIC } = require("./helpers/service-page");

const rec = (id, vehicle_id, service_date, service_type_id, service_type, mileage, notes = null) =>
  ({ id, vehicle_id, service_type_id, service_type, service_date, mileage, notes });

test("DoD 1: opening a vehicle's history shows its saved records, newest first", async (t) => {
  const server = createServiceServer({
    records: [rec(1, 1, "2026-01-10", 1, "Oil change", 30000),
              rec(2, 1, "2026-06-01", 2, "Tire rotation", 35000, "Rotated")],
  });
  const page = await openPage(server, t);
  await waitFor(() => page.$("history-table"));
  const rows = [...page.document.querySelectorAll("#history-table tbody tr")];
  assert.equal(rows.length, 2);
  assert.match(rows[0].textContent, /2026-06-01.*35000.*Tire rotation.*Rotated/);
  assert.match(rows[1].textContent, /2026-01-10.*30000.*Oil change/);
});

test("DoD 2: a vehicle with no records shows an empty state, not an error", async (t) => {
  const page = await openPage(createServiceServer(), t);
  await waitFor(() => page.$("history-empty"));
  assert.match(page.$("history-empty").textContent, /No service records saved/);
  assert.equal(page.$("history-error"), null);
});

test("each vehicle shows only its own records", async (t) => {
  const server = createServiceServer({
    vehicles: [CAMRY, CIVIC],
    records: [rec(1, 1, "2026-01-10", 1, "Oil change", 30000), rec(2, 2, "2026-02-01", 3, "Brake inspection", 12000)],
  });
  const page = await openPage(server, t);
  await waitFor(() => /Oil change/.test(page.$("history-table")?.textContent || ""));
  setValue(page.window, page.$("sr-vehicle"), "2");
  await waitFor(() => /Brake inspection/.test(page.$("history-table")?.textContent || ""));
  assert.doesNotMatch(page.$("history-table").textContent, /Oil change/);
});

test("a database error is shown instead of an empty table", async (t) => {
  const server = createServiceServer();
  server.failRecords = true;
  const page = await openPage(server, t);
  await waitFor(() => page.$("history-error"));
  assert.match(page.$("history-error").textContent, /can't be reached/);
  assert.equal(page.$("history-empty"), null);
});

test("saving a record through the form updates the history", async (t) => {
  const server = createServiceServer();
  const page = await openPage(server, t);
  await waitFor(() => page.$("history-empty"));
  await waitFor(() => page.$("sr-type").options.length > 1);
  setValue(page.window, page.$("sr-date"), "2026-10-15");
  setValue(page.window, page.$("sr-mileage"), "42150");
  setValue(page.window, page.$("sr-type"), "1");
  await waitFor(() => page.$("sr-save").disabled === false);
  page.$("sr-save").click();
  await waitFor(() => /2026-10-15/.test(page.$("history-table")?.textContent || ""));
});
