'use client';

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Person {
  id: string;
  name: string;
  bio?: string;
  expertise: string[];
  credibilityScore?: string;
  sources: string[];
}

interface Jargon {
  id: string;
  term: string;
  definition: string;
  domain?: string;
  relatedTerms: string[];
  examples: string[];
}

interface MentalModel {
  id: string;
  name: string;
  description: string;
  domain?: string;
  keyConcepts: string[];
  relationships: any;
}

interface KnowledgeArtifactsProps {
  people: Person[];
  jargon: Jargon[];
  models: MentalModel[];
}

export default function KnowledgeArtifacts({ people, jargon, models }: KnowledgeArtifactsProps) {
  if (!people.length && !jargon.length && !models.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧠 Knowledge Artifacts
          <Badge variant="secondary">
            {people.length + jargon.length + models.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="people" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="people">
              People ({people.length})
            </TabsTrigger>
            <TabsTrigger value="jargon">
              Jargon ({jargon.length})
            </TabsTrigger>
            <TabsTrigger value="models">
              Models ({models.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="people" className="space-y-4">
            {people.map((person) => (
              <div key={person.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{person.name}</h4>
                  {person.credibilityScore && (
                    <Badge variant="outline">
                      Credibility: {Math.round(Number(person.credibilityScore) * 100)}%
                    </Badge>
                  )}
                </div>
                {person.bio && (
                  <p className="text-sm text-gray-600">{person.bio}</p>
                )}
                {person.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {person.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="jargon" className="space-y-4">
            {jargon.map((term) => (
              <div key={term.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{term.term}</h4>
                  {term.domain && (
                    <Badge variant="outline">{term.domain}</Badge>
                  )}
                </div>
                <p className="text-sm">{term.definition}</p>
                {term.examples.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Examples:</span>
                    <ul className="text-xs space-y-1">
                      {term.examples.map((example, idx) => (
                        <li key={idx} className="text-gray-600">• {example}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {term.relatedTerms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs font-medium text-gray-500">Related:</span>
                    {term.relatedTerms.map((related, idx) => (
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
            {models.map((model) => (
              <div key={model.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{model.name}</h4>
                  {model.domain && (
                    <Badge variant="outline">{model.domain}</Badge>
                  )}
                </div>
                <p className="text-sm">{model.description}</p>
                {model.keyConcepts.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Key Concepts:</span>
                    <div className="flex flex-wrap gap-1">
                      {model.keyConcepts.map((concept, idx) => (
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
