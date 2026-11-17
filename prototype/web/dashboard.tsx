import React, { useEffect, useRef, useState } from "react";

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

type Selected = { id: number; label: string };
type Failure = { message: string; retry: () => void };
type RecordChanges = {
	service_date: string;
	service_type_id: number;
	mileage: number;
	notes: string | null;
};
// What the history pane shows. A failed refresh of already loaded rows leaves
// them on screen instead of replacing them with "error".
type History =
	| { kind: "idle" }
	| { kind: "loading" }
	| { kind: "error" }
	| { kind: "loaded"; records: ServiceRecord[] };

// Auth is out of scope: this is the demo user seeded by db/init_db.py.
const USER_ID = 1;

async function api(path: string, options: RequestInit = {}) {
	let response;
	try {
		response = await fetch(path, options);
	} catch {
		throw new Error("The server can't be reached. Please try again.");
	}
	const body = await response.json().catch(() => ({}));
	if (!response.ok) {
		throw new Error(body.error || `The request failed (${response.status}).`);
	}
	return body;
}

function vehicleLabel(vehicle: Vehicle) {
	const name = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;
	return vehicle.nickname ? `${vehicle.nickname} (${name})` : name;
}

function ActionButton(props: {
	label: string;
	text: string;
	onClick: () => void;
	[attr: `data-${string}`]: string;
}) {
	const { label, text, onClick, ...rest } = props;
	return (
		<button type="button" className="action-button" aria-label={label} onClick={onClick} {...rest}>
			{text}
		</button>
	);
}

// Uncontrolled on purpose: the values are read from the inputs when saving.
function EditForm(props: {
	record: ServiceRecord;
	types: ServiceType[];
	onSave: (read: () => RecordChanges) => void;
	onCancel: () => void;
}) {
	const { record, types, onSave, onCancel } = props;
	const date = useRef<HTMLInputElement>(null);
	const type = useRef<HTMLSelectElement>(null);
	const mileage = useRef<HTMLInputElement>(null);
	const notes = useRef<HTMLInputElement>(null);
	const read = (): RecordChanges => ({
		service_date: date.current!.value,
		service_type_id: Number(type.current!.value),
		mileage: Number(mileage.current!.value),
		notes: notes.current!.value.trim() === "" ? null : notes.current!.value,
	});
	return (
		<td colSpan={5} className="block border-b py-2 md:table-cell">
			<label className="block">
				Date
				<input ref={date} type="date" name="service_date" defaultValue={record.service_date} />
			</label>
			<label className="block">
				Service type
				<select ref={type} name="service_type_id" defaultValue={String(record.service_type_id)}>
					{types.map((serviceType) => (
						<option key={serviceType.id} value={serviceType.id}>
							{serviceType.name}
						</option>
					))}
				</select>
			</label>
			<label className="block">
				Mileage
				<input ref={mileage} type="number" name="mileage" min="0" defaultValue={record.mileage} />
			</label>
			<label className="block">
				Notes
				<input ref={notes} type="text" name="notes" maxLength={1000} defaultValue={record.notes ?? ""} />
			</label>
			<span className="flex gap-2">
				<ActionButton text="Save" label="Save service record" onClick={() => onSave(read)} />
				<ActionButton text="Cancel" label="Cancel editing" onClick={onCancel} />
			</span>
		</td>
	);
}

