/**
 * Analytics and tracking utilities
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

// Google Analytics (optional)
export function trackEvent(eventName: string, parameters?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}

// Plausible Analytics (privacy-focused alternative)
export function trackPlausibleEvent(eventName: string, props?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props });
  }
}

// Combined tracking function
export function track(eventName: string, properties?: Record<string, unknown>) {
  // Track with both services if available
  trackEvent(eventName, properties);
  trackPlausibleEvent(eventName, properties);
}

// Specific event trackers
export const analytics = {
  // Receipt submission
  receiptSubmitted: (claimId: string, sourceCount: number) => {
    track('receipt_submitted', {
      claim_id: claimId,
      source_count: sourceCount,
    });
  },

  // Badge generation
  badgeGenerated: (slug: string, consensusScore: number) => {
    track('badge_generated', {
      slug,
      consensus_score: consensusScore,
    });
  },

  // Claim viewing
  claimViewed: (slug: string, consensusScore?: number) => {
    track('claim_viewed', {
      slug,
      consensus_score: consensusScore,
    });
  },

  // Snippet copying
  snippetCopied: (slug: string, platform?: string) => {
    track('snippet_copied', {
      slug,
      platform,
    });
  },

  // Embed viewing
  embedViewed: (slug: string) => {
    track('embed_viewed', {
      slug,
    });
  },

  // API usage
  apiCall: (endpoint: string, method: string, statusCode: number) => {
    track('api_call', {
      endpoint,
      method,
      status_code: statusCode,
    });
  },
};

// UTM parameter builder for sharing
export function buildUTMUrl(baseUrl: string, source: string, medium: string, campaign: string = 'share') {
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}

// Platform-specific sharing URLs
export function buildSharingUrls(claimUrl: string, text: string) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(claimUrl);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
  };
}
