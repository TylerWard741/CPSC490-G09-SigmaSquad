import { useRef, useState, type ChangeEvent } from 'react';
import { parseCsv } from './csv';
import { validateRecord, isValid } from './validation'; // reused from #85, not duplicated
import { getServiceTypes, createServiceRecord, type NewServiceRecord, type ServiceType } from './api';

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
  const busy = useRef(false);       // blocks a second click while an import is running
  const latestFile = useRef(0);     // only the most recently chosen file may update the screen

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // so choosing the same file again fires onChange again
    const thisFile = ++latestFile.current;
    setError(''); setLines([]); setReady([]);
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) { setError('Please upload a .csv file.'); return; }

    let types: ServiceType[];
    let text: string;
    try {
      types = await getServiceTypes();
      text = await readFile(file);
    } catch (err) {
      if (thisFile === latestFile.current) setError((err as Error).message || 'Could not read the file.');
      return;
    }
    if (thisFile !== latestFile.current) return; // a newer file was chosen while we were waiting

    const byName = new Map(types.map((t) => [t.name.toLowerCase(), t.id]));
    const [header, ...data] = parseCsv(text);
    const cols = (header?.cells ?? []).map((h) => h.trim().toLowerCase());
    const missing = ['service_date', 'mileage', 'service_type'].filter((c) => !cols.includes(c));
    if (missing.length) { setError(`Missing column(s): ${missing.join(', ')}`); return; }

    const nextLines: Line[] = [];
    const nextReady: Ready[] = [];
    data.forEach(({ line, cells }) => { // line is the row's real line number in the file
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
    if (busy.current) return;      // a second click while saving does nothing
    busy.current = true;
    const toSave = ready;
    setReady([]);                  // the Import button disappears right away
    const results = new Map<number, Line>();
    try {
      for (const { line, body } of toSave) {
        try { await createServiceRecord(vehicleId, body); results.set(line, { line, ok: true, text: `Row ${line}: saved` }); }
        catch (err) { results.set(line, { line, ok: false, text: `Row ${line}: ${(err as Error).message}` }); }
      }
    } finally {
      busy.current = false;
    }
    // Replace only the rows we tried to save; rows that failed validation stay listed.
    setLines((prev) => prev.map((l) => results.get(l.line) ?? l));
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
