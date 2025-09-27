import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Fetch all questions from Supabase
    const { data: questions, error } = await supabase()
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }

    // Extract unique values for filters
    const classes = [...new Set(questions?.map(q => q.class).filter(Boolean) || [])]
    const subjects = [...new Set(questions?.map(q => q.subject).filter(Boolean) || [])]
    const topics = [...new Set(questions?.map(q => q.topic).filter(Boolean) || [])]
    const types = [...new Set(questions?.map(q => q.question_type).filter(Boolean) || [])]
    
    const options = { 
      classes: classes as string[], 
      subjects: subjects as string[], 
      topics: topics as string[], 
      types: types as string[] 
    }
    
    return NextResponse.json({
      questions: questions || [],
      options
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
