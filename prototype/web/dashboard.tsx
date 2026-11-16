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

type Selected = { id: number; label: string };
type Failure = { message: string; retry: () => void };
// What the history pane shows.
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

// Story #77 (Objective 1.4, epic #27): saved vehicles on the left, the selected
// vehicle's service history on the right at desktop width. Uses the read
// endpoints in docs/specs/vehicle-service-api.md.
export function DashboardPage() {
	const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
	const [selected, setSelected] = useState<Selected | null>(null);
	const [history, setHistory] = useState<History>({ kind: "idle" });
	// Failed actions by key, so one success doesn't hide another failure.
	const [failures, setFailures] = useState<Record<string, Failure>>({});
	// Bumped per selection so a slow response for an old vehicle is ignored.
	const recordsToken = useRef(0);

	const setFailure = (key: string, message: string, retry: () => void) =>
		setFailures((current) => ({ ...current, [key]: { message, retry } }));
	const clearFailure = (key: string) =>
		setFailures((current) => {
			if (!(key in current)) return current;
			const { [key]: _removed, ...rest } = current;
			return rest;
		});

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
			setHistory({ kind: "loaded", records });
		} catch (error) {
			if (token !== recordsToken.current) return;
			setHistory({ kind: "error" });
			setFailure("records", (error as Error).message, () => loadRecords(vehicle));
		}
	}

	function selectVehicle(vehicle: Selected) {
		setSelected(vehicle);
		setHistory({ kind: "loading" });
		loadRecords(vehicle);
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
			<div className="mt-6 grid gap-8 md:grid-cols-[18rem_1fr]">
				<section>
					<h2 className="text-lg font-semibold">Your vehicles</h2>
					<ul id="dash-vehicles" className="mt-3 space-y-2">
						{(vehicles ?? []).map((vehicle) => {
							const label = vehicleLabel(vehicle);
							return (
								<li key={vehicle.id}>
									<button
										type="button"
										className="vehicle-button"
										data-vehicle-id={vehicle.id}
										aria-pressed={selected?.id === vehicle.id}
										onClick={() => selectVehicle({ id: vehicle.id, label })}
									>
										{label}
									</button>
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
							</tr>
						</thead>
						<tbody id="dash-records" className="block md:table-row-group">
							{records.map((record) => (
								<tr
									key={record.id}
									data-record-id={record.id}
									className="mb-3 block rounded border p-3 md:mb-0 md:table-row md:rounded-none md:border-0 md:p-0"
								>
									<td
										className="block py-1 before:mr-2 before:font-semibold before:content-[attr(data-label)] md:table-cell md:border-b md:py-2 md:pr-4 md:before:content-none"
										data-label="Date:"
									>
										{record.service_date}
									</td>
									<td
										className="block py-1 before:mr-2 before:font-semibold before:content-[attr(data-label)] md:table-cell md:border-b md:py-2 md:pr-4 md:before:content-none"
										data-label="Service:"
									>
										{record.service_type}
									</td>
									<td
										className="block py-1 before:mr-2 before:font-semibold before:content-[attr(data-label)] md:table-cell md:border-b md:py-2 md:pr-4 md:before:content-none"
										data-label="Mileage:"
									>
										{record.mileage}
									</td>
									<td
										className="block py-1 before:mr-2 before:font-semibold before:content-[attr(data-label)] md:table-cell md:border-b md:py-2 md:pr-4 md:before:content-none"
										data-label="Notes:"
									>
										{record.notes ?? ""}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			</div>
		</div>
	);
}
