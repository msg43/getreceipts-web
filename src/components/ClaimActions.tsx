'use client';

import Link from "next/link";

type Claim = {
  id: string;
  slug: string;
  text_short: string;
  text_long?: string;
  topics?: string[];
  created_by?: string;
  created_at?: string;
};

type Aggregate = {
  claim_id: string;
  consensus_score?: number;
  support_count?: number;
  dispute_count?: number;
  support_weight?: number;
  dispute_weight?: number;
};

function buildSnippet(c: Claim, agg: Aggregate | undefined) {
  const pct = Math.round(Number(agg?.consensus_score ?? 0.5) * 100);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/claim/${c.slug}`;
  return `🧾 ${c.text_short}\n🌡️ Consensus: ${pct}%\n🔗 ${url}`;
}

interface ClaimActionsProps {
  claim: Claim;
  aggregate: Aggregate | undefined;
  slug: string;
}

export default function ClaimActions({ claim, aggregate, slug }: ClaimActionsProps) {
  const handleCopySnippet = async () => {
    const text = buildSnippet(claim, aggregate);
    await navigator.clipboard.writeText(text);
    alert("Snippet copied!");
  };

  return (
    <div className="ml-auto flex gap-3">
      <button className="underline" onClick={handleCopySnippet}>
        Copy Snippet
      </button>
      <Link className="underline" href={`/embed/${slug}`} target="_blank">
        Open Embed
      </Link>
    </div>
  );
}
