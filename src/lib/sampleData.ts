import type { LogEntry } from './color';

export const SAMPLE: Omit<LogEntry, 'id'>[] = [
  { hex: '#2E5AAC', note: 'Ledger app — primary button', date: '2026-05-14' },
  { hex: '#2E5AAC', note: 'Onboarding — link color', date: '2026-06-20' },
  { hex: '#1B3A6B', note: 'Ledger app — dark header', date: '2026-05-14' },
  { hex: '#4A7FD1', note: 'Ledger app — chart line', date: '2026-04-02' },
  { hex: '#6FA8DC', note: 'Onboarding illustration fill', date: '2025-11-19' },
  { hex: '#0F2540', note: 'Conference poster background', date: '2025-09-08' },
  { hex: '#8FB4E3', note: 'Empty-state wash', date: '2025-06-21' },
  { hex: '#2FA8A0', note: 'Trailhead logo mark', date: '2026-03-11' },
  { hex: '#7FD4CE', note: 'Trailhead secondary tint', date: '2026-03-11' },
  { hex: '#3E7A4F', note: 'Farmers market branding', date: '2026-02-27' },
  { hex: '#86A96B', note: 'Market poster type', date: '2025-08-14' },
  { hex: '#C7D6A8', note: 'Packaging label ground', date: '2025-04-30' },
  { hex: '#E7C34A', note: 'Wayfinding signage accent', date: '2026-01-16' },
  { hex: '#F2E1A0', note: 'Newsletter highlight', date: '2025-10-05' },
  { hex: '#D97B34', note: 'Recipe app tag', date: '2026-06-03' },
  { hex: '#E9A96B', note: 'Recipe app card wash', date: '2026-06-03' },
  { hex: '#B33A32', note: 'Error state — banking flow', date: '2026-04-22' },
  { hex: '#D6544A', note: 'Gig poster type', date: '2025-07-12' },
  { hex: '#5B4A8A', note: 'Meditation app gradient stop', date: '2026-02-05' },
  { hex: '#7E6BB5', note: 'Meditation app slider', date: '2025-12-18' },
  { hex: '#A8407E', note: 'Album sleeve accent', date: '2025-05-23' },
  { hex: '#8A8785', note: 'Dashboard grid lines', date: '2026-06-18' },
  { hex: '#C9C6C1', note: 'Form field borders', date: '2026-03-30' },
  { hex: '#5C5A57', note: 'Body copy — annual report', date: '2025-11-02' },
  { hex: '#1C1B1A', note: 'Ink — everything', date: '2026-07-01' },
  { hex: '#2A2724', note: 'Dark mode surface', date: '2025-10-21' },
];

export const DEMO_ACCOUNT = {
  name: 'Mani',
  email: 'mani@studio.com',
  bio: 'A record of the colours I actually use across my design work.',
  avatar: null as string | null,
  joined: '2023-11-01',
};
