export const INK = '#1C1B1A';
export const PAPER_BG = '#F0EFEC';
export const RED = '#B33A32';

export const ink = (a: number) => `rgba(28,27,26,${a})`;

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 12px',
  border: `1px solid ${ink(0.16)}`,
  borderRadius: 10,
  background: '#FAFAFA',
  fontSize: 13,
  color: INK,
  outline: 'none',
};

export const primaryButton: React.CSSProperties = {
  width: '100%',
  border: 'none',
  borderRadius: 11,
  background: INK,
  color: '#FFFFFF',
  fontSize: 13.5,
  fontWeight: 500,
  cursor: 'pointer',
  padding: '13px 0',
};

export const ghostButton: React.CSSProperties = {
  width: '100%',
  border: 'none',
  background: 'none',
  color: ink(0.5),
  fontSize: 12.5,
  cursor: 'pointer',
  padding: '9px 0',
};

export const sheetWrap: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 21,
  background: '#FFFFFF',
  borderRadius: '20px 20px 26px 26px',
  boxShadow: '0 -8px 30px rgba(28,27,26,.16)',
  animation: 'cbUp .28s cubic-bezier(.2,.8,.25,1)',
};

export const scrim = (z: number): React.CSSProperties => ({
  position: 'absolute',
  inset: 0,
  background: ink(0.34),
  zIndex: z,
});

export function starStyle(on: boolean) {
  return {
    glyph: on ? '★' : '☆',
    bg: on ? INK : '#FAFAFA',
    color: on ? '#FFFFFF' : ink(0.45),
    border: on ? `1px solid ${INK}` : `1px solid ${ink(0.16)}`,
  };
}

export const favToggleButton = (s: ReturnType<typeof starStyle>): React.CSSProperties => ({
  flex: 'none',
  width: 42,
  height: 42,
  borderRadius: 12,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 17,
  lineHeight: 1,
  padding: 0,
  transition: 'background .18s ease, color .18s ease',
  border: s.border,
  background: s.bg,
  color: s.color,
});
