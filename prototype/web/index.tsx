import { createRoot } from "react-dom/client";
import React from "react";

function App() {
	return (
		<div>
			<h1 className="text-3xl font-bold underline">Hello World</h1>
		</div>
	);
}

createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
