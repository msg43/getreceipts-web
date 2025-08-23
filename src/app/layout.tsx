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
  const domainConfig = getDomainConfig();
  
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
