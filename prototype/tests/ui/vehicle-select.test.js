// UI tests for story #29, named by acceptance criterion. These run the real
// static/index.html and static/vehicle-select.js in jsdom; only fetch is
// replaced, by a fake server holding the same data as db/init_db.py.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const STATIC_DIR = path.join(__dirname, "..", "..", "static");
const HTML = fs.readFileSync(path.join(STATIC_DIR, "index.html"), "utf8");
const SCRIPT = fs.readFileSync(path.join(STATIC_DIR, "vehicle-select.js"), "utf8");

const MAKES = [{ id: 2, name: "Honda" }, { id: 1, name: "Toyota" }];
const MODELS = {
  1: [{ id: 1, name: "Camry" }, { id: 2, name: "Corolla" }],
  2: [{ id: 3, name: "Civic" }],
};
const YEARS = { 1: [2020], 2: [2021], 3: [2022, 2019] };
const TRIMS = {
  "1/2020": [{ id: 1, trim: "LE" }, { id: 2, trim: "SE" }],
  "2/2021": [{ id: 3, trim: "L" }],
  "3/2019": [{ id: 4, trim: "EX" }],
  "3/2022": [{ id: 5, trim: "Sport" }],
};
const VEHICLES = {
  1: { make: "Toyota", model: "Camry", year: 2020, trim: "LE" },
  2: { make: "Toyota", model: "Camry", year: 2020, trim: "SE" },
  3: { make: "Toyota", model: "Corolla", year: 2021, trim: "L" },
  4: { make: "Honda", model: "Civic", year: 2019, trim: "EX" },
  5: { make: "Honda", model: "Civic", year: 2022, trim: "Sport" },
};

function json(status, body) {
  return { ok: status < 400, status, json: async () => body };
}

function matching(rows, url) {
  const q = (url.searchParams.get("q") || "").toLowerCase();
  return rows.filter((row) => row.name.toLowerCase().includes(q));
}

function createServer(saved = []) {
  const server = { saved: [...saved], calls: [], down: false, delays: new Map() };
  server.fetch = async (href, options = {}) => {
    const method = options.method || "GET";
    server.calls.push({ href, method, body: options.body });
    const delay = server.delays.get(href);
    if (delay) await delay;
    if (server.down === "network") throw new TypeError("Failed to fetch");
    if (server.down) {
      return json(503, { error: "The vehicle database can't be reached. Please try again." });
    }

    const url = new URL(href, "http://test");
    const route = url.pathname;
    let match;
    if (route === "/makes") return json(200, { makes: matching(MAKES, url) });
    if ((match = route.match(/^\/makes\/(\d+)\/models$/))) {
      return json(200, { models: matching(MODELS[match[1]], url) });
    }
    if ((match = route.match(/^\/models\/(\d+)\/years$/))) {
      return json(200, { years: YEARS[match[1]] });
    }
    if ((match = route.match(/^\/models\/(\d+)\/years\/(\d+)\/trims$/))) {
      return json(200, { trims: TRIMS[`${match[1]}/${match[2]}`] });
    }
    if (route === "/users/1/vehicles" && method === "GET") {
      const vehicles = server.saved.map((id) => ({ id, trim_id: id, nickname: null, ...VEHICLES[id] }));
      return json(200, { vehicles });
    }
    if (route === "/users/1/vehicles") {
      const trimId = JSON.parse(options.body).trim_id;
      if (server.saved.includes(trimId)) {
        return json(409, { error: "This vehicle is already saved on your account." });
      }
      server.saved.push(trimId);
      return json(201, { vehicle: { id: trimId, trim_id: trimId, nickname: null, ...VEHICLES[trimId] } });
    }
    return json(404, { error: "not found" });
  };
  return server;
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 5));

async function openPage(t, server = createServer()) {
  const dom = new JSDOM(HTML, { runScripts: "outside-only", url: "http://test/" });
  t.after(() => dom.window.close());
  dom.window.fetch = server.fetch;
  dom.window.eval(SCRIPT);
  await settle();
  const doc = dom.window.document;

  const page = {
    server,
    doc,
    select: (id) => doc.getElementById(id),
    labels: (id) => [...doc.getElementById(id).options].filter((o) => o.value !== "").map((o) => o.text),
    selected: (id) => {
      const select = doc.getElementById(id);
      return select.value === "" ? "" : select.selectedOptions[0].text;
    },
    async choose(id, label) {
      const select = doc.getElementById(id);
      const option = [...select.options].find((o) => o.text === label);
      assert.ok(option, `${label} should be offered in #${id}`);
      select.value = option.value;
      select.dispatchEvent(new dom.window.Event("change"));
      await settle();
    },
    async typeFilter(id, text) {
      const input = doc.getElementById(id);
      input.value = text;
      input.dispatchEvent(new dom.window.Event("input"));
      await new Promise((resolve) => setTimeout(resolve, 170));
      await settle();
    },
    async click(id) {
      doc.getElementById(id).click();
      await settle();
    },
    saveDisabled: () => doc.getElementById("save").disabled,
    error: () => (doc.getElementById("error").hidden ? "" : doc.getElementById("error-text").textContent),
    status: () => (doc.getElementById("status").hidden ? "" : doc.getElementById("status").textContent),
    savedList: () => [...doc.querySelectorAll("#saved li")].map((li) => li.textContent),
  };
  page.chooseAll = async (make, model, year, trim) => {
    await page.choose("make", make);
    await page.choose("model", model);
    await page.choose("year", year);
    await page.choose("trim", trim);
  };
  return page;
}

