import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper functions for database operations
export async function getClaimBySlug(slug: string) {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
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
