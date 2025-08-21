export function badgeSvg(consensus: number){
  const width = 420, height = 42;
  const pct = Math.max(0, Math.min(1, Number.isFinite(consensus) ? consensus : 0.5));
  const pos = Math.round(pct * (width - 20)) + 10;
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="Consensus ${Math.round(pct*100)}%">
    <defs>
      <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ef4444"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#22c55e"/>
      </linearGradient>
    </defs>
    <rect x="10" y="14" width="${width-20}" height="14" rx="7" fill="url(#rg)"/>
    <circle cx="${pos}" cy="21" r="8" fill="#0ea5e9" />
  </svg>`;
}