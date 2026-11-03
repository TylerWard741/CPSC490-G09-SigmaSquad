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