test("AC1: opening the screen lists the makes from the API", async (t) => {
  const page = await openPage(t);
  assert.deepEqual(page.labels("make"), ["Honda", "Toyota"]);
  assert.equal(page.select("make").disabled, false);
});

test("AC2: selecting a make shows only its models", async (t) => {
  const page = await openPage(t);
  assert.equal(page.select("model").disabled, true);
  await page.choose("make", "Toyota");
  assert.deepEqual(page.labels("model"), ["Camry", "Corolla"]);
  await page.choose("make", "Honda");
  assert.deepEqual(page.labels("model"), ["Civic"]);
});

test("AC3: selecting a model shows only its years", async (t) => {
  const page = await openPage(t);
  await page.choose("make", "Honda");
  assert.equal(page.select("year").disabled, true);
  await page.choose("model", "Civic");
  assert.deepEqual(page.labels("year"), ["2022", "2019"]);
});

test("AC4: selecting a year shows only the matching trims", async (t) => {
  const page = await openPage(t);
  await page.choose("make", "Honda");
  await page.choose("model", "Civic");
  assert.equal(page.select("trim").disabled, true);
  await page.choose("year", "2019");
  assert.deepEqual(page.labels("trim"), ["EX"]);
  await page.choose("year", "2022");
  assert.deepEqual(page.labels("trim"), ["Sport"]);
});

test("AC5: changing the make clears model, year and trim", async (t) => {
  const page = await openPage(t);
  await page.chooseAll("Toyota", "Camry", "2020", "SE");
  await page.choose("make", "Honda");
  assert.equal(page.selected("model"), "");
  assert.equal(page.selected("year"), "");
  assert.equal(page.selected("trim"), "");
  assert.equal(page.select("year").disabled, true);
  assert.equal(page.select("trim").disabled, true);
  assert.deepEqual(page.labels("year"), []);
  assert.deepEqual(page.labels("trim"), []);
});

test("AC5: changing the model clears year and trim but keeps the make", async (t) => {
  const page = await openPage(t);
  await page.chooseAll("Toyota", "Camry", "2020", "SE");
  await page.choose("model", "Corolla");
  assert.equal(page.selected("make"), "Toyota");
  assert.equal(page.selected("year"), "");
  assert.equal(page.selected("trim"), "");
  assert.deepEqual(page.labels("year"), ["2021"]);
});

test("AC5: changing the year clears only the trim", async (t) => {
  const page = await openPage(t);
  await page.chooseAll("Honda", "Civic", "2019", "EX");
  await page.choose("year", "2022");
  assert.equal(page.selected("model"), "Civic");
  assert.equal(page.selected("year"), "2022");
  assert.equal(page.selected("trim"), "");
});

test("AC5: a slow response for an old selection is ignored", async (t) => {
  const page = await openPage(t);
  let release;
  page.server.delays.set("/makes/1/models", new Promise((resolve) => { release = resolve; }));
  await page.choose("make", "Toyota");
  await page.choose("make", "Honda");
  release();
  await settle();
  assert.deepEqual(page.labels("model"), ["Civic"]);
});

test("AC6: Save stays disabled until all four are selected", async (t) => {
  const page = await openPage(t);
  assert.equal(page.saveDisabled(), true);
  await page.choose("make", "Toyota");
  assert.equal(page.saveDisabled(), true);
  await page.choose("model", "Camry");
  assert.equal(page.saveDisabled(), true);
  await page.choose("year", "2020");
  assert.equal(page.saveDisabled(), true);
  await page.choose("trim", "LE");
  assert.equal(page.saveDisabled(), false);
});

test("AC6: Save is disabled again when an earlier selection changes", async (t) => {
  const page = await openPage(t);
  await page.chooseAll("Toyota", "Camry", "2020", "LE");
  await page.choose("make", "Honda");
  assert.equal(page.saveDisabled(), true);
});

test("AC7: saving posts the trim ID and shows a confirmation", async (t) => {
  const page = await openPage(t);
  await page.chooseAll("Toyota", "Camry", "2020", "SE");
  await page.click("save");
  const post = page.server.calls.find((call) => call.method === "POST");
  assert.equal(post.href, "/users/1/vehicles");
  assert.deepEqual(JSON.parse(post.body), { trim_id: 2 });
  assert.match(page.status(), /Saved 2020 Toyota Camry SE/);
  assert.deepEqual(page.savedList(), ["2020 Toyota Camry SE"]);
});

