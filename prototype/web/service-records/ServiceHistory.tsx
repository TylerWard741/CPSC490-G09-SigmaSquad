import { useEffect, useState } from 'react';
import { listServiceRecords, type ServiceRecord } from './api';

interface Props { vehicleId: number; refreshKey?: number }

export default function ServiceHistory({ vehicleId, refreshKey = 0 }: Props) {
  const [records, setRecords] = useState<ServiceRecord[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setRecords(null); setError('');
    listServiceRecords(vehicleId).then(setRecords).catch((e: Error) => setError(e.message));
  }, [vehicleId, refreshKey]); // reload when the vehicle changes or after a save

  if (error) return <p id="history-error" role="alert">{error}</p>;
  if (!records) return <p id="history-loading">Loading…</p>;
  if (records.length === 0) return <p id="history-empty">No service records saved for this vehicle yet.</p>; // empty state, not an error

  return (
    <table id="history-table" className="w-full text-left">
      <thead><tr><th>Date</th><th>Mileage</th><th>Service</th><th>Notes</th></tr></thead>
      <tbody>
        {records.map((r) => ( // the API returns newest first, per docs/specs/vehicle-service-api.md
          <tr key={r.id}>
            <td>{r.service_date}</td>
            <td>{r.mileage}</td>
            <td>{r.service_type}</td>
            <td>{r.notes ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
