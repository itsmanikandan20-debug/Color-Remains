import type { AppActions } from '../state/useAppState';
import type { Derived } from '../state/useDerived';
import { FAM_HEX, initials, monthYear } from '../lib/color';
import { ink, INK } from '../ui/tokens';

export function ProfileScreen({
  derived, actions,
}: {
  derived: Extract<Derived, { acc: NonNullable<Derived['acc']> }>;
  actions: AppActions;
}) {
  const { acc, overallPct, lifetimeStats, favCountLabel, favPreview } = derived;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '22px 22px 110px' }}>
      <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
        <div style={{ width: 74, height: 74, borderRadius: '50%', flex: 'none', overflow: 'hidden', background: ink(0.055), boxShadow: `inset 0 0 0 1px ${ink(0.12)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: ink(0.6) }}>
          {acc.avatar ? <img src={acc.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : initials(acc.name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 25, lineHeight: 1.15, letterSpacing: '-.01em' }}>{acc.name}</div>
          <div style={{ fontSize: 10, color: ink(0.45), marginTop: 4 }}>{acc.email}</div>
          <div style={{ fontSize: 11.5, color: ink(0.5), marginTop: 3 }}>Designer since {monthYear(acc.joined)}</div>
        </div>
      </div>

      <div style={{ fontSize: 13, lineHeight: 1.6, color: ink(0.72), marginTop: 16 }}>{acc.bio}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: ink(0.1), borderRadius: 12, overflow: 'hidden', marginTop: 20 }}>
        <div style={{ background: '#FFFFFF', padding: '14px 12px' }}>
          <div style={{ fontSize: 26, lineHeight: 1 }}>{acc.log.length}</div>
          <div style={{ fontSize: 10.5, color: ink(0.5), marginTop: 3 }}>colors</div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '14px 12px' }}>
          <div style={{ fontSize: 26, lineHeight: 1 }}>{overallPct}</div>
          <div style={{ fontSize: 10.5, color: ink(0.5), marginTop: 3 }}>Overall</div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '14px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 13, height: 13, borderRadius: '50%', display: 'inline-block', background: FAM_HEX[lifetimeStats.leans] }} />
            <span style={{ fontSize: 17, lineHeight: 1 }}>{lifetimeStats.leans}</span>
          </div>
          <div style={{ fontSize: 10.5, color: ink(0.5), marginTop: 5 }}>leans</div>
        </div>
      </div>

      <button
        onClick={() => actions.patch({ shareOpen: true, shareUrl: null })}
        style={{ width: '100%', marginTop: 16, padding: '14px 0', border: 'none', borderRadius: 11, background: INK, color: '#FFFFFF', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}
      >
        Share Profile
      </button>

      <div style={{ fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: ink(0.42), padding: '26px 0 8px' }}>Favorites</div>
      <div style={{ borderTop: `1px solid ${ink(0.09)}` }}>
        <button
          onClick={() => actions.patch({ favSheetOpen: true })}
          style={{ width: '100%', textAlign: 'left', padding: '15px 2px', border: 'none', borderBottom: `1px solid ${ink(0.09)}`, background: 'none', fontSize: 13.5, color: INK, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
        >
          <span>Starred colors</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
            <span style={{ display: 'flex', gap: 3 }}>
              {favPreview.map((p) => (
                <span key={p.hex} style={{ width: 16, height: 16, borderRadius: 4, display: 'inline-block', boxShadow: `inset 0 0 0 1px ${ink(0.12)}`, background: p.hex }} />
              ))}
            </span>
            <span style={{ fontSize: 11, color: ink(0.4) }}>{favCountLabel}</span>
          </span>
        </button>
      </div>

      <div style={{ fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: ink(0.42), padding: '26px 0 8px' }}>Settings</div>
      <div style={{ borderTop: `1px solid ${ink(0.09)}` }}>
        <button
          onClick={() => actions.patch({ editOpen: true, draftName: acc.name, draftBio: acc.bio })}
          style={{ width: '100%', textAlign: 'left', padding: '15px 2px', border: 'none', borderBottom: `1px solid ${ink(0.09)}`, background: 'none', fontSize: 13.5, color: INK, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>Edit profile</span>
          <span style={{ fontSize: 11, color: ink(0.4) }}>photo · name · bio</span>
        </button>
        <button onClick={() => actions.logout()} style={{ width: '100%', textAlign: 'left', padding: '15px 2px', border: 'none', background: 'none', fontSize: 13.5, color: INK, cursor: 'pointer' }}>
          Log out
        </button>
      </div>
      <div style={{ fontSize: 11.5, lineHeight: 1.5, color: ink(0.4), marginTop: 18 }}>Signed in as {acc.email}. Your log syncs to this account.</div>
    </div>
  );
}