test("AC8: the saved vehicle is shown when the user returns", async (t) => {
  const page = await openPage(t, createServer([5]));
  assert.deepEqual(page.savedList(), ["2022 Honda Civic Sport"]);
  assert.equal(page.doc.getElementById("saved-empty").hidden, true);
});

test("AC8: a user with no saved vehicles is told so", async (t) => {
  const page = await openPage(t);
  assert.deepEqual(page.savedList(), []);
  assert.equal(page.doc.getElementById("saved-empty").hidden, false);
});

test("AC9: a duplicate save says it's already saved and adds nothing", async (t) => {
  const page = await openPage(t, createServer([3]));
  await page.chooseAll("Toyota", "Corolla", "2021", "L");
  await page.click("save");
  assert.match(page.status(), /already saved/);
  assert.equal(page.error(), "");
  assert.deepEqual(page.savedList(), ["2021 Toyota Corolla L"]);
});

for (const [name, down] of [["the API returns 503", true], ["the network fails", "network"]]) {
  test(`AC10: when ${name}, loading shows an error and keeps selections`, async (t) => {
    const page = await openPage(t);
    await page.choose("make", "Toyota");
    await page.choose("model", "Camry");
    page.server.down = down;
    await page.choose("year", "2020");

    assert.notEqual(page.error(), "");
    assert.equal(page.selected("make"), "Toyota");
    assert.equal(page.selected("model"), "Camry");
    assert.equal(page.selected("year"), "2020");
    assert.equal(page.saveDisabled(), true);
  });

  test(`AC10: when ${name}, saving shows an error and keeps selections`, async (t) => {
    const page = await openPage(t);
    await page.chooseAll("Toyota", "Camry", "2020", "SE");
    page.server.down = down;
    await page.click("save");

    assert.notEqual(page.error(), "");
    assert.equal(page.status(), "");
    assert.deepEqual(
      ["make", "model", "year", "trim"].map(page.selected),
      ["Toyota", "Camry", "2020", "SE"],
    );
    assert.equal(page.saveDisabled(), false);
  });
}

test("AC10: Retry recovers without losing selections", async (t) => {
  const page = await openPage(t);
  await page.choose("make", "Toyota");
  await page.choose("model", "Camry");
  page.server.down = true;
  await page.choose("year", "2020");
  page.server.down = false;
  await page.click("retry");

  assert.equal(page.error(), "");
  assert.equal(page.selected("year"), "2020");
  assert.deepEqual(page.labels("trim"), ["LE", "SE"]);
});

test("AC10: a failed first load shows an error", async (t) => {
  const server = createServer();
  server.down = true;
  const page = await openPage(t, server);
  assert.match(page.error(), /can't be reached/);
});

test("AC11: the make filter narrows the list within one second", async (t) => {
  const page = await openPage(t);
  const start = performance.now();
  await page.typeFilter("make-filter", "toy");
  assert.ok(performance.now() - start < 1000);
  assert.deepEqual(page.labels("make"), ["Toyota"]);
  await page.typeFilter("make-filter", "");
  assert.deepEqual(page.labels("make"), ["Honda", "Toyota"]);
});

test("AC11: the model filter narrows the list within one second", async (t) => {
  const page = await openPage(t);
  assert.equal(page.select("model-filter").disabled, true);
  await page.choose("make", "Toyota");
  const start = performance.now();
  await page.typeFilter("model-filter", "cor");
  assert.ok(performance.now() - start < 1000);
  assert.deepEqual(page.labels("model"), ["Corolla"]);
});

test("a filter that hides the chosen option does not change the selection", async (t) => {
  const page = await openPage(t);
  await page.chooseAll("Toyota", "Camry", "2020", "SE");
  await page.typeFilter("make-filter", "hon");
  assert.equal(page.selected("make"), "Toyota");
  assert.equal(page.selected("trim"), "SE");
  assert.deepEqual(page.labels("make"), ["Toyota", "Honda"]);
});

test("changing the make clears the model filter", async (t) => {
  const page = await openPage(t);
  await page.choose("make", "Toyota");
  await page.typeFilter("model-filter", "cor");
  await page.choose("make", "Honda");
  assert.equal(page.doc.getElementById("model-filter").value, "");
  assert.deepEqual(page.labels("model"), ["Civic"]);
});

test("a filter with no results says so", async (t) => {
  const page = await openPage(t);
  await page.typeFilter("make-filter", "zzz");
  assert.deepEqual(page.labels("make"), []);
  assert.equal(page.select("make").options[0].text, "No matches");
});

test("server text is rendered as text, not HTML", async (t) => {
  const server = createServer();
  const original = server.fetch;
  server.fetch = async (href, options) =>
    href === "/users/1/vehicles" && !options
      ? json(200, {
          vehicles: [{ id: 1, trim_id: 1, year: 2020, make: "<img src=x>", model: "M", trim: "T", nickname: null }],
        })
      : original(href, options);
  const page = await openPage(t, server);
  assert.equal(page.doc.querySelector("#saved img"), null);
  assert.match(page.savedList()[0], /<img src=x>/);
});
