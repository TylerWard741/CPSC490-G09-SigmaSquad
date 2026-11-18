export interface RecordDraft {
  service_type_id: string; // from the <select>: a string until submit
  service_date: string;    // YYYY-MM-DD
  mileage: string;         // from the <input>: a string until submit
  notes: string;
}

export type RecordErrors = Partial<Record<keyof RecordDraft, string>>;

function isRealDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s; // rejects 2026-13-40 and 2026-02-30
}

function todayLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Mirrors the validation table in docs/specs/vehicle-service-api.md
export function validateRecord(r: RecordDraft): RecordErrors {
  const errors: RecordErrors = {};

  const typeId = Number(r.service_type_id);
  if (!Number.isInteger(typeId) || typeId <= 0) errors.service_type_id = 'Service type is required';

  if (!r.service_date) errors.service_date = 'Date is required';
  else if (!isRealDate(r.service_date)) errors.service_date = 'Date must be a real date in YYYY-MM-DD format';
  else if (r.service_date > todayLocal()) errors.service_date = 'Date cannot be in the future';

  const m = r.mileage.trim();
  if (m === '') errors.mileage = 'Mileage is required';
  else if (!/^\d+$/.test(m)) errors.mileage = 'Mileage must be a whole number, 0 or more';

  if (r.notes.length > 1000) errors.notes = 'Notes must be 1000 characters or fewer';

  return errors;
}

export const isValid = (errors: RecordErrors) => Object.keys(errors).length === 0;