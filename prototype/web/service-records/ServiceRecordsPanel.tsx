import { useEffect, useState } from 'react';
import { listSavedVehicles, type SavedVehicle } from './api';
import ServiceRecordForm from './ServiceRecordForm';

const labelFor = (v: SavedVehicle) =>
  `${v.year} ${v.make} ${v.model} ${v.trim}${v.nickname ? ` (${v.nickname})` : ''}`;

export default function ServiceRecordsPanel() {
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function loadVehicles() {
    try {
      const list = await listSavedVehicles();
      setVehicles(list);
      setVehicleId((cur) => (list.some((v) => v.id === cur) ? cur : (list[0]?.id ?? null)));
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => { loadVehicles(); }, []);

  return (
    <section id="service-records" className="mt-8 space-y-4">
      <h2>Service records</h2>
      {error && <p id="sr-vehicle-error" role="alert">{error}</p>}
      {/* vehicle_select.ts owns the saved list outside React, so refresh by hand after saving a vehicle */}
      <button id="sr-reload" type="button" onClick={loadVehicles}>Refresh vehicles</button>

      {vehicleId === null ? (
        <p id="sr-no-vehicle">Save a vehicle above to add service records.</p>
      ) : (
        <>
          <label htmlFor="sr-vehicle">Vehicle</label>
          <select id="sr-vehicle" value={vehicleId} onChange={(e) => setVehicleId(Number(e.target.value))}>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{labelFor(v)}</option>)}
          </select>
          <ServiceRecordForm key={vehicleId} vehicleId={vehicleId} />
        </>
      )}
    </section>
  );
}