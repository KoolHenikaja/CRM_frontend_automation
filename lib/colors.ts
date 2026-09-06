// Interpolation cyan (froid) -> ambre -> orange/rouge (chaud), 0 à 10.
export function heatColor(chaleur: number): string {
  const stops = [
    { at: 0, c: [91, 122, 148] }, // signal.cold
    { at: 5, c: [242, 161, 78] }, // signal.warm
    { at: 10, c: [255, 106, 61] }, // signal.hot
  ];
  const v = Math.max(0, Math.min(10, chaleur));
  let a = stops[0];
  let b = stops[1];
  if (v >= 5) {
    a = stops[1];
    b = stops[2];
  }
  const t = (v - a.at) / (b.at - a.at || 1);
  const rgb = a.c.map((av, i) => Math.round(av + (b.c[i] - av) * t));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

const COMMERCIAL_PALETTE = ["#8B7CD9", "#4FB0C6", "#D97757", "#7CB889", "#C77DBB", "#B8A24F"];

export function commercialColor(nom: string): string {
  let hash = 0;
  for (let i = 0; i < nom.length; i++) hash = (hash * 31 + nom.charCodeAt(i)) | 0;
  const idx = Math.abs(hash) % COMMERCIAL_PALETTE.length;
  return COMMERCIAL_PALETTE[idx];
}
