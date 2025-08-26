// layout.tsx - Root layout

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Claims Graph Explorer - Skip the Podcast',
  description: 'Explore the relationships between claims in an interactive graph visualization',
  keywords: 'claims, graph, visualization, knowledge, relationships',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}