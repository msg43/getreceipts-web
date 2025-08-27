import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getDomainConfig } from "@/lib/domain-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const domainConfig = await getDomainConfig();
  
  return {
    title: domainConfig.title,
    description: domainConfig.description,
    openGraph: {
      title: domainConfig.title,
      description: domainConfig.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: domainConfig.title,
      description: domainConfig.description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Basic mobile optimizations
              if (typeof window !== 'undefined') {
                // Prevent double-tap zoom
                let lastTouchEnd = 0;
                document.addEventListener('touchend', function (event) {
                  const now = (new Date()).getTime();
                  if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                  }
                  lastTouchEnd = now;
                }, false);
                
                // Improve iOS scrolling
                document.body.style.webkitOverflowScrolling = 'touch';
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
