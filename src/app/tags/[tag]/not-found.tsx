import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Tag Not Found</h1>
        <p className="text-slate-600 text-lg mb-6">
          No claims were found with this tag, or the tag doesn&apos;t exist.
        </p>
      </div>

      <div className="space-y-4">
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Home
        </Link>
        
        <div className="text-slate-500">
          <p>You can also:</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/graph" className="text-blue-600 hover:underline">
                Explore the Claims Graph
              </Link>
            </li>
            <li>
              <Link href="/submit" className="text-blue-600 hover:underline">
                Submit a New Claim
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
