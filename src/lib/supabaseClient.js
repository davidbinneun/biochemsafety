import { createClient } from '@supabase/supabase-js'

const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_SECRET_KEY

if (!supabaseProjectId || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Construct the Supabase URL from the project ID
const supabaseUrl = `https://${supabaseProjectId}.supabase.co`

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helpers
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Data fetching helpers
export const getServices = async (orderBy = 'order') => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order(orderBy)

  if (error) throw error
  return data
}

export const getServiceBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export const getContentBlocks = async (filters = {}) => {
  let query = supabase.from('content_blocks').select('*')

  if (filters.page) {
    query = query.eq('page', filters.page)
  }
  if (filters.section) {
    query = query.eq('section', filters.section)
  }

  const { data, error } = await query.order('order')

  if (error) throw error
  return data
}
