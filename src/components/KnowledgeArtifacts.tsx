'use client';

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Person {
  id: string;
  name: string;
  bio?: string;
  expertise?: string[];
  credibility_score?: number;
  sources?: string[];
}

interface Jargon {
  id: string;
  term: string;
  definition: string;
  domain?: string;
  related_terms?: string[];
  examples?: string[];
}

interface MentalModel {
  id: string;
  name: string;
  description: string;
  domain?: string;
  key_concepts?: string[];
  relationships?: any[];
}

interface KnowledgeArtifactsProps {
  people: Person[];
  jargon: Jargon[];
  models: MentalModel[];
}

export default function KnowledgeArtifacts({ people, jargon, models }: KnowledgeArtifactsProps) {
  // Ensure arrays are defined
  const safePeople = people || [];
  const safeJargon = jargon || [];
  const safeModels = models || [];

  if (!safePeople.length && !safeJargon.length && !safeModels.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧠 Knowledge Artifacts
          <Badge variant="secondary">
            {safePeople.length + safeJargon.length + safeModels.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="people" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="people">
              People ({safePeople.length})
            </TabsTrigger>
            <TabsTrigger value="jargon">
              Jargon ({safeJargon.length})
            </TabsTrigger>
            <TabsTrigger value="models">
              Models ({safeModels.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="people" className="space-y-4">
            {safePeople.map((person) => (
              <div key={person.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{person.name}</h4>
                  {person.credibility_score && (
                    <Badge variant="outline">
                      Credibility: {Math.round(Number(person.credibility_score) * 100)}%
                    </Badge>
                  )}
                </div>
                {person.bio && (
                  <p className="text-sm text-gray-600">{person.bio}</p>
                )}
                {person.expertise && person.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {person.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
                {person.sources && person.sources.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Sources:</span>
                    <div className="text-xs space-y-1">
                      {person.sources.map((source, idx) => (
                        <div key={idx} className="text-gray-600">• {source}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="jargon" className="space-y-4">
            {safeJargon.map((term) => (
              <div key={term.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{term.term}</h4>
                  {term.domain && (
                    <Badge variant="outline">{term.domain}</Badge>
                  )}
                </div>
                <p className="text-sm">{term.definition}</p>
                {term.examples && term.examples.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Examples:</span>
                    <ul className="text-xs space-y-1">
                      {term.examples.map((example, idx) => (
                        <li key={idx} className="text-gray-600">• {example}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {term.related_terms && term.related_terms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs font-medium text-gray-500">Related:</span>
                    {term.related_terms.map((related, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {related}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="models" className="space-y-4">
            {safeModels.map((model) => (
              <div key={model.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{model.name}</h4>
                  {model.domain && (
                    <Badge variant="outline">{model.domain}</Badge>
                  )}
                </div>
                <p className="text-sm">{model.description}</p>
                {model.key_concepts && model.key_concepts.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Key Concepts:</span>
                    <div className="flex flex-wrap gap-1">
                      {model.key_concepts.map((concept, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {model.relationships && Array.isArray(model.relationships) && model.relationships.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Relationships:</span>
                    <div className="text-xs space-y-1">
                      {model.relationships.map((rel: any, idx: number) => (
                        <div key={idx} className="text-gray-600">
                          {rel.from} <span className="text-blue-600">{rel.type}</span> {rel.to}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
