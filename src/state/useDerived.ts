import { useMemo } from 'react';
import type { AppState } from '../types';
import { FAMILIES, familyOf, hsvToHex, computeStats, dateLabel } from '../lib/color';
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
    const total = filtered.length || 1;

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
      ? filtered
          .filter((c) => familyOf(c.hex) === sheetName)
          .sort((a, b) => (a.date < b.date ? 1 : -1))
          .map((c) => ({ hex: c.hex.toUpperCase(), note: c.note, dateLabel: dateLabel(c.date), fav: !!c.fav, raw: c }))
      : [];

    const showFavs = state.gridFilter === 'favs';
    const favs = acc.log.filter((c) => c.fav).sort((a, b) => (a.date < b.date ? 1 : -1));
    const gridColors = showFavs ? favs : acc.log;

    const selectedCount = state.extractNew.filter((x) => state.extractPicked[x]).length;
    const allSelected = state.extractNew.length > 0 && selectedCount === state.extractNew.length;

    const detailEntry = state.detailHex ? acc.log.find((c) => c.hex.toUpperCase() === state.detailHex) || null : null;
    const detailFav = !!(detailEntry && detailEntry.fav);

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

    const overallPct = (acc.log.length / 16777216 * 100).toFixed(5).replace(/0+$/, '').replace(/\.$/, '') + '%';

    const headers: Record<string, [string, string, string]> = {
      colors: ['', 'Colour Remains', ''],
      balance: ['', 'My Journey', ''],
      profile: ['', 'Profile', 'v1.0'],
    };

    const favItems = favs.map((c) => ({
      hex: c.hex.toUpperCase(), note: c.note, dateLabel: dateLabel(c.date), family: familyOf(c.hex), raw: c,
    }));

    return {
      acc,
      previewHex,
      previewFamily,
      existing,
      filtered,
      stats,
      lifetimeStats,
      familyRows,
      sheetName,
      sheetItems,
      sheetEmpty: !!sheetName && sheetItems.length === 0,
      sheetEmptyNote: (sheetName && EMPTY_NOTES[sheetName]) || 'Nothing logged in this family yet.',
      selectedCount,
      allSelected,
      detailEntry,
      detailFav,
      coverageNote,
      pips,
      overallPct,
      header: headers[state.screen],

      showFavs,
      gridColors,
      isEmpty: gridColors.length === 0,
      emptyTitle: showFavs ? 'No favorites yet' : 'Nothing logged yet',
      emptyNote: showFavs
        ? 'Tap the star when you log a color to keep it here.'
        : 'Pick a color above and mark it as used. Every entry finds its own family.',
      allTab: { bg: showFavs ? 'transparent' : '#FFFFFF', color: showFavs ? 'rgba(28,27,26,.5)' : '#1C1B1A', shadow: showFavs ? 'none' : '0 1px 3px rgba(28,27,26,.14)' },
      favTab: { bg: showFavs ? '#FFFFFF' : 'transparent', color: showFavs ? '#1C1B1A' : 'rgba(28,27,26,.5)', shadow: showFavs ? '0 1px 3px rgba(28,27,26,.14)' : 'none' },

      favCountLabel: favs.length === 1 ? '1 color' : favs.length + ' colors',
      favPreview: favs.slice(0, 4),
      noFavs: favs.length === 0,
      favItems,

      fav: starStyle(state.fav),
      batchFav: starStyle(state.batchFav),
      entryFav: starStyle(state.entryFav),
    } as const;
  }, [state]);
}

export type Derived = ReturnType<typeof useDerived>;
