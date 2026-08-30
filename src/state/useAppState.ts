import { useCallback, useMemo, useRef, useState } from 'react';
import type { Account, AppState } from '../types';
import { hexToRgb, rgbToHsv, hsvToHex, todayISO, type LogEntry } from '../lib/color';
import { SAMPLE } from '../lib/sampleData';
import { extractColors, sampleImageAt, readImageFile } from '../lib/extract';

const DEMO_EMAIL = 'mani@studio.com';

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] || 'Designer';
  return local
    .split(/[.\-_]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ') || 'Designer';
}

function createAccount(email: string): Account {
  const isDemo = email.toLowerCase() === DEMO_EMAIL;
  return {
    email,
    name: isDemo ? 'Mani' : nameFromEmail(email),
    bio: isDemo
      ? 'Product designer. Ten years of apps, posters and identities. Keeping an honest record of what I actually reach for.'
      : 'Say something about your design work.',
    avatar: null,
    joined: isDemo ? '2023-11-01' : todayISO(),
    // Every fresh account starts with sample data so the balance dashboard
    // reads real right away — this is a click-through prototype, not a blank app.
    log: SAMPLE.map((c) => ({ ...c })),
  };
}

const initialState: AppState = {
  account: null,

  authMode: 'signin',
  email: '',
  password: '',
  authError: '',

  screen: 'colors',
  range: 'lifetime',

  h: 214, s: 73, v: 67,
  hexInput: '#2E5AAC', exact: '#2E5AAC',

  noteOpen: false, note: '', date: todayISO(), fav: false,

  familyOpen: null, flash: null,

  imageSrc: null,

  editOpen: false, draftName: '', draftBio: '',

  shareOpen: false, shareUrl: null,

  entryHex: null, entryNote: '', entryDate: '', entryFav: false,

  detailHex: null,

  gridFilter: 'all', favSheetOpen: false,

  extractOpen: false, extractNew: [], extractDupes: [], extractPicked: {}, batchNote: '', batchFav: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const patch = useCallback((p: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => {
    setState((st) => ({ ...st, ...(typeof p === 'function' ? p(st) : p) }));
  }, []);

  const updateAccount = useCallback((p: Partial<Account>) => {
    setState((st) => (st.account ? { ...st, account: { ...st.account, ...p } } : st));
  }, []);

  const toast = useCallback((label: string, hex?: string) => {
    clearTimeout(flashTimer.current);
    setState((st) => ({ ...st, flash: { hex: hex || '#FFFFFF', label } }));
    flashTimer.current = setTimeout(() => setState((st) => ({ ...st, flash: null })), 1700);
  }, []);

  const signIn = useCallback((email: string, seed?: boolean) => {
    const clean = String(email || '').trim().toLowerCase();
    if (!clean || clean.indexOf('@') < 0) {
      patch({ authError: 'Enter the email on your account.' });
      return;
    }
    const account = createAccount(seed ? DEMO_EMAIL : clean);
    patch({ account, authError: '', password: '' });
  }, [patch]);

  const setFromHex = useCallback((hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    const norm = '#' + rgb.map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase();
    patch({ h, s, v, hexInput: hex.toUpperCase(), exact: norm });
  }, [patch]);

  const setFromHsv = useCallback((p: Partial<{ h: number; s: number; v: number }>) => {
    setState((st) => {
      const n = { h: st.h, s: st.s, v: st.v, ...p };
      const hex = hsvToHex(n.h, n.s, n.v);
      return { ...st, ...n, hexInput: hex, exact: hex };
    });
  }, []);

  const save = useCallback(() => {
    setState((st) => {
      if (!st.account) return st;
      const hex = st.exact || hsvToHex(st.h, st.s, st.v);
      const log: LogEntry[] = [
        { hex, note: st.note || 'No note', date: st.date, fav: st.fav },
        ...st.account.log.filter((c) => c.hex.toUpperCase() !== hex.toUpperCase()),
      ];
      return { ...st, account: { ...st.account, log }, noteOpen: false, note: '', fav: false };
    });
    toast('Marked as used', state.exact || hsvToHex(state.h, state.s, state.v));
  }, [patch, toast, state.exact, state.h, state.s, state.v]);

  const openEntry = useCallback((c: { hex: string; note: string; date: string; fav?: boolean }) => {
    patch({ entryHex: c.hex.toUpperCase(), entryNote: c.note, entryDate: c.date, entryFav: !!c.fav });
  }, [patch]);

  const saveEntry = useCallback(() => {
    setState((st) => {
      if (!st.account || !st.entryHex) return st;
      const key = st.entryHex.toUpperCase();
      const log = st.account.log.map((c) =>
        c.hex.toUpperCase() === key
          ? { hex: c.hex, note: st.entryNote || 'No note', date: st.entryDate || c.date, fav: st.entryFav }
          : c,
      );
      return { ...st, account: { ...st.account, log }, entryHex: null, detailHex: null };
    });
    toast(state.entryFav ? 'Saved to favorites' : 'Entry updated', state.entryHex || undefined);
  }, [toast, state.entryHex, state.entryFav]);

  const removeEntry = useCallback(() => {
    setState((st) => {
      if (!st.account || !st.entryHex) return st;
      const key = st.entryHex.toUpperCase();
      const log = st.account.log.filter((c) => c.hex.toUpperCase() !== key);
      return { ...st, account: { ...st.account, log }, entryHex: null, detailHex: null };
    });
    toast('Removed from log', '#8A8785');
  }, [toast]);

  const onFile = useCallback(async (file: File) => {
    const src = await readImageFile(file);
    patch({ imageSrc: src });
  }, [patch]);

  const sampleFromImage = useCallback((clientX: number, clientY: number): string | null => {
    const img = imgRef.current;
    if (!img) return null;
    const hex = sampleImageAt(img, clientX, clientY);
    if (hex) setFromHex(hex);
    return hex;
  }, [setFromHex]);

  const extract = useCallback(() => {
    setState((st) => {
      const img = imgRef.current;
      if (!img || !st.account) return st;
      const hexes = extractColors(img);
      const logged: Record<string, boolean> = {};
      st.account.log.forEach((c) => { logged[c.hex.toUpperCase()] = true; });
      return {
        ...st,
        extractNew: hexes.filter((x) => !logged[x]),
        extractDupes: hexes.filter((x) => logged[x]),
        extractPicked: {},
        batchNote: '',
        extractOpen: true,
      };
    });
  }, []);

  const addBatch = useCallback(() => {
    let count = 0;
    let firstHex: string | undefined;
    setState((st) => {
      if (!st.account) return st;
      const chosen = st.extractNew.filter((x) => st.extractPicked[x]);
      if (!chosen.length) return st;
      count = chosen.length;
      firstHex = chosen[0];
      const note = st.batchNote.trim() || 'No note';
      const entries: LogEntry[] = chosen.map((hex) => ({ hex, note, date: st.date, fav: st.batchFav }));
      return {
        ...st,
        account: { ...st.account, log: [...entries, ...st.account.log] },
        extractOpen: false,
        batchFav: false,
      };
    });
    if (count) toast(count + ' colors added', firstHex);
  }, [toast]);

  const onAvatarFile = useCallback(async (file: File) => {
    const src = await readImageFile(file);
    updateAccount({ avatar: src });
  }, [updateAccount]);

  const saveProfile = useCallback(() => {
    setState((st) => {
      if (!st.account) return st;
      return {
        ...st,
        account: { ...st.account, name: st.draftName || st.account.name, bio: st.draftBio },
        editOpen: false,
      };
    });
    toast('Profile saved', '#8A8785');
  }, [toast]);

  const logout = useCallback(() => {
    setState((st) => ({
      ...initialState,
      email: st.account?.email || '',
      authMode: 'signin',
    }));
  }, []);

  const actions = useMemo(() => ({
    patch, updateAccount, toast, signIn, setFromHex, setFromHsv, save,
    openEntry, saveEntry, removeEntry, onFile, sampleFromImage, extract,
    addBatch, onAvatarFile, saveProfile, logout,
  }), [patch, updateAccount, toast, signIn, setFromHex, setFromHsv, save,
    openEntry, saveEntry, removeEntry, onFile, sampleFromImage, extract,
    addBatch, onAvatarFile, saveProfile, logout]);

  return { state, actions, imgRef };
}

export type AppActions = ReturnType<typeof useAppState>['actions'];
