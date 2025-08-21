export function buildSnippet(slug: string, textShort: string, consensusPct: number) {
  return `🧾 ${textShort}
🌡️ Consensus: ${consensusPct}%
🔗 https://getreceipts.org/claim/${slug}`.trim();
}