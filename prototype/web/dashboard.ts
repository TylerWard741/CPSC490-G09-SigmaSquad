type Vehicle = {
	id: number;
	make: string;
	model: string;
	year: number;
	trim: string;
	nickname?: string | null;
};

type VehicleDetail = Vehicle & {
	current_mileage: number | null;
};

type ServiceRecord = {
	id: number;
	vehicle_id: number;
	service_type_id: number;
	service_type: string;
	service_date: string;
	mileage: number;
	notes: string | null;
	// null until a current mileage exists to label against (#73, FR-10/FR-13).
	label: string | null;
	window_start: number | null;
	window_end: number | null;
};

// Dashboard page for story #77 (Objective 1.4, epic #27). Plain DOM code like
// vehicle_select.ts, over the read endpoints in docs/specs/vehicle-service-api.md.
// Scoped to `root` so a remount from the React page never touches stale nodes.
export function initDashboard(root: HTMLElement) {
	// Auth is out of scope: this is the demo user seeded by db/init_db.py.
	const USER_ID = 1;

	const element = <T extends HTMLElement>(id: string) =>
		root.querySelector<T>(`#${id}`)!;

	// Failed actions by key, so one success doesn't hide another failure.
	const failures = new Map<string, { message: string; retry: () => void }>();
	// Bumped per selection so a slow response for an old vehicle is ignored.
	let recordsToken = 0;
	let selectedVehicleId: number | null = null;

	async function api(path: string, init?: RequestInit) {
		let response;
		try {
			response = await fetch(path, init);
		} catch {
			throw new Error("The server can't be reached. Please try again.");
		}
		const body = await response.json().catch(() => ({}));
		if (!response.ok) {
			throw new Error(
				body.error || `The request failed (${response.status}).`,
			);
		}
		return body;
	}

	function renderFailures() {
		const messages = [
			...new Set([...failures.values()].map((failure) => failure.message)),
		];
		element("dash-error-text").textContent = messages.join(" ");
		element("dash-error").hidden = messages.length === 0;
	}

	function setFailure(key: string, message: string, retry: () => void) {
		failures.set(key, { message, retry });
		renderFailures();
	}

	function clearFailure(key: string) {
		failures.delete(key);
		renderFailures();
	}

	function vehicleLabel(vehicle: Vehicle) {
		const name = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;
		return vehicle.nickname ? `${vehicle.nickname} (${name})` : name;
	}

	function markSelected(vehicleId: number | null) {
		for (const button of root.querySelectorAll<HTMLButtonElement>("[data-vehicle-id]")) {
			button.setAttribute(
				"aria-pressed",
				String(button.dataset.vehicleId === String(vehicleId)),
			);
		}
	}

	function renderRecords(records: ServiceRecord[]) {
		// ISO dates (YYYY-MM-DD) sort correctly as strings; newest first.
		const sorted = [...records].sort((a, b) =>
			b.service_date.localeCompare(a.service_date),
		);
		element("dash-records").replaceChildren(
			...sorted.map((record) => {
				const row = document.createElement("tr");
				const cells = [
					record.service_date,
					record.service_type,
					String(record.mileage),
					record.notes ?? "",
				];
				for (const text of cells) {
					const cell = document.createElement("td");
					cell.className = "border-b py-2 pr-4";
					cell.textContent = text;
					row.append(cell);
				}
				return row;
			}),
		);
		const message = element<HTMLElement>("dash-history-message");
		element<HTMLElement>("dash-records-table").hidden = sorted.length === 0;
		message.hidden = sorted.length > 0;
		if (sorted.length === 0) {
			message.textContent = "No service records yet.";
		}
	}

	function renderMileage(mileage: number | null) {
		element<HTMLInputElement>("dash-mileage-input").value =
			mileage === null ? "" : String(mileage);
		element("dash-mileage-current").textContent =
			mileage === null ? "Not entered yet." : `${mileage} miles.`;
	}

	async function loadVehicleData(vehicleId: number, token: number) {
		const [{ service_records }, { vehicle }] = (await Promise.all([
			api(`/vehicles/${vehicleId}/service-records`),
			api(`/vehicles/${vehicleId}`),
		])) as [{ service_records: ServiceRecord[] }, { vehicle: VehicleDetail }];
		if (token !== recordsToken) return;
		renderRecords(service_records);
		renderMileage(vehicle.current_mileage);
	}

	async function selectVehicle(vehicleId: number, label: string) {
		recordsToken += 1;
		const token = recordsToken;
		selectedVehicleId = vehicleId;
		markSelected(vehicleId);
		clearFailure("records");
		clearFailure("mileage");
		element("dash-history-title").textContent = `Service history: ${label}`;
		element<HTMLElement>("dash-records-table").hidden = true;
		element<HTMLElement>("dash-history-message").hidden = false;
		element("dash-history-message").textContent = "Loading service records...";
		element<HTMLElement>("dash-mileage-section").hidden = true;
		try {
			await loadVehicleData(vehicleId, token);
			if (token !== recordsToken) return;
			element<HTMLElement>("dash-mileage-section").hidden = false;
			clearFailure("records");
		} catch (error) {
			if (token !== recordsToken) return;
			element<HTMLElement>("dash-history-message").hidden = true;
			setFailure("records", (error as Error).message, () =>
				selectVehicle(vehicleId, label),
			);
		}
	}

	async function loadVehicles() {
		try {
			const { vehicles } = (await api(`/users/${USER_ID}/vehicles`)) as {
				vehicles: Vehicle[];
			};
			element("dash-vehicles").replaceChildren(
				...vehicles.map((vehicle) => {
					const label = vehicleLabel(vehicle);
					const item = document.createElement("li");
					const button = document.createElement("button");
					button.type = "button";
					button.className = "vehicle-button";
					button.dataset.vehicleId = String(vehicle.id);
					button.textContent = label;
					button.addEventListener("click", () =>
						selectVehicle(vehicle.id, label),
					);
					item.append(button);
					return item;
				}),
			);
			element<HTMLElement>("dash-vehicles-empty").hidden = vehicles.length > 0;
			clearFailure("vehicles");
		} catch (error) {
			setFailure("vehicles", (error as Error).message, loadVehicles);
		}
	}

	element<HTMLButtonElement>("dash-retry").addEventListener("click", () => {
		for (const failure of [...failures.values()]) {
			failure.retry();
		}
	});

	// #73: entering a mileage replaces the stored value (FR-14, enforced by
	// the API) and this reload re-labels every record against it (FR-10).
	async function saveMileage() {
		const vehicleId = selectedVehicleId;
		if (vehicleId === null) return;
		const input = element<HTMLInputElement>("dash-mileage-input");
		const value = Number(input.value);
		if (!Number.isInteger(value) || value < 0) {
			setFailure("mileage", "Enter the mileage as a whole number, 0 or more.", saveMileage);
			return;
		}
		clearFailure("mileage");
		const token = recordsToken;
		try {
			await api(`/vehicles/${vehicleId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ current_mileage: value }),
			});
			if (token !== recordsToken) return;
			await loadVehicleData(vehicleId, token);
		} catch (error) {
			if (token !== recordsToken) return;
			setFailure("mileage", (error as Error).message, saveMileage);
		}
	}

	element<HTMLButtonElement>("dash-mileage-save").addEventListener("click", saveMileage);

	loadVehicles();
}
