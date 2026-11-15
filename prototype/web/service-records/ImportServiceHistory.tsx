import { useState, type ChangeEvent } from 'react';
import { parseCsv } from './csv';
import { validateRecord, isValid } from './validation'; // reused from #85, not duplicated
import { getServiceTypes, createServiceRecord, type NewServiceRecord } from './api';

interface Props { vehicleId: number; onImported?: () => void }
interface Line { line: number; ok: boolean; text: string }
interface Ready { line: number; body: NewServiceRecord }

const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsText(file);
  });

export default function ImportServiceHistory({ vehicleId, onImported }: Props) {
  const [error, setError] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [ready, setReady] = useState<Ready[]>([]);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    setError(''); setLines([]); setReady([]);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) { setError('Please upload a .csv file.'); return; }

    let types;
    try { types = await getServiceTypes(); } catch (err) { setError((err as Error).message); return; }
    const byName = new Map(types.map((t) => [t.name.toLowerCase(), t.id]));

    const [header, ...data] = parseCsv(await readFile(file));
    const cols = (header ?? []).map((h) => h.trim().toLowerCase());
    const missing = ['service_date', 'mileage', 'service_type'].filter((c) => !cols.includes(c));
    if (missing.length) { setError(`Missing column(s): ${missing.join(', ')}`); return; }

    const nextLines: Line[] = [];
    const nextReady: Ready[] = [];
    data.forEach((cells, i) => {
      const line = i + 2; // line 1 is the header
      const get = (c: string) => (cells[cols.indexOf(c)] ?? '').trim();
      const typeName = get('service_type');
      const typeId = byName.get(typeName.toLowerCase()); // only ids that GET /service-types returned can get through
      const draft = { service_type_id: typeId === undefined ? '' : String(typeId),
                      service_date: get('service_date'), mileage: get('mileage'), notes: get('notes') };
      const errors = validateRecord(draft);
      if (typeId === undefined) errors.service_type_id = `Unknown service type "${typeName}"`;

      if (isValid(errors)) {
        const body: NewServiceRecord = { service_type_id: typeId!, service_date: draft.service_date, mileage: Number(draft.mileage) };
        if (draft.notes) body.notes = draft.notes;
        nextReady.push({ line, body });
        nextLines.push({ line, ok: true, text: `Row ${line}: ready to import` });
      } else {
        nextLines.push({ line, ok: false, text: `Row ${line}: ${Object.values(errors).join('; ')}. This row will not be saved.` });
      }
    });
    setLines(nextLines); setReady(nextReady);
  }

  async function confirmImport() { // the "user confirms the import" step (FR-23)
    const results: Line[] = [];
    for (const { line, body } of ready) {
      try { await createServiceRecord(vehicleId, body); results.push({ line, ok: true, text: `Row ${line}: saved` }); }
      catch (err) { results.push({ line, ok: false, text: `Row ${line}: ${(err as Error).message}` }); }
    }
    setLines(results); setReady([]);
    onImported?.();
  }

  return (
    <section id="import" aria-label="Import service history" className="max-w-md space-y-3">
      <label htmlFor="imp-file">Upload service history (.csv)</label>
      <input id="imp-file" type="file" accept=".csv" onChange={handleFile} className="block" />
      <p id="imp-error" role="alert" className="text-red-600">{error}</p>
      <ul id="imp-rows">
        {lines.map((l) => <li key={l.line} className={l.ok ? 'text-green-700' : 'text-red-600'}>{l.text}</li>)}
      </ul>
      {ready.length > 0 && (
        <button id="imp-go" type="button" onClick={confirmImport} className="rounded bg-blue-600 px-4 py-2 text-white">
          Import {ready.length} valid row(s)
        </button>
      )}
    </section>
  );
}