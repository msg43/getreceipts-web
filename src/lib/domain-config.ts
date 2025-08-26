import { headers } from 'next/headers';

export interface DomainConfig {
  theme: string;
  brand: string;
  primaryColor: string;
  title: string;
  description: string;
}

export const domainConfigs: Record<string, DomainConfig> = {
  'getreceipts.org': {
    theme: 'default',
    brand: 'GetReceipts',
    primaryColor: 'blue',
    title: 'GetReceipts.org - Publish & Share Claim Receipts',
    description: 'A platform for publishing and sharing "receipts" of claims and counterclaims with sources and a Consensus Meter.',
  },
  'www.getreceipts.org': {
    theme: 'default',
    brand: 'GetReceipts', 
    primaryColor: 'blue',
    title: 'GetReceipts.org - Publish & Share Claim Receipts',
    description: 'A platform for publishing and sharing "receipts" of claims and counterclaims with sources and a Consensus Meter.',
  },
  'skipthepodcast.com': {
    theme: 'skipthepodcast',
    brand: 'SkipThePodcast',
    primaryColor: 'blue',
    title: 'SkipThePodcast.com - Get the Receipts Without the Fluff',
    description: 'Skip the 3-hour podcast. Get straight to the claims, evidence, and expert consensus that matter.',
  },
  'www.skipthepodcast.com': {
    theme: 'skipthepodcast',
    brand: 'SkipThePodcast',
    primaryColor: 'blue',
    title: 'SkipThePodcast.com - Get the Receipts Without the Fluff',
    description: 'Skip the 3-hour podcast. Get straight to the claims, evidence, and expert consensus that matter.',
  },
};

export async function getDomainConfig(): Promise<DomainConfig> {
  const headersList = await headers();
  const hostname = headersList.get('x-hostname') || headersList.get('host') || 'getreceipts.org';
  
  return domainConfigs[hostname] || domainConfigs['getreceipts.org'];
}

export async function getBrandingFromHeaders(): Promise<{
  theme: string;
  brand: string;
}> {
  const headersList = await headers();
  
  return {
    theme: headersList.get('x-domain-theme') || 'default',
    brand: headersList.get('x-domain-brand') || 'GetReceipts',
  };
}
