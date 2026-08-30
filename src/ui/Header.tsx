import { ink } from './tokens';

export function Header({ kicker, title, meta }: { kicker: string; title: string; meta: string }) {
  return (
    <div style={{ padding: '22px 22px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `1px solid ${ink(0.09)}` }}>
      <div>
        {kicker && (
          <div style={{ fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', color: ink(0.45) }}>{kicker}</div>
        )}
        <div style={{ fontSize: 27, lineHeight: 1.1, letterSpacing: '-.01em', fontWeight: 600, marginTop: 5 }}>{title}</div>
      </div>
      <div style={{ fontSize: 10, color: ink(0.45), textAlign: 'right', paddingBottom: 3 }}>{meta}</div>
    </div>
  );
}