// Stories #77 and #79 (Objective 1.4, epic #27): saved vehicles on the left, the
// selected vehicle's service history on the right at desktop width. Uses the
// endpoints in docs/specs/vehicle-service-api.md.
export function DashboardPage() {
	const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
	const [selected, setSelected] = useState<Selected | null>(null);
	const [history, setHistory] = useState<History>({ kind: "idle" });
	const [editing, setEditing] = useState<ReadonlySet<number>>(new Set());
	const [editTypes, setEditTypes] = useState<ServiceType[]>([]);
	const [status, setStatus] = useState("");
	// Failed actions by key, so one success doesn't hide another failure.
	const [failures, setFailures] = useState<Record<string, Failure>>({});
	// Bumped per selection so a slow response for an old vehicle is ignored.
	const recordsToken = useRef(0);
	// The handlers below outlive a render, so they read this instead of state.
	const selectedRef = useRef<Selected | null>(null);
	const serviceTypes = useRef<ServiceType[] | null>(null);

	const setFailure = (key: string, message: string, retry: () => void) =>
		setFailures((current) => ({ ...current, [key]: { message, retry } }));
	const clearFailure = (key: string) =>
		setFailures((current) => {
			if (!(key in current)) return current;
			const { [key]: _removed, ...rest } = current;
			return rest;
		});

	const choose = (next: Selected | null) => {
		selectedRef.current = next;
		setSelected(next);
	};

	async function loadVehicles() {
		try {
			const body = (await api(`/users/${USER_ID}/vehicles`)) as { vehicles: Vehicle[] };
			setVehicles(body.vehicles);
			clearFailure("vehicles");
		} catch (error) {
			setFailure("vehicles", (error as Error).message, loadVehicles);
		}
	}

	async function loadRecords(vehicle: Selected) {
		recordsToken.current += 1;
		const token = recordsToken.current;
		clearFailure("records");
		try {
			const body = (await api(`/vehicles/${vehicle.id}/service-records`)) as {
				service_records: ServiceRecord[];
			};
			if (token !== recordsToken.current) return;
			// ISO dates (YYYY-MM-DD) sort correctly as strings; newest first.
			const records = [...body.service_records].sort((a, b) =>
				b.service_date.localeCompare(a.service_date),
			);
			setEditing(new Set());
			setHistory({ kind: "loaded", records });
		} catch (error) {
			if (token !== recordsToken.current) return;
			setHistory((current) => (current.kind === "loaded" ? current : { kind: "error" }));
			setFailure("records", (error as Error).message, () => loadRecords(vehicle));
		}
	}

	function selectVehicle(vehicle: Selected) {
		choose(vehicle);
		setStatus("");
		setHistory({ kind: "loading" });
		loadRecords(vehicle);
	}

	function resetHistory() {
		choose(null);
		recordsToken.current += 1;
		clearFailure("records");
		setHistory({ kind: "idle" });
	}

	async function startEdit(record: ServiceRecord) {
		setStatus("");
		try {
			if (!serviceTypes.current) {
				const body = (await api("/service-types")) as { service_types: ServiceType[] };
				serviceTypes.current = body.service_types;
			}
			clearFailure("service-types");
		} catch (error) {
			setFailure("service-types", (error as Error).message, () => startEdit(record));
			return;
		}
		setEditTypes(serviceTypes.current);
		setEditing((current) => new Set(current).add(record.id));
	}

	function cancelEdit(record: ServiceRecord) {
		clearFailure("edit");
		setEditing((current) => {
			const next = new Set(current);
			next.delete(record.id);
			return next;
		});
	}

	async function saveEdit(record: ServiceRecord, read: () => RecordChanges) {
		try {
			await api(`/service-records/${record.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(read()),
			});
			clearFailure("edit");
			setStatus("Service record updated.");
			if (selectedRef.current) await loadRecords(selectedRef.current);
		} catch (error) {
			setFailure("edit", (error as Error).message, () => saveEdit(record, read));
		}
	}

	async function deleteRecord(record: ServiceRecord) {
		setStatus("");
		if (!window.confirm(`Delete the ${record.service_type} record from ${record.service_date}?`)) {
			return;
		}
		try {
			await api(`/service-records/${record.id}`, { method: "DELETE" });
			clearFailure("delete-record");
			setStatus("Service record deleted.");
			if (selectedRef.current) await loadRecords(selectedRef.current);
		} catch (error) {
			setFailure("delete-record", (error as Error).message, () => deleteRecord(record));
		}
	}

	async function deleteVehicle(vehicleId: number, label: string) {
		setStatus("");
		if (!window.confirm(`Delete ${label} and all of its service records?`)) {
			return;
		}
		try {
			await api(`/vehicles/${vehicleId}`, { method: "DELETE" });
			clearFailure("delete-vehicle");
			if (selectedRef.current?.id === vehicleId) resetHistory();
			setStatus(`Deleted ${label}.`);
			await loadVehicles();
		} catch (error) {
			setFailure("delete-vehicle", (error as Error).message, () =>
				deleteVehicle(vehicleId, label),
			);
		}
	}

	useEffect(() => {
		loadVehicles();
	}, []);

	const failureList = Object.values(failures);
	const errorText = [...new Set(failureList.map((failure) => failure.message))].join(" ");
	const records = history.kind === "loaded" ? history.records : [];
	const historyMessage =
		history.kind === "idle"
			? "Select a vehicle to see its service history."
			: history.kind === "loading"
				? "Loading service records..."
				: history.kind === "loaded" && records.length === 0
					? "No service records yet."
					: "";

	return (
		<div>
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<div id="dash-error" className="message error" role="alert" hidden={failureList.length === 0}>
				<div id="dash-error-text">{errorText}</div>
				<button
					id="dash-retry"
					type="button"
					onClick={() => failureList.forEach((failure) => failure.retry())}
				>
					Retry
				</button>
			</div>
			<div id="dash-status" className="message success" role="status" hidden={status === ""}>
				{status}
			</div>
			<div className="mt-6 grid gap-8 md:grid-cols-[22rem_1fr]">
				<section>
					<h2 className="text-lg font-semibold">Your vehicles</h2>
					<ul id="dash-vehicles" className="mt-3 space-y-2">
						{(vehicles ?? []).map((vehicle) => {
							const label = vehicleLabel(vehicle);
							return (
								<li key={vehicle.id} className="flex gap-2">
									<button
										type="button"
										className="vehicle-button"
										data-vehicle-id={vehicle.id}
										aria-pressed={selected?.id === vehicle.id}
										onClick={() => selectVehicle({ id: vehicle.id, label })}
									>
										{label}
									</button>
									<ActionButton
										text="Delete"
										label={`Delete ${label}`}
										data-delete-vehicle-id={String(vehicle.id)}
										onClick={() => deleteVehicle(vehicle.id, label)}
									/>
								</li>
							);
						})}
					</ul>
					<p id="dash-vehicles-empty" hidden={vehicles === null || vehicles.length > 0}>
						No saved vehicles yet.
					</p>
				</section>
				<section>
					<h2 id="dash-history-title" className="text-lg font-semibold">
						{selected ? `Service history: ${selected.label}` : "Service history"}
					</h2>
					<p id="dash-history-message" className="mt-3" hidden={historyMessage === ""}>
						{historyMessage}
					</p>
					<table
						id="dash-records-table"
						className="mt-3 block w-full border-collapse text-left md:table"
						hidden={records.length === 0}
					>
						<thead className="hidden md:table-header-group">
							<tr>
								<th className="border-b py-2 pr-4">Date</th>
								<th className="border-b py-2 pr-4">Service</th>
								<th className="border-b py-2 pr-4">Mileage</th>
								<th className="border-b py-2 pr-4">Notes</th>
								<th className="border-b py-2 pr-4">Actions</th>
							</tr>
						</thead>
						<tbody id="dash-records" className="block md:table-row-group">
							{records.map((record) => (
								<tr
									key={record.id}
									data-record-id={record.id}
									className="mb-3 block rounded border p-3 md:mb-0 md:table-row md:rounded-none md:border-0 md:p-0"
								>
									{editing.has(record.id) ? (
										<EditForm
											record={record}
											types={editTypes}
											onSave={(read) => saveEdit(record, read)}
											onCancel={() => cancelEdit(record)}
										/>
									) : (
										<>
											<td className="block py-1 before:mr-2 before:font-semibold before:content-[attr(data-label)] md:table-cell md:border-b md:py-2 md:pr-4 md:before:content-none" data-label="Date:">{record.service_date}</td>
											<td className="block py-1 before:mr-2 before:font-semibold before:content-[attr(data-label)] md:table-cell md:border-b md:py-2 md:pr-4 md:before:content-none" data-label="Service:">{record.service_type}</td>
											<td className="block py-1 before:mr-2 before:font-semibold before:content-[attr(data-label)] md:table-cell md:border-b md:py-2 md:pr-4 md:before:content-none" data-label="Mileage:">{record.mileage}</td>
											<td className="block py-1 before:mr-2 before:font-semibold before:content-[attr(data-label)] md:table-cell md:border-b md:py-2 md:pr-4 md:before:content-none" data-label="Notes:">{record.notes ?? ""}</td>
											<td className="block py-1 before:mr-2 before:font-semibold before:content-[attr(data-label)] md:table-cell md:border-b md:py-2 md:pr-4 md:before:content-none" data-label="Actions:">
												<span className="flex gap-2">
													<ActionButton
														text="Edit"
														label={`Edit ${record.service_type} on ${record.service_date}`}
														onClick={() => startEdit(record)}
													/>
													<ActionButton
														text="Delete"
														label={`Delete ${record.service_type} on ${record.service_date}`}
														onClick={() => deleteRecord(record)}
													/>
												</span>
											</td>
										</>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</section>
			</div>
		</div>
	);
}
