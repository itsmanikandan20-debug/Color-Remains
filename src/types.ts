import type { LogEntry } from './lib/color';

export type Account = {
  name: string;
  email: string;
  bio: string;
  avatar: string | null;
  joined: string;
  log: LogEntry[];
};

export type Screen = 'colors' | 'balance' | 'profile';
export type Range = 'lifetime' | 'year';
export type AuthMode = 'signin' | 'signup';
export type GridFilter = 'newest' | 'most' | 'least';

export type Flash = { hex: string; label: string } | null;

export type AppState = {
  account: Account | null;

  authMode: AuthMode;
  email: string;
  password: string;
  authError: string;

  screen: Screen;
  range: Range;

  h: number;
  s: number;
  v: number;
  hexInput: string;
  exact: string;

  noteOpen: boolean;
  note: string;
  date: string;
  fav: boolean;

  familyOpen: string | null;
  flash: Flash;

  imageSrc: string | null;

  editOpen: boolean;
  draftName: string;
  draftBio: string;

  shareOpen: boolean;
  shareUrl: string | null;

  entryId: string | null;
  entryHex: string | null;
  entryNote: string;
  entryDate: string;
  entryFav: boolean;

  detailHex: string | null;

  addUsageHex: string | null;
  addUsageNote: string;
  addUsageDate: string;
  addUsageFav: boolean;

  gridFilter: GridFilter;
  favSheetOpen: boolean;

  extractOpen: boolean;
  extractNew: string[];
  extractDupes: string[];
  extractPicked: Record<string, boolean>;
  batchNote: string;
  batchFav: boolean;
};
