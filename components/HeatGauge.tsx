function heatColor(chaleur: number): string {
  // Interpolation cyan (froid) -> ambre -> orange/rouge (chaud)
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

export default function HeatGauge({
  chaleur,
  size = 36,
}: {
  chaleur: number;
  size?: number;
}) {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(10, chaleur)) / 10;
  const dash = circumference * pct;
  const color = heatColor(chaleur);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Chaleur du lead : ${chaleur} sur 10`}
      title={`Chaleur : ${chaleur}/10`}
    >
      <svg width={size} height={size} viewBox="0 0 36 36" className="-rotate-90">
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="#242931"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[10px] leading-none text-console-text">
          {chaleur}
        </span>
      </div>
    </div>
  );
}
