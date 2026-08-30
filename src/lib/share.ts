import { FAM_HEX, computeStats, monthYear, type LogEntry } from './color';

export function buildShareCard(name: string, joined: string, log: LogEntry[]): string {
  const s = computeStats(log);
  const W = 1080;
  const H = 660;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  if (!c) return '';

  c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, W, H);
  c.strokeStyle = 'rgba(28,27,26,0.14)'; c.lineWidth = 2;
  c.strokeRect(56, 56, W - 112, H - 112);

  c.fillStyle = 'rgba(28,27,26,0.45)';
  c.font = '500 22px Inter, sans-serif';
  c.fillText('C O L O U R   R E M A I N S', 110, 150);

  c.fillStyle = '#1C1B1A';
  c.font = '500 74px Inter, sans-serif';
  c.fillText(name, 108, 250);
  c.fillStyle = 'rgba(28,27,26,0.5)';
  c.font = '26px Inter, sans-serif';
  c.fillText('Designer since ' + monthYear(joined), 110, 296);

  const overall = (log.length / 16777216 * 100).toFixed(5).replace(/0+$/, '') + '%';
  const cols: [string, string][] = [
    [String(log.length), 'colors logged'],
    [overall, 'overall'],
    [s.leans, 'leans'],
  ];
  const colX = [110, 330, 700];
  cols.forEach((col, i) => {
    const x = colX[i];
    c.fillStyle = '#1C1B1A';
    c.font = '500 56px Inter, sans-serif';
    c.fillText(col[0], x, 460);
    c.fillStyle = 'rgba(28,27,26,0.5)';
    c.font = '24px Inter, sans-serif';
    c.fillText(col[1], x, 505);
  });
  // leans dot sits just after the third label
  c.font = '24px Inter, sans-serif';
  const leansX = colX[2] + c.measureText(cols[2][1]).width + 18;
  c.fillStyle = FAM_HEX[s.leans];
  c.beginPath(); c.arc(Math.min(leansX, 946), 497, 11, 0, Math.PI * 2); c.fill();

  c.strokeStyle = 'rgba(28,27,26,0.12)'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(108, 572); c.lineTo(W - 108, 572); c.stroke();

  c.textAlign = 'left';
  c.fillStyle = 'rgba(28,27,26,0.4)';
  c.font = '22px Inter, sans-serif';
  c.fillText('colourremains.app', 110, 592);

  return cv.toDataURL('image/png');
}
