/**
 * Minimal, safe CSV serialization for analytics exports.
 *
 * Quotes every field and escapes embedded quotes. Also neutralizes CSV/formula
 * injection: a field beginning with = + - @ (which spreadsheets may execute) is
 * prefixed with a single quote so it's treated as text.
 */

function escapeField(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function toCsv(headers: string[], rows: Array<Array<unknown>>): string {
  const lines = [headers.map(escapeField).join(",")];
  for (const row of rows) {
    lines.push(row.map(escapeField).join(","));
  }
  // CRLF line endings are the most spreadsheet-compatible.
  return lines.join("\r\n");
}
