import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://svodjiuypokuvubwfkom.supabase.co'
// NOTE: Provide your Supabase 'anon' key (API Key) here.
const supabaseAnonKey = 'sb_publishable_CanU4tYA8yh9_9Tbgib4Kw_ecQJtXcp'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
