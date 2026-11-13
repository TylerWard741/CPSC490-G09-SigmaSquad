import { createRoot } from "react-dom/client";
import React, { useEffect, useRef, useState } from "react";
import { initVehicleSelect } from "./vehicle_select";
import { initDashboard } from "./dashboard";

// Tracks the URL hash so "#dashboard" switches pages without a reload.
function useHash() {
	const [hash, setHash] = useState(window.location.hash);
	useEffect(() => {
		const update = () => setHash(window.location.hash);
		window.addEventListener("hashchange", update);
		return () => window.removeEventListener("hashchange", update);
	}, []);
	return hash;
}

function SelectionPage() {
	useEffect(() => {
		initVehicleSelect();
	}, []);
	return (
		<>
			<h1>Select your vehicle</h1>
			<p>Signed in as the demo user.</p>
			<div id="error" className="message error" role="alert" hidden>
				<div id="error-text"></div>
				<button id="retry" type="button">
					Retry
				</button>
			</div>
			<label htmlFor="make-filter">Filter makes</label>
			<input id="make-filter" type="search" autoComplete="off" />
			<label htmlFor="make">Make</label>
			<select id="make" disabled></select>
			<label htmlFor="model-filter">Filter models</label>
			<input
				id="model-filter"
				type="search"
				autoComplete="off"
				disabled
			/>
			<label htmlFor="model">Model</label>
			<select id="model" disabled></select>
			<label htmlFor="year">Year</label>
			<select id="year" disabled></select>
			<label htmlFor="trim">Trim</label>
			<select id="trim" disabled></select>
			<button id="save" type="button" disabled>
				Save vehicle
			</button>
			<div id="status" className="message" role="status" hidden></div>
			<h2>Your saved vehicles</h2>
			<ul id="saved"></ul>
			<p id="saved-empty" hidden>
				No saved vehicles yet.
			</p>
		</>
	);
}

// Story #77: saved vehicles on the left, the selected vehicle's service
// history on the right at desktop width.
function DashboardPage() {
	const root = useRef<HTMLDivElement>(null);
	useEffect(() => {
		initDashboard(root.current as HTMLElement);
	}, []);
	return (
		<div ref={root}>
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<div id="dash-error" className="message error" role="alert" hidden>
				<div id="dash-error-text"></div>
				<button id="dash-retry" type="button">
					Retry
				</button>
			</div>
			<div className="mt-6 grid gap-8 md:grid-cols-[18rem_1fr]">
				<section>
					<h2 className="text-lg font-semibold">Your vehicles</h2>
					<ul id="dash-vehicles" className="mt-3 space-y-2"></ul>
					<p id="dash-vehicles-empty" hidden>
						No saved vehicles yet.
					</p>
				</section>
				<section>
					<h2 id="dash-history-title" className="text-lg font-semibold">
						Service history
					</h2>
					<p id="dash-history-message" className="mt-3">
						Select a vehicle to see its service history.
					</p>
					<table
						id="dash-records-table"
						className="mt-3 w-full border-collapse text-left"
						hidden
					>
						<thead>
							<tr>
								<th className="border-b py-2 pr-4">Date</th>
								<th className="border-b py-2 pr-4">Service</th>
								<th className="border-b py-2 pr-4">Mileage</th>
								<th className="border-b py-2 pr-4">Notes</th>
							</tr>
						</thead>
						<tbody id="dash-records"></tbody>
					</table>
				</section>
			</div>
		</div>
	);
}

function App() {
	const hash = useHash();
	const onDashboard = hash === "#dashboard";
	return (
		<div className={onDashboard ? undefined : "mx-auto max-w-lg"}>
			<nav className="mb-6 flex gap-4">
				<a
					href="#dashboard"
					aria-current={onDashboard ? "page" : undefined}
				>
					Dashboard
				</a>
				<a href="#" aria-current={onDashboard ? undefined : "page"}>
					Add a vehicle
				</a>
			</nav>
			{onDashboard ? <DashboardPage /> : <SelectionPage />}
		</div>
	);
}

createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
