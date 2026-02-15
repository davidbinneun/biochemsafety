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

// Profile helpers
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// Services CRUD
export const createService = async (serviceData) => {
  const { data, error } = await supabase
    .from('services')
    .insert(serviceData)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateService = async (id, serviceData) => {
  const { data, error } = await supabase
    .from('services')
    .update(serviceData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteService = async (id) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Content Blocks CRUD
export const getAllContentBlocks = async () => {
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .order('order')

  if (error) throw error
  return data
}

export const createContentBlock = async (blockData) => {
  const { data, error } = await supabase
    .from('content_blocks')
    .insert(blockData)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateContentBlock = async (id, blockData) => {
  const { data, error } = await supabase
    .from('content_blocks')
    .update(blockData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteContentBlock = async (id) => {
  const { error } = await supabase
    .from('content_blocks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// File upload to Supabase Storage
const STORAGE_BUCKET = 'biochemsafety'

export const uploadFile = async (file) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file)

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath)

  return urlData.publicUrl
}
