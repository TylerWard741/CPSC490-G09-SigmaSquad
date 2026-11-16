import { useEffect, useState, type FormEvent } from 'react';
import { validateRecord, isValid } from './validation';
import { getServiceTypes, createServiceRecord, type ServiceType } from './api';

interface Props { vehicleId: number; onSaved?: () => void }

export default function ServiceRecordForm({ vehicleId, onSaved }: Props) {
  const [types, setTypes] = useState<ServiceType[]>([]);
  const [date, setDate] = useState('');
  const [mileage, setMileage] = useState('');
  const [typeId, setTypeId] = useState('');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    getServiceTypes().then(setTypes).catch((e: Error) => setStatus(e.message));
  }, []);

  const errors = validateRecord({ service_type_id: typeId, service_date: date, mileage, notes });
  const canSave = isValid(errors); // DoD: Save is enabled only when the required fields are valid

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    const body: { service_type_id: number; service_date: string; mileage: number; notes?: string } = {
      service_type_id: Number(typeId),
      service_date: date,
      mileage: Number(mileage),
    };
    if (notes.trim()) body.notes = notes.trim(); // omit empty notes instead of sending ""
    try {
      await createServiceRecord(vehicleId, body);
      setStatus('Service record saved.');
      setDate(''); setMileage(''); setTypeId(''); setNotes(''); setTouched(false);
      onSaved?.();
    } catch (err) {
      setStatus((err as Error).message); // inputs stay so the user can retry
    }
  }

  const field = 'block w-full rounded border border-gray-300 px-3 py-2';

  return (
    <form id="sr-form" onSubmit={handleSubmit} noValidate aria-label="Add service record" className="max-w-md space-y-3">
      <label htmlFor="sr-date">Date</label>
      <input id="sr-date" type="date" className={field} value={date}
        onChange={(e) => { setDate(e.target.value); setTouched(true); }} />

      <label htmlFor="sr-mileage">Mileage</label>
      <input id="sr-mileage" type="number" min="0" step="1" className={field} value={mileage}
        onChange={(e) => { setMileage(e.target.value); setTouched(true); }} />

      <label htmlFor="sr-type">Service type</label>
      <select id="sr-type" className={field} value={typeId}
        onChange={(e) => { setTypeId(e.target.value); setTouched(true); }}>
        <option value="">Select a service type</option>
        {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>

      <label htmlFor="sr-notes">Notes (optional)</label>
      <textarea id="sr-notes" className={field} maxLength={1000} value={notes}
        onChange={(e) => { setNotes(e.target.value); setTouched(true); }} />

      <ul id="sr-errors" className="text-red-600">
        {touched && Object.values(errors).map((m) => <li key={m}>{m}</li>)}
      </ul>

      <button id="sr-save" type="submit" disabled={!canSave}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-40">
        Save record
      </button>
      <p id="sr-status" role="status">{status}</p>
    </form>
  );
}