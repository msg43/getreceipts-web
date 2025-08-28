import { NextResponse } from "next/server";

export async function GET() {
  // Mock data with people and episode information
  const mockNodes = [
    {
      id: "1",
      slug: "ai-consciousness-test", 
      label: "AI systems will achieve consciousness by 2050",
      title: "AI systems will achieve consciousness by 2050",
      content: "Advanced neural networks show emergent properties suggesting consciousness",
      text: "AI systems will achieve consciousness by 2050",
      topics: ["AI", "consciousness", "future"],
      consensus: 0.7,
      size: 30,
      people: ["Dr. Elena Vasquez", "Prof. Marcus Chen"],
      episode: "The Future of AI Consciousness", 
      episodeSlug: "future-ai-consciousness",
      type: "claim",
      color: "#3B82F6",
      community: 1,
      tags: ["AI", "consciousness", "future"],
      metadata: {
        people: ["Dr. Elena Vasquez", "Prof. Marcus Chen"],
        episode: "The Future of AI Consciousness",
        episodeSlug: "future-ai-consciousness"
      },
      createdAt: new Date().toISOString()
    },
    {
      id: "2", 
      slug: "quantum-computing-test",
      label: "Quantum computing will break current encryption",
      title: "Quantum computing will break current encryption", 
      content: "RSA and similar encryption methods vulnerable to quantum attacks",
      text: "Quantum computing will break current encryption",
      topics: ["quantum", "security"],
      consensus: 0.8,
      size: 25,
      people: ["Dr. Sarah Kim", "Prof. Alex Rodriguez"],
      episode: "Quantum Computing Revolution",
      episodeSlug: "quantum-computing-revolution", 
      type: "claim",
      color: "#10B981",
      community: 2,
      tags: ["quantum", "security"],
      metadata: {
        people: ["Dr. Sarah Kim", "Prof. Alex Rodriguez"],
        episode: "Quantum Computing Revolution", 
        episodeSlug: "quantum-computing-revolution"
      },
      createdAt: new Date().toISOString()
    }
  ];

  const mockEdges = [
    {
      source: "1",
      target: "2", 
      type: "supports",
      strength: 0.6
    }
  ];

  return NextResponse.json({
    nodes: mockNodes,
    edges: mockEdges,
    clusters: [],
    metadata: {
      total_claims: mockNodes.length,
      total_relationships: mockEdges.length,
      relationship_types: ["supports"]
    }
  });
}
