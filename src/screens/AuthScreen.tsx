import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import { ink, INK, RED, inputStyle, primaryButton } from '../ui/tokens';

export function AuthScreen({ state, actions }: { state: AppState; actions: AppActions }) {
  const isNew = state.authMode === 'signup';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '56px 30px 40px', animation: 'cbIn .3s ease' }}>
      <img
        src="/logo-small.png"
        alt="Colour Remains"
        style={{ height: 74, width: 'auto', display: 'block', marginBottom: 20, objectFit: 'scale-down' }}
      />
      <div style={{ fontSize: 38, lineHeight: 1.05, letterSpacing: '-.02em', fontWeight: 600 }}>Colour Remains</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.55, color: ink(0.6), marginTop: 11, maxWidth: 280 }}>
        Your log lives with your account. Sign in on any device and every swatch, note and date comes back.
      </div>

      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          value={state.email}
          onChange={(e) => actions.patch({ email: e.target.value, authError: '' })}
          placeholder="you@studio.com"
          autoComplete="username"
          style={inputStyle}
        />
        <input
          value={state.password}
          onChange={(e) => actions.patch({ password: e.target.value, authError: '' })}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          style={inputStyle}
        />
      </div>

      {state.authError && <div style={{ fontSize: 12, color: RED, marginTop: 9 }}>{state.authError}</div>}

      <button onClick={() => actions.signIn(state.email)} style={{ ...primaryButton, marginTop: 14 }}>
        {isNew ? 'Create account' : 'Sign in'}
      </button>
      <button
        onClick={() => actions.patch({ authMode: isNew ? 'signin' : 'signup', authError: '' })}
        style={{ width: '100%', marginTop: 8, padding: '8px 0', border: 'none', background: 'none', color: ink(0.55), fontSize: 12.5, cursor: 'pointer' }}
      >
        {isNew ? 'I already have an account' : 'New here? Create an account'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px' }}>
        <div style={{ flex: 1, height: 1, background: ink(0.12) }} />
        <div style={{ fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: ink(0.38) }}>or</div>
        <div style={{ flex: 1, height: 1, background: ink(0.12) }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <button
          onClick={() => actions.signIn('mani@studio.com', true)}
          style={{ width: '100%', padding: '12px 0', border: `1px solid ${ink(0.18)}`, borderRadius: 11, background: '#FAFAFA', fontSize: 13, color: INK, cursor: 'pointer' }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
