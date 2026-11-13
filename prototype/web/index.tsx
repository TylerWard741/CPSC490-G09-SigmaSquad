import { createRoot } from "react-dom/client";
import React, { useEffect } from "react";
import { initVehicleSelect } from "./vehicle_select";
import ServiceRecordsPanel from "./service-records/ServiceRecordsPanel";

function App() {
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

createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
