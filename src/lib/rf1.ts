import { z } from "zod";

export const SourceSchema = z.object({
  type: z.enum(["paper","article","video","org","book","report"]).default("article"),
  title: z.string().optional(),
  url: z.string().url().optional(),
  doi: z.string().optional(),
  venue: z.string().optional(),
  date: z.string().optional(),
});

// Knowledge artifact schemas for Knowledge_Chipper integration
export const PersonSchema = z.object({
  name: z.string(),
  bio: z.string().optional(),
  expertise: z.array(z.string()).default([]),
  credibility_score: z.number().min(0).max(1).optional(),
  sources: z.array(z.string()).default([])
});

export const JargonSchema = z.object({
  term: z.string(),
  definition: z.string(),
  domain: z.string().optional(),
  related_terms: z.array(z.string()).default([]),
  examples: z.array(z.string()).default([])
});

export const MentalModelSchema = z.object({
  name: z.string(),
  description: z.string(),
  domain: z.string().optional(),
  key_concepts: z.array(z.string()).default([]),
  relationships: z.array(z.object({
    from: z.string(),
    to: z.string(),
    type: z.enum(["causes", "enables", "requires", "conflicts_with"])
  })).default([])
});

export const ClaimRelationshipSchema = z.object({
  related_claim_id: z.string(),
  relationship_type: z.enum(["supports", "contradicts", "extends", "contextualizes"]),
  strength: z.number().min(0).max(1).default(0.5),
  evidence: z.string().optional()
});

export const ReceiptSchema = z.object({
  claim_text: z.string().min(8),
  claim_long: z.string().optional(),
  topics: z.array(z.string()).default([]),
  supporters: z.array(z.string()).default([]),
  opponents: z.array(z.string()).default([]),
  sources: z.array(SourceSchema).default([]),
  factions: z.array(z.string()).default([]),
  provenance: z.object({
    producer_app: z.string().optional(),
    version: z.string().optional(),
    session_id: z.string().optional(),
  }).optional(),
  // Enhanced schema for Knowledge_Chipper artifacts
  knowledge_artifacts: z.object({
    people: z.array(PersonSchema).default([]),
    jargon: z.array(JargonSchema).default([]),
    mental_models: z.array(MentalModelSchema).default([]),
    claim_relationships: z.array(ClaimRelationshipSchema).default([])
  }).optional()
});

export type Receipt = z.infer<typeof ReceiptSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Jargon = z.infer<typeof JargonSchema>;
export type MentalModel = z.infer<typeof MentalModelSchema>;
export type ClaimRelationship = z.infer<typeof ClaimRelationshipSchema>;