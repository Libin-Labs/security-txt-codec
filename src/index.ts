export type SecurityFields = Readonly<Record<string, readonly string[]>>;
export function parseSecurityTxt(text: string): SecurityFields {
  if (typeof text !== 'string' || text.length > 65536)
    throw new TypeError('Expected bounded security.txt');
  const out: Record<string, string[]> = {};
  for (const line of text.split(/\r?\n/)) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    const i = s.indexOf(':');
    if (i < 1) throw new TypeError('Malformed security.txt field');
    const key = s.slice(0, i).trim(),
      value = s.slice(i + 1).trim();
    if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(key) || !value || /[\r\n]/.test(value))
      throw new TypeError('Invalid field');
    (out[key] ??= []).push(value);
  }
  const contacts = Object.entries(out)
      .filter(([k]) => k.toLowerCase() === 'contact')
      .flatMap(([, v]) => v),
    expires = Object.entries(out)
      .filter(([k]) => k.toLowerCase() === 'expires')
      .flatMap(([, v]) => v);
  if (
    !contacts.length ||
    expires.length !== 1 ||
    !/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/.test(expires[0]!) ||
    !Number.isFinite(Date.parse(expires[0]!))
  )
    throw new TypeError('Contact and one UTC Expires value are required');
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Object.freeze([...v])]));
}
export function formatSecurityTxt(fields: SecurityFields): string {
  const lines = Object.keys(fields)
    .sort()
    .flatMap((k) => fields[k]!.map((v) => k + ': ' + v));
  const text = lines.join('\n');
  parseSecurityTxt(text);
  return text;
}
