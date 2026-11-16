const { test } = require("node:test");
const assert = require("node:assert/strict");
const { openPage, createServiceServer, waitFor, setValue, CAMRY, CIVIC } = require("./helpers/service-page");

async function ready(t, server) {
  const page = await openPage(server, t);
  await waitFor(() => page.$("sr-form"));
  await waitFor(() => page.$("sr-type").options.length > 1); // service types have loaded
  return page;
}

function fill(page, v = {}) {
  const { $, window } = page;
  setValue(window, $("sr-date"), v.date ?? "2026-10-15");
  setValue(window, $("sr-mileage"), v.mileage ?? "42150");
  setValue(window, $("sr-type"), v.type ?? "1");
  if (v.notes !== undefined) setValue(window, $("sr-notes"), v.notes);
}

test("DoD 1: the form captures date, mileage, service type and optional notes", async (t) => {
  const page = await ready(t, createServiceServer());
  for (const id of ["sr-date", "sr-mileage", "sr-type", "sr-notes"]) assert.ok(page.$(id), id);
  const names = [...page.$("sr-type").options].map((o) => o.textContent);
  assert.deepEqual(names, ["Select a service type", "Oil change", "Tire rotation", "Brake inspection"]);
});

test("DoD 2: Save stays disabled until every required field is valid", async (t) => {
  const page = await ready(t, createServiceServer());
  const { $, window } = page;
  assert.equal($("sr-save").disabled, true);

  setValue(window, $("sr-date"), "2026-10-15");
  setValue(window, $("sr-mileage"), "42150"); // still no service type
  await waitFor(() => $("sr-mileage").value === "42150");
  assert.equal($("sr-save").disabled, true);

  setValue(window, $("sr-type"), "1");
  await waitFor(() => $("sr-save").disabled === false);

  setValue(window, $("sr-date"), "2999-01-01"); // future date
  await waitFor(() => $("sr-save").disabled === true);
  assert.match($("sr-errors").textContent, /future/i);

  setValue(window, $("sr-date"), "2026-10-15");
  setValue(window, $("sr-mileage"), "100.5"); // not a whole number
  await waitFor(() => $("sr-save").disabled === true);
});

test("DoD 3: a valid entry saves and is associated with the selected vehicle", async (t) => {
  const server = createServiceServer();
  const page = await ready(t, server);
  fill(page, { notes: "Synthetic 0W-20" });
  await waitFor(() => page.$("sr-save").disabled === false);
  page.$("sr-save").click();

  await waitFor(() => server.records.length === 1);
  const post = server.calls.find((c) => c.method === "POST");
  assert.equal(post.href, "/vehicles/1/service-records");
  assert.deepEqual(JSON.parse(post.body),
    { service_type_id: 1, service_date: "2026-10-15", mileage: 42150, notes: "Synthetic 0W-20" });
  await waitFor(() => /saved/i.test(page.$("sr-status").textContent));
});

test("empty notes are left out of the request", async (t) => {
  const server = createServiceServer();
  const page = await ready(t, server);
  fill(page);
  await waitFor(() => page.$("sr-save").disabled === false);
  page.$("sr-save").click();
  await waitFor(() => server.records.length === 1);
  assert.deepEqual(Object.keys(JSON.parse(server.calls.find((c) => c.method === "POST").body)).sort(),
    ["mileage", "service_date", "service_type_id"]);
});

test("DoD 3: choosing another saved vehicle saves under that vehicle", async (t) => {
  const server = createServiceServer({ vehicles: [CAMRY, CIVIC] });
  const page = await ready(t, server);
  setValue(page.window, page.$("sr-vehicle"), "2");
  await waitFor(() => page.$("sr-vehicle").value === "2");
  await waitFor(() => page.$("sr-type").options.length > 1); // form remounts for the new vehicle
  fill(page);
  await waitFor(() => page.$("sr-save").disabled === false);
  page.$("sr-save").click();
  await waitFor(() => server.records.length === 1);
  assert.equal(server.records[0].vehicle_id, 2);
});

test("a failed save shows the API's message and keeps what the user typed", async (t) => {
  const server = createServiceServer();
  const page = await ready(t, server);
  fill(page);
  await waitFor(() => page.$("sr-save").disabled === false);
  server.down = true;
  page.$("sr-save").click();
  await waitFor(() => /can't be reached/i.test(page.$("sr-status").textContent));
  assert.equal(page.$("sr-mileage").value, "42150");
  assert.equal(server.records.length, 0);
});

test("with no saved vehicle the form is not offered", async (t) => {
  const page = await openPage(createServiceServer({ vehicles: [] }), t);
  await waitFor(() => page.$("sr-no-vehicle"));
  assert.equal(page.$("sr-form"), null);
});