import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LiveClaims from "@/components/LiveClaims";
import { getVersion } from "@/lib/version";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import { Suspense } from "react";

export default function Home() {
  const version = getVersion();
  
  return (
    <GlobalErrorBoundary>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                🧾 GetReceipts.org
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/graph" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                Graph
              </Link>
              <Link href="/bookmarks" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                Bookmarks
              </Link>
              <Link href="/submit" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                Submit
              </Link>
              <Link href="https://github.com/msg43/GetReceipts" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                GitHub
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
          Publish & Share <br />
          <span className="text-blue-600 dark:text-blue-400">Claim Receipts</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
          A platform for publishing and sharing &quot;receipts&quot; of claims and counterclaims 
          with sources and a Consensus Meter. Built for transparency and evidence-based discourse.
        </p>
        <div className="flex justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="#demo">View Live Claims</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 Submit Claims
              </CardTitle>
              <CardDescription>
                Upload RF-1 formatted claims with sources, evidence, and positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Use our structured format to submit claims with supporting evidence, 
                sources, and clear positions from various stakeholders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌡️ Consensus Meter
              </CardTitle>
              <CardDescription>
                Visual representation of agreement levels across sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Dynamic badges show consensus levels from red (disputed) to green (agreed), 
                helping readers quickly assess claim support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔗 Share & Embed
              </CardTitle>
              <CardDescription>
                Embeddable cards for social media and websites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Generate shareable snippets and embeddable cards optimized 
                for Reddit, Twitter, and other platforms.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="container mx-auto px-4 py-16 bg-white dark:bg-slate-900 rounded-lg mx-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
          Live Disagreements
        </h2>
        <Suspense fallback={
          <div className="text-center text-slate-600 dark:text-slate-400">
            <p>Loading claims...</p>
          </div>
        }>
          <LiveClaims />
        </Suspense>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-600 dark:text-slate-400 mb-4 md:mb-0">
              © 2025 GetReceipts.org
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500 font-mono">
              {version}
            </div>
          </div>
        </div>
      </footer>
    </div>
    </GlobalErrorBoundary>
  );
}