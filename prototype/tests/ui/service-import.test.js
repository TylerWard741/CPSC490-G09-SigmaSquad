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
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

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
  await waitFor(() => /Row 2: saved/.test(page.$("imp-rows").textContent));
  // review item 3: the validation error is still listed after the import
  assert.match(page.$("imp-rows").textContent, /Row 3: Mileage is required/);
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

test("review 1: double-clicking Import saves each row only once", async (t) => {
  const server = createServiceServer();
  const page = await ready(t, server);
  upload(page, "history.csv", `${HEADER}2026-01-10,30000,Oil change,\n2026-03-02,32000,Tire rotation,\n`);
  await waitFor(() => page.$("imp-go"));
  const button = page.$("imp-go");
  button.click();
  button.click();
  await waitFor(() => /Row 3: saved/.test(page.$("imp-rows").textContent));
  await pause(100); // give a duplicate save time to show up if there were one
  assert.equal(server.records.length, 2);
});

test("review 2: a CSV with a byte-order mark is accepted", async (t) => {
  // Note: browsers often strip a BOM themselves, so this guards the behaviour rather than proving the strip.
  const server = createServiceServer();
  const page = await ready(t, server);
  upload(page, "excel.csv", `\uFEFF${HEADER}2026-01-10,30000,Oil change,\n`);
  await waitFor(() => page.$("imp-go"));
  assert.equal(page.$("imp-error").textContent, "");
  assert.match(page.$("imp-go").textContent, /1 valid row/);
});

test("review 4: row numbers stay correct after a blank line", async (t) => {
  const server = createServiceServer();
  const page = await ready(t, server);
  upload(page, "history.csv", `${HEADER}2026-01-10,30000,Oil change,\n\n2026-03-02,,Tire rotation,\n`);
  await waitFor(() => /Row 4: Mileage is required/.test(page.$("imp-rows").textContent));
  assert.match(page.$("imp-rows").textContent, /Row 2: ready to import/);
});

test("review 4: row numbers stay correct after a quoted note that spans two lines", async (t) => {
  const server = createServiceServer();
  const page = await ready(t, server);
  upload(page, "history.csv", `${HEADER}2026-01-10,30000,Oil change,"line one\nline two"\n2026-03-02,,Tire rotation,\n`);
  await waitFor(() => /Row 4: Mileage is required/.test(page.$("imp-rows").textContent));
  assert.match(page.$("imp-rows").textContent, /Row 2: ready to import/);
});

test("review 5: a slow first file cannot overwrite a second file chosen later", async (t) => {
  const server = createServiceServer();
  const realFetch = server.fetch;
  let slowNext = false;
  server.fetch = async (href, options) => { // delay only the next /service-types request
    if (href === "/service-types" && slowNext) { slowNext = false; await pause(150); }
    return realFetch(href, options);
  };
  const page = await ready(t, server);
  await waitFor(() => page.$("sr-type").options.length > 1); // the entry form has finished loading its types
  slowNext = true;
  upload(page, "first.csv", `${HEADER}2026-01-10,,Oil change,\n`);              // bad row, held up
  upload(page, "second.csv", `${HEADER}2026-02-02,31000,Tire rotation,\n`);     // good row, arrives first
  await waitFor(() => page.$("imp-go"));
  await pause(300); // let the slow first request finish
  assert.ok(page.$("imp-go"), "the second file's result should still be showing");
  assert.match(page.$("imp-rows").textContent, /Row 2: ready to import/);
  assert.doesNotMatch(page.$("imp-rows").textContent, /Mileage is required/);
});
