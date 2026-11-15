const { test } = require("node:test");
const assert = require("node:assert/strict");
const { openPage, createServiceServer, waitFor } = require("./helpers/service-page");

async function ready(t, server) {
  const page = await openPage(server, t);
  await waitFor(() => page.$("imp-file"));
  return page;
}

function upload(page, name, text) {
  const file = new page.window.File([text], name, { type: "text/csv" });
  const input = page.$("imp-file");
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  input.dispatchEvent(new page.window.Event("change", { bubbles: true }));
}

const HEADER = "service_date,mileage,service_type,notes\n";

test("DoD 1+2: a valid file is read, validated and every row saves", async (t) => {
  const server = createServiceServer();
  const page = await ready(t, server);
  upload(page, "history.csv", `${HEADER}2026-01-10,30000,Oil change,"synthetic, 0W-20"\n2026-03-02,32000,Tire rotation,\n`);
  await waitFor(() => page.$("imp-go"));
  assert.match(page.$("imp-go").textContent, /2 valid row/);
  page.$("imp-go").click();
  await waitFor(() => server.records.length === 2);
  assert.equal(server.records[0].notes, "synthetic, 0W-20");
  assert.equal(server.records[0].vehicle_id, 1);
  await waitFor(() => /Row 2: saved/.test(page.$("imp-rows").textContent));
});

test("DoD 3: a row with missing mileage names the problem and is not saved; valid rows still save", async (t) => {
  const server = createServiceServer();
  const page = await ready(t, server);
  upload(page, "history.csv", `${HEADER}2026-01-10,30000,Oil change,\n2026-03-02,,Tire rotation,\n`);
  await waitFor(() => /Row 3: Mileage is required/.test(page.$("imp-rows").textContent));
  assert.match(page.$("imp-go").textContent, /1 valid row/);
  page.$("imp-go").click();
  await waitFor(() => server.records.length === 1);
  assert.equal(server.records[0].service_type, "Oil change");
});

test("an impossible date and an unknown service type are both reported", async (t) => {
  const server = createServiceServer();
  const page = await ready(t, server);
  upload(page, "history.csv", `${HEADER}2026-13-40,30000,Oil change,\n2026-01-10,30000,Flux capacitor,\n`);
  await waitFor(() => /Row 2: .*real date/.test(page.$("imp-rows").textContent));
  assert.match(page.$("imp-rows").textContent, /Row 3: .*Unknown service type "Flux capacitor"/);
  assert.equal(page.$("imp-go"), null); // nothing valid to import
  assert.equal(server.records.length, 0);
});

test("a non-CSV file and a file missing a required column are rejected", async (t) => {
  const server = createServiceServer();
  const page = await ready(t, server);
  upload(page, "history.pdf", "x");
  await waitFor(() => /\.csv/.test(page.$("imp-error").textContent));
  upload(page, "history.csv", "service_date,notes\n2026-01-10,hi\n");
  await waitFor(() => /Missing column\(s\): mileage, service_type/.test(page.$("imp-error").textContent));
  assert.equal(server.records.length, 0);
});