import type { LogEntry } from './color';

export type ColorGroup = {
  hex: string;
  count: number;
  fav: boolean;
  entries: LogEntry[];
};

// One swatch per distinct color, newest-use first, carrying every usage entry
// for that color so history (and a usage count) survives per color.
export function groupByColor(log: LogEntry[]): ColorGroup[] {
  const order: string[] = [];
  const groups: Record<string, LogEntry[]> = {};
  for (const c of log) {
    const key = c.hex.toUpperCase();
    if (!groups[key]) {
      groups[key] = [];
      order.push(key);
    }
    groups[key].push(c);
  }
  return order.map((hex) => {
    const entries = groups[hex].slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    return { hex, count: entries.length, fav: entries.some((e) => e.fav), entries };
  });
}
