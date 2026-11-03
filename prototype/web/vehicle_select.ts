type Vehicle = {
	id: number;
	make: string;
	model: string;
	year: number;
	trim: string;
	nickname?: string;
};

// Vehicle selection page for story #29. Plain JS over the JSON API in app.py;
// everything it needs from the server goes through those routes, so a React
// page can replace this file without any backend change.
export function initVehicleSelect() {
	// Auth is out of scope: this is the demo user seeded by db/init_db.py.
	const USER_ID = 1;
	const FILTER_DELAY_MS = 150;
	const LEVELS = ["make", "model", "year", "trim"] as const;

	const element = <T extends HTMLElement>(id: string) =>
		document.getElementById(id) as T | null;
	const selects = Object.fromEntries(
		LEVELS.map((level) => [level, element(level)]),
	);
	const filters = {
		make: element<HTMLInputElement>("make-filter")!,
		model: element<HTMLInputElement>("model-filter")!,
	} as const;

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
		constructor(
			message: string,
			public status: number,
		) {
			super(message);
		}
	}

	async function api(path: string, options: RequestInit = {}) {
		let response;
		try {
			response = await fetch(path, options);
		} catch {
			throw new ApiError(
				"The server can't be reached. Please try again.",
				0,
			);
		}
		const body = await response.json().catch(() => ({}));
		if (!response.ok) {
			throw new ApiError(
				body.error || `The request failed (${response.status}).`,
				response.status,
			);
		}
		return body;
	}

	function renderFailures() {
		const messages = [
			...new Set(
				[...failures.values()].map((failure) => failure.message),
			),
		];
		element("error-text")!.textContent = messages.join(" ");
		element("error")!.hidden = messages.length === 0;
	}

	function setFailure(key: string, message: string, retry: () => void) {
		failures.set(key, { message, retry });
		renderFailures();
	}

	function clearFailure(key: string) {
		failures.delete(key);
		renderFailures();
	}

	function showStatus(kind: string, text: string) {
		const status = element("status")!;
		status.className = `message ${kind}`;
		status.textContent = text;
		status.hidden = false;
	}

	function clearStatus() {
		element("status")!.hidden = true;
	}

	function isComplete() {
		return LEVELS.every((level) => selects[level]!.value !== "");
	}

	function updateSaveButton() {
		element<HTMLButtonElement>("save")!.disabled = saving || !isComplete();
	}

	function fillSelect(
		level: (typeof LEVELS)[number],
		options: { value: string; label: string }[],
	) {
		const select = selects[level];
		const current = select.selectedOptions[0];
		const keep =
			select.value !== ""
				? { value: select.value, label: current.textContent }
				: null;

		// A filter that hides the chosen option must not change the selection.
		const all =
			keep && !options.some((option) => option.value === keep.value)
				? [keep, ...options]
				: options;

		select.replaceChildren();
		select.add(
			new Option(options.length ? PLACEHOLDERS[level] : "No matches", ""),
		);
		for (const option of all) {
			select.add(new Option(option.label, option.value));
		}
		select.value = keep ? keep.value : "";
		select.disabled = false;
	}

	function resetLevel(level: (typeof LEVELS)[number]) {
		requestTokens[level] += 1;
		clearFailure(level);
		const select = selects[level];
		select.replaceChildren(new Option(PLACEHOLDERS[level], ""));
		select.value = "";
		select.disabled = true;
	}

	function clearLaterLevels(level: (typeof LEVELS)[number]) {
		for (const later of LEVELS.slice(LEVELS.indexOf(level) + 1)) {
			resetLevel(later);
		}
		if (level === "make") {
			filters.model.value = "";
			filters.model.disabled = selects.make.value === "";
		}
	}

	function filterQuery(level: "make" | "model") {
		const text = filters[level].value.trim();
		return text ? `?q=${encodeURIComponent(text)}` : "";
	}

	// Where each level's options come from, given the selections before it.
	const SOURCES = {
		make: () => ({
			path: `/makes${filterQuery("make")}`,
			read: (body: { makes: { id: number; name: string }[] }) =>
				body.makes.map((row) => ({
					value: String(row.id),
					label: row.name,
				})),
		}),
		model: () => ({
			path: `/makes/${selects.make.value}/models${filterQuery("model")}`,
			read: (body: { models: { id: number; name: string }[] }) =>
				body.models.map((row) => ({
					value: String(row.id),
					label: row.name,
				})),
		}),
		year: () => ({
			path: `/models/${selects.model.value}/years`,
			read: (body: { years: number[] }) =>
				body.years.map((year) => ({
					value: String(year),
					label: String(year),
				})),
		}),
		trim: () => ({
			path: `/models/${selects.model.value}/years/${selects.year.value}/trims`,
			read: (body: { trims: { id: number; trim: string }[] }) =>
				body.trims.map((row) => ({
					value: String(row.id),
					label: row.trim,
				})),
		}),
	};

	async function loadLevel(level: (typeof LEVELS)[number]) {
		requestTokens[level] += 1;
		const token = requestTokens[level];
		const source = SOURCES[level]();
		try {
			const body = await api(source.path);
			if (token !== requestTokens[level]) return;
			fillSelect(level, source.read(body));
			clearFailure(level);
		} catch (error: any) {
			if (token !== requestTokens[level]) return;
			setFailure(level, error.message, () => loadLevel(level));
		}
		updateSaveButton();
	}

	function vehicleLabel(vehicle: Vehicle) {
		const name = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;
		return vehicle.nickname ? `${vehicle.nickname} (${name})` : name;
	}

	async function loadSaved() {
		try {
			const { vehicles } = (await api(`/users/${USER_ID}/vehicles`)) as {
				vehicles: Vehicle[];
			};
			element("saved")!.replaceChildren(
				...vehicles.map((vehicle) => {
					const item = document.createElement("li");
					item.textContent = vehicleLabel(vehicle);
					return item;
				}),
			);
			element("saved-empty")!.hidden = vehicles.length > 0;
			clearFailure("saved");
		} catch (error: any) {
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
			showStatus(
				"success",
				`Saved ${year} ${make} ${model} ${trim} to your account.`,
			);
			await loadSaved();
		} catch (error: any) {
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

	function onSelectionChange(level: (typeof LEVELS)[number]) {
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
		selects[level].addEventListener("change", () =>
			onSelectionChange(level),
		);
	}

	for (const level of Object.keys(filters) as ["make" | "model"]) {
		let timer: ReturnType<typeof setTimeout> | undefined;
		filters[level].addEventListener("input", () => {
			clearTimeout(timer);
			timer = setTimeout(() => loadLevel(level), FILTER_DELAY_MS);
		});
	}

	element<HTMLButtonElement>("retry")!.addEventListener("click", () => {
		for (const failure of [...failures.values()]) {
			failure.retry();
		}
	});

	element<HTMLButtonElement>("save")!.addEventListener("click", save);

	for (const level of LEVELS) {
		resetLevel(level);
	}
	loadLevel("make");
	loadSaved();
}
