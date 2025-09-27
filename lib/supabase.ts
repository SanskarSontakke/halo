import { createClient } from '@supabase/supabase-js'

let supabaseClient: any = null

export const supabase = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  
  return supabaseClient
}

// Database types
export interface Question {
  id: string
  question_id: string
  question_text: string
  question_answer: string | null
  default_marks: number
  class: string | null
  topic: string | null
  subject: string | null
  question_type: 'multiple_choice' | 'fill_in_blanks' | 'match_pairs' | 'short_answer'
  options: Record<string, string> | null
  correct_option_id: string | null
  left_items: string[] | null
  right_items: string[] | null
  blanks: string | null
  created_at: string
  updated_at: string
}

export interface QuestionOptions {
  classes: string[]
  subjects: string[]
  topics: string[]
  types: string[]
}
