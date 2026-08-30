export type Family = { name: string; hex: string };

export const FAMILIES: Family[] = [
  { name: 'Red', hex: '#C0392B' },
  { name: 'Orange', hex: '#D97B34' },
  { name: 'Yellow', hex: '#E7C34A' },
  { name: 'Lime', hex: '#8CB33A' },
  { name: 'Green', hex: '#3E8F4F' },
  { name: 'Mint', hex: '#3BAE86' },
  { name: 'Cyan', hex: '#2FA8B5' },
  { name: 'Azure', hex: '#3577C4' },
  { name: 'Blue', hex: '#2E4AAC' },
  { name: 'Violet', hex: '#6B4AB5' },
  { name: 'Magenta', hex: '#A8407E' },
  { name: 'Pink', hex: '#D4527F' },
  { name: 'Black', hex: '#1C1B1A' },
  { name: 'Gray', hex: '#8A8785' },
  { name: 'White', hex: '#EFECE6' },
];

export const FAM_HEX: Record<string, string> = Object.fromEntries(
  FAMILIES.map((f) => [f.name, f.hex]),
);

export function hexToRgb(hex: string): [number, number, number] | null {
  let h = String(hex || '').trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, mx ? (d / mx) * 100 : 0, mx * 100];
}

export function hsvToHex(h: number, s: number, v: number): string {
  s /= 100; v /= 100;
  const c = v * s, hh = (h % 360) / 60, x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hh < 1) { r = c; g = x; } else if (hh < 2) { r = x; g = c; }
  else if (hh < 3) { g = c; b = x; } else if (hh < 4) { g = x; b = c; }
  else if (hh < 5) { r = x; b = c; } else { r = c; b = x; }
  const m = v - c;
  const to = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return ('#' + to(r) + to(g) + to(b)).toUpperCase();
}

// HSB categorization: neutrals first (brightness/saturation), then a 30°-wide
// hue slice per family. Every RGB value lands in exactly one of the 15 families.
export function familyOf(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'Gray';
  const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);

  if (v < 15) return 'Black';
  if (s < 10 && v > 85) return 'White';
  if (s < 15) return 'Gray';

  if (h < 15 || h >= 345) return 'Red';
  if (h < 45) return 'Orange';
  if (h < 75) return 'Yellow';
  if (h < 105) return 'Lime';
  if (h < 135) return 'Green';
  if (h < 165) return 'Mint';
  if (h < 195) return 'Cyan';
  if (h < 225) return 'Azure';
  if (h < 255) return 'Blue';
  if (h < 285) return 'Violet';
  if (h < 315) return 'Magenta';
  return 'Pink';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function dateLabel(d: string): string {
  const p = String(d).split('-');
  if (p.length !== 3) return d;
  return Number(p[2]) + ' ' + MONTHS[Number(p[1]) - 1] + ' ' + p[0];
}

export function monthYear(d: string): string {
  const p = String(d).split('-');
  if (p.length < 2) return d;
  return MONTHS[Number(p[1]) - 1] + ' ' + p[0];
}

export function initials(name: string): string {
  return String(name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export type LogEntry = { hex: string; note: string; date: string; fav?: boolean };

export type Stats = {
  counts: Record<string, number>;
  touched: number;
  leans: string;
  pct: number;
};

export function computeStats(log: LogEntry[]): Stats {
  const counts: Record<string, number> = {};
  FAMILIES.forEach((f) => { counts[f.name] = 0; });
  log.forEach((c) => { counts[familyOf(c.hex)] += 1; });
  const touched = FAMILIES.filter((f) => counts[f.name] > 0).length;
  let leans = FAMILIES[0].name;
  FAMILIES.forEach((f) => { if (counts[f.name] > counts[leans]) leans = f.name; });
  return { counts, touched, leans, pct: Math.round((touched / FAMILIES.length) * 100) };
}
