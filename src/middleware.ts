import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Define your domain configurations
  const domainConfigs = {
    'getreceipts.org': { theme: 'default', brand: 'GetReceipts' },
    'www.getreceipts.org': { theme: 'default', brand: 'GetReceipts' },
    'skipthepodcast.com': { theme: 'skipthepodcast', brand: 'SkipThePodcast' },
    'www.skipthepodcast.com': { theme: 'skipthepodcast', brand: 'SkipThePodcast' },
  };

  // Get the domain config or use default
  const domainConfig = domainConfigs[hostname as keyof typeof domainConfigs] || domainConfigs['getreceipts.org'];
  
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Add custom headers for domain identification
  requestHeaders.set('x-domain-theme', domainConfig.theme);
  requestHeaders.set('x-domain-brand', domainConfig.brand);
  requestHeaders.set('x-hostname', hostname);
  
  // Handle root path routing based on domain
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone();
    
    // Route skipthepodcast.com to the graph page
    if (hostname.includes('skipthepodcast.com')) {
      url.pathname = '/graph';
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }
    
    // Route other non-default themes to domain-specific homepage
    if (domainConfig.theme !== 'default' && !hostname.includes('skipthepodcast.com')) {
      url.pathname = `/homepage/${domainConfig.theme}`;
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }
  }
  
  // For all other requests, just pass through with the custom headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
