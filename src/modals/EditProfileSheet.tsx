import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import { initials } from '../lib/color';
import { ink, inputStyle, primaryButton, ghostButton, sheetWrap, scrim } from '../ui/tokens';

export function EditProfileSheet({ state, actions }: { state: AppState; actions: AppActions }) {
  if (!state.editOpen || !state.account) return null;
  const acc = state.account;
  const close = () => actions.patch({ editOpen: false });

  return (
    <>
      <div onClick={close} style={scrim(20)} />
      <div style={{ ...sheetWrap, padding: '20px 22px 24px' }}>
        <div style={{ fontSize: 22 }}>Edit profile</div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', flex: 'none', overflow: 'hidden', background: ink(0.055), boxShadow: `inset 0 0 0 1px ${ink(0.12)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: ink(0.6) }}>
            {acc.avatar ? <img src={acc.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : initials(acc.name)}
          </div>
          <label style={{ padding: '10px 14px', border: `1px solid ${ink(0.18)}`, borderRadius: 10, fontSize: 12.5, cursor: 'pointer', background: '#FAFAFA' }}>
            <span>Change photo</span>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) actions.onAvatarFile(f); }} style={{ display: 'none' }} />
          </label>
          {acc.avatar && (
            <button onClick={() => actions.updateAccount({ avatar: null })} style={{ border: 'none', background: 'none', fontSize: 12, color: ink(0.5), cursor: 'pointer' }}>Remove</button>
          )}
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input value={state.draftName} onChange={(e) => actions.patch({ draftName: e.target.value })} placeholder="Name" style={{ ...inputStyle, fontSize: 13.5 }} />
          <textarea
            value={state.draftBio}
            onChange={(e) => actions.patch({ draftBio: e.target.value })}
            rows={3}
            placeholder="Short bio"
            style={{ ...inputStyle, lineHeight: 1.5, resize: 'none' }}
          />
        </div>
        <button onClick={() => actions.saveProfile()} style={{ ...primaryButton, marginTop: 14 }}>Save changes</button>
        <button onClick={close} style={ghostButton}>Cancel</button>
      </div>
    </>
  );
}
