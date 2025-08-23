import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper functions for database operations
export async function getClaimBySlug(slug: string) {
  console.log('Fetching claim by slug:', slug)
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('slug', slug)
    .single()
  
  console.log('Supabase response:', { data, error })
  if (error) {
    console.error('Supabase error:', error)
    throw error
  }
  return data
}

export async function getAggregateByClaimId(claimId: string) {
  const { data, error } = await supabase
    .from('aggregates')
    .select('*')
    .eq('claim_id', claimId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
  return data
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

export async function getAllClaims() {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// Knowledge artifact functions
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

export async function getVotesByClaimId(claimId: string) {
  // For demo purposes, return mock data
  // In production, this would query the votes table
  return {
    upvotes: Math.floor(Math.random() * 50) + 10,
    downvotes: Math.floor(Math.random() * 20) + 2,
    credible: Math.floor(Math.random() * 30) + 5,
    not_credible: Math.floor(Math.random() * 15) + 1
  }
}

export async function getCommentsByClaimId(claimId: string) {
  // For demo purposes, return mock data
  // In production, this would query the comments table
  return [
    {
      id: 'demo-comment-1',
      content: 'This is a really interesting claim. I would like to see more evidence supporting this position.',
      author: 'Research Analyst',
      voteScore: 5,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-comment-2',
      content: 'The methodology described here seems sound, but I wonder about the sample size limitations.',
      author: 'Data Scientist',
      voteScore: 3,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    }
  ]
}
