// Dominant-color extraction: coarse RGB bucket histogram, then merge buckets
// that are perceptually close so the palette reads as distinct swatches.
export function extractColors(img: HTMLImageElement): string[] {
  if (!img.naturalWidth) return [];
  const W = 120;
  const H = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * W));
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, W, H);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, W, H).data;
  } catch {
    return [];
  }

  const buckets: Record<string, { n: number; r: number; g: number; b: number }> = {};
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const key = (r >> 4) + ',' + (g >> 4) + ',' + (b >> 4);
    const bk = buckets[key] || (buckets[key] = { n: 0, r: 0, g: 0, b: 0 });
    bk.n++; bk.r += r; bk.g += g; bk.b += b;
  }
  const list = Object.values(buckets)
    .map((bk) => ({ n: bk.n, r: bk.r / bk.n, g: bk.g / bk.n, b: bk.b / bk.n }))
    .sort((a, b) => b.n - a.n);

  const picked: { r: number; g: number; b: number }[] = [];
  for (const c of list) {
    if (picked.length >= 12) break;
    const far = picked.every((p) => Math.abs(p.r - c.r) + Math.abs(p.g - c.g) + Math.abs(p.b - c.b) > 60);
    if (far) picked.push(c);
  }
  return picked.map(
    (c) => '#' + [c.r, c.g, c.b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('').toUpperCase(),
  );
}

export function sampleImageAt(img: HTMLImageElement, clientX: number, clientY: number): string | null {
  const r = img.getBoundingClientRect();
  const cv = document.createElement('canvas');
  cv.width = img.naturalWidth; cv.height = img.naturalHeight;
  const ctx = cv.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  const scale = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
  const ox = (r.width - img.naturalWidth * scale) / 2;
  const oy = (r.height - img.naturalHeight * scale) / 2;
  const x = Math.round((clientX - r.left - ox) / scale);
  const y = Math.round((clientY - r.top - oy) / scale);
  if (x < 0 || y < 0 || x >= cv.width || y >= cv.height) return null;
  try {
    const d = ctx.getImageData(x, y, 1, 1).data;
    return '#' + [d[0], d[1], d[2]].map((n) => n.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
}

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
