import { z } from "zod";

export const SourceSchema = z.object({
  type: z.enum(["paper","article","video","org","book","report"]).default("article"),
  title: z.string().optional(),
  url: z.string().url().optional(),
  doi: z.string().optional(),
  venue: z.string().optional(),
  date: z.string().optional(),
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
  }).optional()
});

export type Receipt = z.infer<typeof ReceiptSchema>;