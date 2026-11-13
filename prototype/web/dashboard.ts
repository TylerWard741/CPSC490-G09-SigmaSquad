type Vehicle = {
	id: number;
	make: string;
	model: string;
	year: number;
	trim: string;
	nickname?: string | null;
};

type ServiceRecord = {
	id: number;
	vehicle_id: number;
	service_type_id: number;
	service_type: string;
	service_date: string;
	mileage: number;
	notes: string | null;
};

type ServiceType = { id: number; name: string };

// Dashboard page for stories #77 and #79 (Objective 1.4, epic #27). Plain DOM
// code like vehicle_select.ts, over the endpoints in docs/specs/vehicle-service-api.md.
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
	let selected: { id: number; label: string } | null = null;
	let serviceTypes: ServiceType[] | null = null;

	async function api(path: string, options: RequestInit = {}) {
		let response;
		try {
			response = await fetch(path, options);
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

	function showStatus(text: string) {
		const status = element("dash-status");
		status.textContent = text;
		status.hidden = false;
	}

	function clearStatus() {
		element("dash-status").hidden = true;
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

	function cell(content: string | Node) {
		const td = document.createElement("td");
		td.className = "border-b py-2 pr-4";
		td.append(content);
		return td;
	}

	function actionButton(text: string, label: string, onClick: () => void) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "action-button";
		button.textContent = text;
		button.setAttribute("aria-label", label);
		button.addEventListener("click", onClick);
		return button;
	}

	function recordRow(record: ServiceRecord) {
		const row = document.createElement("tr");
		row.dataset.recordId = String(record.id);
		const actions = document.createElement("span");
		actions.className = "flex gap-2";
		actions.append(
			actionButton("Edit", `Edit ${record.service_type} on ${record.service_date}`, () =>
				editRecord(row, record),
			),
			actionButton("Delete", `Delete ${record.service_type} on ${record.service_date}`, () =>
				deleteRecord(record),
			),
		);
		row.append(
			cell(record.service_date),
			cell(record.service_type),
			cell(String(record.mileage)),
			cell(record.notes ?? ""),
			cell(actions),
		);
		return row;
	}

	function renderRecords(records: ServiceRecord[]) {
		// ISO dates (YYYY-MM-DD) sort correctly as strings; newest first.
		const sorted = [...records].sort((a, b) =>
			b.service_date.localeCompare(a.service_date),
		);
		element("dash-records").replaceChildren(...sorted.map(recordRow));
		const message = element("dash-history-message");
		element("dash-records-table").hidden = sorted.length === 0;
		message.hidden = sorted.length > 0;
		if (sorted.length === 0) {
			message.textContent = "No service records yet.";
		}
	}

	function resetHistory() {
		selected = null;
		recordsToken += 1;
		clearFailure("records");
		element("dash-history-title").textContent = "Service history";
		element("dash-records").replaceChildren();
		element("dash-records-table").hidden = true;
		element("dash-history-message").hidden = false;
		element("dash-history-message").textContent =
			"Select a vehicle to see its service history.";
	}

	async function loadRecords() {
		if (!selected) return;
		const { id, label } = selected;
		recordsToken += 1;
		const token = recordsToken;
		markSelected(id);
		clearFailure("records");
		element("dash-history-title").textContent = `Service history: ${label}`;
		try {
			const { service_records } = (await api(
				`/vehicles/${id}/service-records`,
			)) as { service_records: ServiceRecord[] };
			if (token !== recordsToken) return;
			renderRecords(service_records);
		} catch (error) {
			if (token !== recordsToken) return;
			element("dash-history-message").hidden = true;
			setFailure("records", (error as Error).message, loadRecords);
		}
	}

	function selectVehicle(vehicleId: number, label: string) {
		selected = { id: vehicleId, label };
		clearStatus();
		element("dash-records-table").hidden = true;
		element("dash-history-message").hidden = false;
		element("dash-history-message").textContent = "Loading service records...";
		loadRecords();
	}

	async function loadServiceTypes() {
		if (!serviceTypes) {
			const body = (await api("/service-types")) as {
				service_types: ServiceType[];
			};
			serviceTypes = body.service_types;
		}
		return serviceTypes;
	}

	function field(label: string, input: HTMLElement) {
		const wrapper = document.createElement("label");
		wrapper.className = "block";
		wrapper.append(label, input);
		return wrapper;
	}

	async function editRecord(row: HTMLTableRowElement, record: ServiceRecord) {
		clearStatus();
		let types: ServiceType[];
		try {
			types = await loadServiceTypes();
			clearFailure("service-types");
		} catch (error) {
			setFailure("service-types", (error as Error).message, () =>
				editRecord(row, record),
			);
			return;
		}

		const date = document.createElement("input");
		date.type = "date";
		date.name = "service_date";
		date.value = record.service_date;
		const type = document.createElement("select");
		type.name = "service_type_id";
		for (const serviceType of types) {
			type.add(new Option(serviceType.name, String(serviceType.id)));
		}
		type.value = String(record.service_type_id);
		const mileage = document.createElement("input");
		mileage.type = "number";
		mileage.name = "mileage";
		mileage.min = "0";
		mileage.value = String(record.mileage);
		const notes = document.createElement("input");
		notes.type = "text";
		notes.name = "notes";
		notes.maxLength = 1000;
		notes.value = record.notes ?? "";

		const save = async () => {
			const changes = {
				service_date: date.value,
				service_type_id: Number(type.value),
				mileage: Number(mileage.value),
				notes: notes.value.trim() === "" ? null : notes.value,
			};
			try {
				await api(`/service-records/${record.id}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(changes),
				});
				clearFailure("edit");
				showStatus("Service record updated.");
				await loadRecords();
			} catch (error) {
				setFailure("edit", (error as Error).message, save);
			}
		};

		const form = document.createElement("td");
		form.colSpan = 5;
		form.className = "border-b py-2";
		const buttons = document.createElement("span");
		buttons.className = "flex gap-2";
		buttons.append(
			actionButton("Save", "Save service record", save),
			actionButton("Cancel", "Cancel editing", () => {
				clearFailure("edit");
				row.replaceWith(recordRow(record));
			}),
		);
		form.append(
			field("Date", date),
			field("Service type", type),
			field("Mileage", mileage),
			field("Notes", notes),
			buttons,
		);
		row.replaceChildren(form);
	}

	async function deleteRecord(record: ServiceRecord) {
		clearStatus();
		if (!window.confirm(`Delete the ${record.service_type} record from ${record.service_date}?`)) {
			return;
		}
		try {
			await api(`/service-records/${record.id}`, { method: "DELETE" });
			clearFailure("delete-record");
			showStatus("Service record deleted.");
			await loadRecords();
		} catch (error) {
			setFailure("delete-record", (error as Error).message, () =>
				deleteRecord(record),
			);
		}
	}

	async function deleteVehicle(vehicleId: number, label: string) {
		clearStatus();
		if (!window.confirm(`Delete ${label} and all of its service records?`)) {
			return;
		}
		try {
			await api(`/vehicles/${vehicleId}`, { method: "DELETE" });
			clearFailure("delete-vehicle");
			if (selected?.id === vehicleId) resetHistory();
			showStatus(`Deleted ${label}.`);
			await loadVehicles();
		} catch (error) {
			setFailure("delete-vehicle", (error as Error).message, () =>
				deleteVehicle(vehicleId, label),
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
					item.className = "flex gap-2";
					const button = document.createElement("button");
					button.type = "button";
					button.className = "vehicle-button";
					button.dataset.vehicleId = String(vehicle.id);
					button.textContent = label;
					button.addEventListener("click", () =>
						selectVehicle(vehicle.id, label),
					);
					const remove = actionButton("Delete", `Delete ${label}`, () =>
						deleteVehicle(vehicle.id, label),
					);
					remove.dataset.deleteVehicleId = String(vehicle.id);
					item.append(button, remove);
					return item;
				}),
			);
			element("dash-vehicles-empty").hidden = vehicles.length > 0;
			markSelected(selected?.id ?? null);
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

	loadVehicles();
}
