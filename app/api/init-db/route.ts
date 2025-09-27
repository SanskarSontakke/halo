import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Sample questions data
    const sampleQuestions = [
      {
        question_id: 'q1',
        question_text: 'What is the value of x in the equation 2x + 5 = 15?',
        question_answer: 'A',
        default_marks: 2,
        class: '10th Grade',
        topic: 'Algebra',
        subject: 'Mathematics',
        question_type: 'multiple_choice',
        options: { A: '5', B: '10', C: '7.5', D: '15' },
        correct_option_id: 'A',
      },
      {
        question_id: 'q2',
        question_text: 'What is the chemical formula for water?',
        question_answer: 'A',
        default_marks: 1,
        class: '8th Grade',
        topic: 'Chemistry',
        subject: 'Science',
        question_type: 'multiple_choice',
        options: { A: 'H2O', B: 'CO2', C: 'NaCl', D: 'O2' },
        correct_option_id: 'A',
      },
      {
        question_id: 'q3',
        question_text: 'Photosynthesis occurs in the ____ of plant cells.',
        question_answer: 'chloroplasts',
        default_marks: 1,
        class: '7th Grade',
        topic: 'Biology',
        subject: 'Science',
        question_type: 'fill_in_blanks',
        blanks: 'Photosynthesis occurs in the ___ of plant cells.',
      },
      {
        question_id: 'q4',
        question_text: 'Match the pairs',
        question_answer: 'A-1, B-2, C-3, D-4',
        default_marks: 2,
        class: '7th Grade',
        topic: 'Chemistry Basics',
        subject: 'Science',
        question_type: 'match_pairs',
        left_items: ['H2O', 'NaCl', 'CO2', 'O2'],
        right_items: ['Water', 'Common salt', 'Carbon dioxide', 'Oxygen'],
      },
      {
        question_id: 'q5',
        question_text: 'Define photosynthesis in one or two lines.',
        question_answer: 'Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen.',
        default_marks: 2,
        class: '7th Grade',
        topic: 'Biology',
        subject: 'Science',
        question_type: 'short_answer',
      },
      {
        question_id: 'q6',
        question_text: 'Explain the water cycle briefly.',
        question_answer: 'The water cycle is the continuous movement of water through evaporation, condensation, and precipitation.',
        default_marks: 3,
        class: '7th Grade',
        topic: 'Environment',
        subject: 'Science',
        question_type: 'short_answer',
      },
      {
        question_id: 'q7',
        question_text: 'Match the pairs',
        question_answer: 'A-1, B-2, C-3, D-4, E-5',
        default_marks: 2,
        class: '7th Grade',
        topic: 'Planets',
        subject: 'Science',
        question_type: 'match_pairs',
        left_items: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
        right_items: ['Smallest Planet', 'Morning Star', 'Blue Planet', 'Red Planet', 'Largest Planet'],
      },
      {
        question_id: 'q8',
        question_text: 'What is the capital of France?',
        question_answer: 'A',
        default_marks: 1,
        class: '6th Grade',
        topic: 'Geography',
        subject: 'Social Studies',
        question_type: 'multiple_choice',
        options: { A: 'Paris', 'B': 'London', 'C': 'Berlin', 'D': 'Madrid' },
        correct_option_id: 'A',
      },
      {
        question_id: 'q9',
        question_text: 'The Great Wall of China is located in ____.',
        question_answer: 'China',
        default_marks: 1,
        class: '6th Grade',
        topic: 'World History',
        subject: 'Social Studies',
        question_type: 'fill_in_blanks',
        blanks: 'The Great Wall of China is located in ___.',
      },
      {
        question_id: 'q10',
        question_text: 'Match the countries with their capitals',
        question_answer: 'A-1, B-2, C-3, D-4',
        default_marks: 2,
        class: '6th Grade',
        topic: 'Geography',
        subject: 'Social Studies',
        question_type: 'match_pairs',
        left_items: ['France', 'Germany', 'Spain', 'Italy'],
        right_items: ['Paris', 'Berlin', 'Madrid', 'Rome'],
      }
    ]

    // Insert sample questions into Supabase
    const { data, error } = await supabase
      .from('questions')
      .upsert(sampleQuestions, { 
        onConflict: 'question_id',
        ignoreDuplicates: false 
      })

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: 'Failed to insert sample questions' })
    }

    res.status(200).json({ 
      message: 'Database initialized successfully with Supabase',
      questionsCount: sampleQuestions.length,
      data
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    res.status(500).json({ error: 'Database initialization failed' })
  }
}
