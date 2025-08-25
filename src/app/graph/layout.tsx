// layout.tsx - Graph route layout

import type { Metadata } from 'next';
import './graph.module.css';

export const metadata: Metadata = {
  title: 'Claims Graph Explorer - Skip the Podcast',
  description: 'Explore the relationships between claims in an interactive graph visualization',
  keywords: 'claims, graph, visualization, knowledge, relationships, skipthepodcast',
};

export default function GraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
