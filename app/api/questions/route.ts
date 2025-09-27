import { NextApiRequest, NextApiResponse } from 'next'
import { supabase, Question, QuestionOptions } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Fetch all questions from Supabase
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to fetch questions' })
    }

    // Extract unique values for filters
    const classes = [...new Set(questions?.map(q => q.class).filter(Boolean) || [])]
    const subjects = [...new Set(questions?.map(q => q.subject).filter(Boolean) || [])]
    const topics = [...new Set(questions?.map(q => q.topic).filter(Boolean) || [])]
    const types = [...new Set(questions?.map(q => q.question_type).filter(Boolean) || [])]
    
    const options: QuestionOptions = { 
      classes: classes as string[], 
      subjects: subjects as string[], 
      topics: topics as string[], 
      types: types as string[] 
    }
    
    res.status(200).json({
      questions: questions || [],
      options
    })
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
