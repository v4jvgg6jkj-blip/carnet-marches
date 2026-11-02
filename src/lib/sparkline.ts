// Génère un tracé SVG (path) à partir d'une série de valeurs. Utilisé côté serveur ET client.
export function sparkPath(values: number[], w: number, h: number, pad = 2): { line: string; area: string } {
  const v = values.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  if (v.length < 2) return { line: '', area: '' };
  const min = Math.min(...v);
  const max = Math.max(...v);
  const span = max - min || 1;
  const pts = v.map((y, i) => [pad + (i / (v.length - 1)) * (w - 2 * pad), pad + (1 - (y - min) / span) * (h - 2 * pad)]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('');
  const area = `${line}L${pts.at(-1)![0].toFixed(1)},${h}L${pts[0][0].toFixed(1)},${h}Z`;
  return { line, area };
}
