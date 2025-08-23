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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (typeof window !== 'undefined' ? window.location.origin : 'https://getreceipts-web.vercel.app');
  const url = `${baseUrl}/claim/${c.slug}`;
  return `🧾 ${c.text_short}\n🌡️ Consensus: ${pct}%\n🔗 ${url}`;
}

interface ClaimActionsProps {
  claim: Claim;
  aggregate: Aggregate | undefined;
  slug: string;
}

export default function ClaimActions({ claim, aggregate, slug }: ClaimActionsProps) {
  const handleCopySnippet = async () => {
    try {
      const text = buildSnippet(claim, aggregate);
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        alert("Snippet copied!");
      } else {
        // Fallback for non-HTTPS environments
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          alert("Snippet copied!");
        } catch (err) {
          console.error('Fallback copy failed:', err);
          alert("Copy failed. Please copy manually: " + text);
        }
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Copy failed:', error);
      alert("Copy failed. Please try again.");
    }
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
