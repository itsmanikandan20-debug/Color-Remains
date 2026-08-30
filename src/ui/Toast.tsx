import type { Flash } from '../types';
import { INK } from './tokens';

export function Toast({ flash }: { flash: Flash }) {
  if (!flash) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 96, zIndex: 19, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: INK, color: '#FFFFFF', padding: '9px 15px', borderRadius: 999, fontSize: 12.5, animation: 'cbFade 1.6s ease forwards' }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', background: flash.hex, boxShadow: '0 0 0 1px rgba(255,255,255,.35)', display: 'inline-block', animation: 'cbTick .34s cubic-bezier(.2,.9,.3,1)' }} />
        <span>{flash.label}</span>
      </div>
    </div>
  );
}
