CREATE TABLE makes (
id INTEGER PRIMARY KEY,
name TEXT NOT NULL UNIQUE
);

CREATE TABLE models (
id INTEGER PRIMARY KEY,
make_id INTEGER NOT NULL REFERENCES makes(id),
name TEXT NOT NULL,
UNIQUE (make_id, name)
);

CREATE TABLE vehicle_trims (
id INTEGER PRIMARY KEY,
model_id INTEGER NOT NULL REFERENCES models(id),
year INTEGER NOT NULL,
trim TEXT NOT NULL,
UNIQUE (model_id, year, trim)
);

CREATE TABLE users (
id INTEGER PRIMARY KEY,
email TEXT NOT NULL UNIQUE
);

CREATE TABLE user_vehicles (
id INTEGER PRIMARY KEY,
user_id INTEGER NOT NULL REFERENCES users(id),
trim_id INTEGER NOT NULL REFERENCES vehicle_trims(id),
nickname TEXT,
saved_at TEXT DEFAULT CURRENT_TIMESTAMP,
UNIQUE (user_id, trim_id)
);

-- Recommended service windows (#75). A single recommended mileage is stored as
-- a window whose start and end are equal (FR-11). repeat_every_miles is how far
-- the window moves after each service; NULL means it does not repeat.
CREATE TABLE service_intervals (
id INTEGER PRIMARY KEY,
trim_id INTEGER NOT NULL REFERENCES vehicle_trims(id),
service_type TEXT NOT NULL CHECK (service_type IN ('Oil change', 'Tire rotation', 'Brake inspection')),
window_start_miles INTEGER NOT NULL CHECK (window_start_miles >= 0),
window_end_miles INTEGER NOT NULL,
repeat_every_miles INTEGER CHECK (repeat_every_miles > 0),
source_url TEXT NOT NULL,
source_page TEXT NOT NULL,
source_quote TEXT NOT NULL,
CHECK (window_end_miles >= window_start_miles),
UNIQUE (trim_id, service_type)
);
