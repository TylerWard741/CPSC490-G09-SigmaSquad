export interface CsvRow { line: number; cells: string[] }

// Minimal CSV parser: handles quoted fields, "" escapes, and commas or line breaks inside quotes.
// Each row carries the line of the file where it starts, so error messages can name the real line.
export function parseCsv(input: string): CsvRow[] {
  const text = input.replace(/^\uFEFF/, ''); // Excel can write a UTF-8 byte-order mark first
  const rows: CsvRow[] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  let line = 1;    // line the parser is currently on (1-based)
  let rowLine = 1; // line where the current row started

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else quoted = false; }
      else {
        if (c === '\n' || (c === '\r' && text[i + 1] !== '\n')) line++; // a line break inside quotes
        cell += c;
      }
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push({ line: rowLine, cells: row }); row = []; cell = '';
      line++; rowLine = line;
    } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push({ line: rowLine, cells: row }); }
  return rows.filter((r) => r.cells.some((c) => c.trim() !== '')); // blank lines are skipped but still counted
}
