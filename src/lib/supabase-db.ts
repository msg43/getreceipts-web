import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required Supabase environment variables')
  throw new Error('Missing Supabase configuration. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper functions for database operations
export async function getClaimBySlug(slug: string) {
  console.log('Fetching claim by slug:', slug)
  
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data
}

export async function getAggregateByClaimId() {
  // Return null since aggregates table doesn't exist yet
  return null
}

export async function getModelReviewsByClaimId(claimId: string) {
  const { data, error } = await supabase
    .from('model_reviews')
    .select('*')
    .eq('claim_id', claimId)
  
  if (error) throw error
  return data || []
}

export async function getSourcesByClaimId(claimId: string) {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('claim_id', claimId)
  
  if (error) throw error
  return data || []
}

export async function getPositionsByClaimId(claimId: string) {
  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('claim_id', claimId)
  
  if (error) throw error
  return data || []
}

export async function getKnowledgePeopleByClaimId(claimId: string) {
  const { data, error } = await supabase
    .from('knowledge_people')
    .select('*')
    .eq('claim_id', claimId)
  
  if (error) throw error
  return data || []
}

export async function getKnowledgeJargonByClaimId(claimId: string) {
  const { data, error } = await supabase
    .from('knowledge_jargon')
    .select('*')
    .eq('claim_id', claimId)
  
  if (error) throw error
  return data || []
}

export async function getKnowledgeModelsByClaimId(claimId: string) {
  const { data, error } = await supabase
    .from('knowledge_models')
    .select('*')
    .eq('claim_id', claimId)
  
  if (error) throw error
  return data || []
}

export async function getClaimRelationshipsByClaimId(claimId: string) {
  const { data, error } = await supabase
    .from('claim_relationships')
    .select(`
      *,
      to_claim:claims!claim_relationships_to_claim_id_fkey(slug, text_short)
    `)
    .eq('from_claim_id', claimId)
  
  if (error) throw error
  return data || []
}

export async function getVotesByClaimId() {
  // For demo purposes, return mock data
  // In production, this would query the votes table
  return {
    upvotes: Math.floor(Math.random() * 50) + 10,
    downvotes: Math.floor(Math.random() * 20) + 2,
    credible: Math.floor(Math.random() * 30) + 5,
    not_credible: Math.floor(Math.random() * 15) + 1
  }
}

export async function getCommentsByClaimId() {
  // For demo purposes, return mock data
  // In production, this would query the comments table
  return [
    {
      id: '1',
      content: 'This is a sample comment for demonstration purposes.',
      author: 'Demo User',
      voteScore: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2', 
      content: 'Another example comment showing the discussion format.',
      author: 'Another User',
      voteScore: 2,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    }
  ]
}