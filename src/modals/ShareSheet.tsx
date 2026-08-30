import { useEffect } from 'react';
import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import { buildShareCard } from '../lib/share';
import { ink, primaryButton, ghostButton, scrim } from '../ui/tokens';

export function ShareSheet({ state, actions }: { state: AppState; actions: AppActions }) {
  const acc = state.account;

  useEffect(() => {
    if (state.shareOpen && !state.shareUrl && acc) {
      const url = buildShareCard(acc.name, acc.joined, acc.log);
      actions.patch({ shareUrl: url });
    }
  }, [state.shareOpen, state.shareUrl, acc, actions]);

  if (!state.shareOpen || !acc) return null;
  const close = () => actions.patch({ shareOpen: false });

  const download = () => {
    if (!state.shareUrl) return;
    const a = document.createElement('a');
    a.href = state.shareUrl;
    a.download = 'color-balance-' + acc.name.toLowerCase().replace(/\s+/g, '-') + '.png';
    a.click();
  };

  return (
    <>
      <div onClick={close} style={{ ...scrim(22), background: ink(0.4) }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 23,
        background: '#FFFFFF', borderRadius: '20px 20px 26px 26px', padding: '18px 20px 22px',
        boxShadow: '0 -8px 30px rgba(28,27,26,.18)', animation: 'cbUp .3s cubic-bezier(.2,.8,.25,1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 21 }}>Share card</div>
          <div style={{ fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: ink(0.42) }}>1080 × 660</div>
        </div>
        <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 14px rgba(28,27,26,.14)' }}>
          {state.shareUrl && <img src={state.shareUrl} style={{ width: '100%', display: 'block' }} />}
        </div>
        <button onClick={download} style={{ ...primaryButton, marginTop: 14 }}>Export as image</button>
        <button onClick={close} style={ghostButton}>Done</button>
      </div>
    </>
  );
}
