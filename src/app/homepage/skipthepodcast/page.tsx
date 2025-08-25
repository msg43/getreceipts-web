import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LiveClaims from "@/components/LiveClaims";
import { getVersion } from "@/lib/version";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import { Suspense } from "react";

export default function SkipThePodcastHomepage() {
  const version = getVersion();
  
  return (
    <GlobalErrorBoundary>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-blue-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-blue-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-900 dark:text-white">
                ⏭️ SkipThePodcast.com
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/submit" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-white">
                Submit Claims
              </Link>
              <Link href="https://github.com/msg43/GetReceipts" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-white">
                GitHub
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900 dark:text-white mb-6">
          Skip the 3-Hour Podcast <br />
          <span className="text-blue-600 dark:text-blue-400">Get the Receipts</span>
        </h1>
        <p className="text-xl text-blue-700 dark:text-blue-300 mb-8 max-w-3xl mx-auto">
          Why listen to hours of rambling when you can get straight to the claims, evidence, 
          and expert consensus? Cut through the noise and get to what actually matters.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#latest-claims">See Latest Claims</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/submit">Submit Evidence</Link>
          </Button>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 dark:text-white mb-6">
              The Problem with Podcasts
            </h2>
            <div className="space-y-4 text-blue-700 dark:text-blue-300">
              <p className="flex items-center gap-3">
                <span className="text-red-500">❌</span>
                3+ hours for 10 minutes of actual insights
              </p>
              <p className="flex items-center gap-3">
                <span className="text-red-500">❌</span>
                Claims without sources or verification
              </p>
              <p className="flex items-center gap-3">
                <span className="text-red-500">❌</span>
                No way to fact-check what you just heard
              </p>
              <p className="flex items-center gap-3">
                <span className="text-red-500">❌</span>
                Lost in the host&apos;s personality and tangents
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-900 dark:text-white mb-6">
              The SkipThePodcast Solution
            </h2>
            <div className="space-y-4 text-blue-700 dark:text-blue-300">
              <p className="flex items-center gap-3">
                <span className="text-green-500">✅</span>
                Distilled claims with verified sources
              </p>
              <p className="flex items-center gap-3">
                <span className="text-green-500">✅</span>
                Expert consensus tracking in real-time
              </p>
              <p className="flex items-center gap-3">
                <span className="text-green-500">✅</span>
                Evidence-based disagreement mapping
              </p>
              <p className="flex items-center gap-3">
                <span className="text-green-500">✅</span>
                Skip the fluff, get the substance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-white mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Extract Key Claims
              </CardTitle>
              <CardDescription>
                Pull the actual substantive claims from lengthy content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Whether it&apos;s a 4-hour Joe Rogan episode or a 2-hour academic debate, 
                we extract the verifiable claims that actually matter.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔍 Verify with Sources
              </CardTitle>
              <CardDescription>
                Cross-reference against credible evidence and expert opinions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Every claim gets the receipt treatment - real sources, expert positions, 
                and consensus tracking from people who actually know what they&apos;re talking about.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Track Consensus
              </CardTitle>
              <CardDescription>
                See what experts actually agree or disagree on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Visual consensus meters show you where there's real expert agreement 
                vs. where claims are disputed or lack evidence.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Latest Claims */}
      <section id="latest-claims" className="container mx-auto px-4 py-16 bg-white dark:bg-blue-900 rounded-lg mx-4">
        <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-white mb-8">
          Latest Verified Claims
        </h2>
        <p className="text-center text-blue-600 dark:text-blue-400 mb-8">
          The substance without the 3-hour commitment
        </p>
        <Suspense fallback={
          <div className="text-center text-blue-600 dark:text-blue-400">
            <p>Loading claims...</p>
          </div>
        }>
          <LiveClaims />
        </Suspense>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-blue-900 dark:text-white mb-6">
          Ready to Skip the Fluff?
        </h2>
        <p className="text-xl text-blue-700 dark:text-blue-300 mb-8">
          Join thousands who&apos;ve discovered they can get better insights in 5 minutes 
          than from hours of unfocused rambling.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/submit">Submit Claims from Your Favorite Podcast</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="mailto:hello@skipthepodcast.com">Request a Podcast Analysis</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-blue-900 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-blue-600 dark:text-blue-400 mb-4 md:mb-0">
              © 2025 SkipThePodcast.com - Powered by GetReceipts
            </div>
            <div className="text-xs text-blue-500 dark:text-blue-500 font-mono">
              {version}
            </div>
          </div>
        </div>
      </footer>
    </div>
    </GlobalErrorBoundary>
  );
}
