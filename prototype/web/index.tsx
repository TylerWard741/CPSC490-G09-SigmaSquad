import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from "react";
import { initVehicleSelect } from "./vehicle_select";
import { DashboardPage } from "./dashboard";
import ServiceRecordsPanel from "./service-records/ServiceRecordsPanel";

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
			<ServiceRecordsPanel />
		</>
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
