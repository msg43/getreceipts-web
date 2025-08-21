'use client';
import { useState } from "react";

export default function SubmitPage(){
  const [jsonText, setJsonText] = useState<string>("");
  const [result, setResult] = useState<{ claim_id: string; url: string; badge_url: string } | null>(null);
  const [error, setError] = useState<string>("");

  async function handleSubmit(){
    setError("");
    try {
      const payload = JSON.parse(jsonText);
      const res = await fetch("/api/receipts", { method:"POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if(!res.ok){ setError(JSON.stringify(data, null, 2)); return; }
      setResult(data);
    } catch(e: unknown){
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON";
      setError(errorMessage);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Submit Receipt (RF‑1)</h1>
      <p>Paste your RF‑1 JSON below, then click Publish.</p>
      <textarea value={jsonText} onChange={e=>setJsonText(e.target.value)} className="w-full h-64 border rounded p-2 font-mono text-sm" placeholder='{"claim_text": "..."}' />
      <div className="flex gap-3">
        <button onClick={handleSubmit} className="px-4 py-2 border rounded">Publish</button>
        {result?.url && <a className="px-4 py-2 border rounded underline" href={result.url}>Open Claim</a>}
      </div>
      {error && <pre className="text-red-600 text-sm whitespace-pre-wrap">{error}</pre>}
      {result && <pre className="text-xs bg-gray-50 p-3 rounded border mt-2">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}