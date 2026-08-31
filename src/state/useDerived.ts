import { useMemo } from 'react';
import type { AppState } from '../types';
import { FAMILIES, familyOf, hsvToHex, computeStats, dateLabel, uniqueColorCount } from '../lib/color';
import { groupByColor } from '../lib/colorGroups';
import { starStyle } from '../ui/tokens';

const CURRENT_YEAR = String(new Date().getFullYear());

const EMPTY_NOTES: Record<string, string> = {
  Pink: 'You have never logged a pink. Worth a try on the next poster.',
  White: 'Whites go unlogged, though every layout sits on one.',
};

export function useDerived(state: AppState) {
  return useMemo(() => {
    const acc = state.account;
    if (!acc) return { acc: null } as const;

    const previewHex = state.exact || hsvToHex(state.h, state.s, state.v);
    const previewFamily = familyOf(previewHex);
    const existing = acc.log.find((c) => c.hex.toUpperCase() === previewHex.toUpperCase()) || null;

    const filtered = acc.log.filter((c) => state.range === 'lifetime' || String(c.date).slice(0, 4) === CURRENT_YEAR);
    const stats = computeStats(filtered);
    const lifetimeStats = computeStats(acc.log);
    const total = Math.max(1, uniqueColorCount(filtered));

    const familyRows = FAMILIES.map((f) => {
      const n = stats.counts[f.name];
      const pct = (n / total) * 100;
      return {
        name: f.name,
        meta: n ? n + ' · ' + (pct < 1 ? '<1' : Math.round(pct)) + '%' : 'unused',
        width: n ? Math.max(3, pct) + '%' : '0%',
        fill: f.hex,
        nameOpacity: n ? 1 : 0.35,
        trackRing: n ? 'inset 0 0 0 1px rgba(28,27,26,.07)' : 'inset 0 0 0 1px rgba(28,27,26,.16)',
      };
    });

    const sheetName = state.familyOpen;
    const sheetItems = sheetName
      ? groupByColor(filtered.filter((c) => familyOf(c.hex) === sheetName)).map((g) => ({
          hex: g.hex,
          note: g.entries[0].note,
          dateLabel: dateLabel(g.entries[0].date),
          fav: g.fav,
          count: g.count,
          raw: g.entries[0],
        }))
      : [];

    // groupByColor already returns colors in newest-added order (log entries
    // are always unshifted to the front), so "newest" needs no extra sort.
    const colorGroups = groupByColor(acc.log);
    if (state.gridFilter === 'most') colorGroups.sort((a, b) => b.count - a.count);
    else if (state.gridFilter === 'least') colorGroups.sort((a, b) => a.count - b.count);

    // How many times each color has been used, looked up wherever a swatch
    // for that color shows up (grid, family/favorites lists, extract dupes).
    const countByHex: Record<string, number> = {};
    colorGroups.forEach((g) => { countByHex[g.hex] = g.count; });

    const selectedNewCount = state.extractNew.filter((x) => state.extractPicked[x]).length;
    const allNewSelected = state.extractNew.length > 0 && selectedNewCount === state.extractNew.length;
    const selectedDupeCount = state.extractDupes.filter((x) => state.extractPicked[x]).length;
    const allDupesSelected = state.extractDupes.length > 0 && selectedDupeCount === state.extractDupes.length;
    const selectedCount = selectedNewCount + selectedDupeCount;

    const detailEntries = state.detailHex
      ? acc.log.filter((c) => c.hex.toUpperCase() === state.detailHex).sort((a, b) => (a.date < b.date ? 1 : -1))
      : [];
    const detailFamily = state.detailHex ? familyOf(state.detailHex) : '';
    const detailFav = detailEntries.some((e) => e.fav);

    const addUsageFamily = state.addUsageHex ? familyOf(state.addUsageHex) : '';

    const coverageNote =
      stats.touched === FAMILIES.length
        ? 'Every family touched at least once.'
        : (FAMILIES.length - stats.touched === 1
            ? '1 family still untouched: '
            : FAMILIES.length - stats.touched + ' families still untouched: ') +
          FAMILIES.filter((f) => !stats.counts[f.name]).map((f) => f.name).join(', ') +
          '.';

    const pips = FAMILIES.map((f) => ({
      bg: stats.counts[f.name] > 0 ? f.hex : 'transparent',
      ring: stats.counts[f.name] > 0 ? 'none' : 'inset 0 0 0 1px rgba(28,27,26,.2)',
    }));

    const overallPct = (uniqueColorCount(acc.log) / 16777216 * 100).toFixed(5).replace(/0+$/, '').replace(/\.$/, '') + '%';

    const headers: Record<string, [string, string, string]> = {
      colors: ['', 'Color Remains', ''],
      balance: ['', 'My Journey', ''],
      profile: ['', 'Profile', 'v1.0'],
    };

    const favs = acc.log.filter((c) => c.fav).sort((a, b) => (a.date < b.date ? 1 : -1));
    const favItems = favs.map((c) => ({
      hex: c.hex.toUpperCase(), note: c.note, dateLabel: dateLabel(c.date), family: familyOf(c.hex), raw: c,
    }));

    return {
      acc,
      previewHex,
      previewFamily,
      existing,
      filtered,
      totalUnique: uniqueColorCount(filtered),
      stats,
      lifetimeStats,
      familyRows,
      sheetName,
      sheetItems,
      sheetEmpty: !!sheetName && sheetItems.length === 0,
      sheetEmptyNote: (sheetName && EMPTY_NOTES[sheetName]) || 'Nothing logged in this family yet.',
      selectedCount,
      selectedNewCount,
      allNewSelected,
      selectedDupeCount,
      allDupesSelected,
      detailEntries,
      detailFamily,
      detailFav,
      addUsageFamily,
      coverageNote,
      pips,
      overallPct,
      uniqueColors: uniqueColorCount(acc.log),
      header: headers[state.screen],

      colorGroups,
      countByHex,
      isEmpty: colorGroups.length === 0,
      emptyTitle: 'Nothing logged yet',
      emptyNote: 'Pick a color above and mark it as used. Every entry finds its own family.',

      favCountLabel: favs.length === 1 ? '1 color' : favs.length + ' colors',
      favPreview: favs.slice(0, 4),
      noFavs: favs.length === 0,
      favItems,

      fav: starStyle(state.fav),
      entryFav: starStyle(state.entryFav),
    } as const;
  }, [state]);
}

export type Derived = ReturnType<typeof useDerived>;
