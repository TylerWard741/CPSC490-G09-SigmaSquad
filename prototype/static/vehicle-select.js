// Vehicle selection page for story #29. Plain JS over the JSON API in app.py;
// everything it needs from the server goes through those routes, so a React
// page can replace this file without any backend change.
(function () {
  // Auth is out of scope: this is the demo user seeded by db/init_db.py.
  const USER_ID = 1;
  const FILTER_DELAY_MS = 150;
  const LEVELS = ["make", "model", "year", "trim"];

  const element = (id) => document.getElementById(id);
  const selects = Object.fromEntries(LEVELS.map((level) => [level, element(level)]));
  const filters = { make: element("make-filter"), model: element("model-filter") };

  const PLACEHOLDERS = {
    make: "Select a make",
    model: "Select a model",
    year: "Select a year",
    trim: "Select a trim",
  };

  // Bumped per level so a slow response for an old selection is ignored.
  const requestTokens = { make: 0, model: 0, year: 0, trim: 0 };
  // Failed actions by key, so one success doesn't hide another failure.
  const failures = new Map();
  let saving = false;

  class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }

  async function api(path, options) {
    let response;
    try {
      response = await fetch(path, options);
    } catch {
      throw new ApiError("The server can't be reached. Please try again.", 0);
    }
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(body.error || `The request failed (${response.status}).`, response.status);
    }
    return body;
  }

  function renderFailures() {
    const messages = [...new Set([...failures.values()].map((failure) => failure.message))];
    element("error-text").textContent = messages.join(" ");
    element("error").hidden = messages.length === 0;
  }

  function setFailure(key, message, retry) {
    failures.set(key, { message, retry });
    renderFailures();
  }

  function clearFailure(key) {
    failures.delete(key);
    renderFailures();
  }

  function showStatus(kind, text) {
    const status = element("status");
    status.className = `message ${kind}`;
    status.textContent = text;
    status.hidden = false;
  }

  function clearStatus() {
    element("status").hidden = true;
  }

  function isComplete() {
    return LEVELS.every((level) => selects[level].value !== "");
  }

  function updateSaveButton() {
    element("save").disabled = saving || !isComplete();
  }

  function fillSelect(level, options) {
    const select = selects[level];
    const current = select.selectedOptions[0];
    const keep = select.value !== "" ? { value: select.value, label: current.textContent } : null;

    // A filter that hides the chosen option must not change the selection.
    const all = keep && !options.some((option) => option.value === keep.value)
      ? [keep, ...options]
      : options;

    select.replaceChildren();
    select.add(new Option(options.length ? PLACEHOLDERS[level] : "No matches", ""));
    for (const option of all) {
      select.add(new Option(option.label, option.value));
    }
    select.value = keep ? keep.value : "";
    select.disabled = false;
  }

  function resetLevel(level) {
    requestTokens[level] += 1;
    clearFailure(level);
    const select = selects[level];
    select.replaceChildren(new Option(PLACEHOLDERS[level], ""));
    select.value = "";
    select.disabled = true;
  }

  function clearLaterLevels(level) {
    for (const later of LEVELS.slice(LEVELS.indexOf(level) + 1)) {
      resetLevel(later);
    }
    if (level === "make") {
      filters.model.value = "";
      filters.model.disabled = selects.make.value === "";
    }
  }

  function filterQuery(level) {
    const text = filters[level].value.trim();
    return text ? `?q=${encodeURIComponent(text)}` : "";
  }

  // Where each level's options come from, given the selections before it.
  const SOURCES = {
    make: () => ({
      path: `/makes${filterQuery("make")}`,
      read: (body) => body.makes.map((row) => ({ value: String(row.id), label: row.name })),
    }),
    model: () => ({
      path: `/makes/${selects.make.value}/models${filterQuery("model")}`,
      read: (body) => body.models.map((row) => ({ value: String(row.id), label: row.name })),
    }),
    year: () => ({
      path: `/models/${selects.model.value}/years`,
      read: (body) => body.years.map((year) => ({ value: String(year), label: String(year) })),
    }),
    trim: () => ({
      path: `/models/${selects.model.value}/years/${selects.year.value}/trims`,
      read: (body) => body.trims.map((row) => ({ value: String(row.id), label: row.trim })),
    }),
  };

  async function loadLevel(level) {
    requestTokens[level] += 1;
    const token = requestTokens[level];
    const source = SOURCES[level]();
    try {
      const body = await api(source.path);
      if (token !== requestTokens[level]) return;
      fillSelect(level, source.read(body));
      clearFailure(level);
    } catch (error) {
      if (token !== requestTokens[level]) return;
      setFailure(level, error.message, () => loadLevel(level));
    }
    updateSaveButton();
  }

  function vehicleLabel(vehicle) {
    const name = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;
    return vehicle.nickname ? `${vehicle.nickname} (${name})` : name;
  }

  async function loadSaved() {
    try {
      const { vehicles } = await api(`/users/${USER_ID}/vehicles`);
      element("saved").replaceChildren(...vehicles.map((vehicle) => {
        const item = document.createElement("li");
        item.textContent = vehicleLabel(vehicle);
        return item;
      }));
      element("saved-empty").hidden = vehicles.length > 0;
      clearFailure("saved");
    } catch (error) {
      setFailure("saved", error.message, loadSaved);
    }
  }

  async function save() {
    saving = true;
    updateSaveButton();
    clearStatus();
    const [make, model, year, trim] = LEVELS.map(
      (level) => selects[level].selectedOptions[0].textContent,
    );
    try {
      await api(`/users/${USER_ID}/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trim_id: Number(selects.trim.value) }),
      });
      clearFailure("save");
      showStatus("success", `Saved ${year} ${make} ${model} ${trim} to your account.`);
      await loadSaved();
    } catch (error) {
      if (error.status === 409) {
        clearFailure("save");
        showStatus("info", error.message);
      } else {
        setFailure("save", error.message, save);
      }
    }
    saving = false;
    updateSaveButton();
  }

  function onSelectionChange(level) {
    clearStatus();
    clearFailure("save");
    clearLaterLevels(level);
    updateSaveButton();
    const next = LEVELS[LEVELS.indexOf(level) + 1];
    if (next && selects[level].value !== "") {
      loadLevel(next);
    }
  }

  for (const level of LEVELS) {
    selects[level].addEventListener("change", () => onSelectionChange(level));
  }

  for (const level of Object.keys(filters)) {
    let timer;
    filters[level].addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => loadLevel(level), FILTER_DELAY_MS);
    });
  }

  element("retry").addEventListener("click", () => {
    for (const failure of [...failures.values()]) {
      failure.retry();
    }
  });

  element("save").addEventListener("click", save);

  for (const level of LEVELS) {
    resetLevel(level);
  }
  loadLevel("make");
  loadSaved();
})();
