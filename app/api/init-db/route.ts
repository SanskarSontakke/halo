import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
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
        options: { A: 'H2O', 'B': 'CO2', 'C': 'NaCl', 'D': 'O2' },
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
        question_text: 'Match the chemical formulas with their names',
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
        question_text: 'Match the planets with their characteristics',
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
      },
      {
        question_id: 'q11',
        question_text: 'Discuss the causes and effects of climate change in detail. Include at least three causes and three effects.',
        question_answer: 'Causes: Greenhouse gas emissions from burning fossil fuels, deforestation reducing carbon absorption, and industrial activities releasing pollutants. Effects: Rising global temperatures, sea level rise due to ice melting, and increased frequency of extreme weather events like hurricanes and droughts.',
        default_marks: 5,
        class: '10th Grade',
        topic: 'Environment',
        subject: 'Science',
        question_type: 'long_answer',
      },
      {
        question_id: 'q12',
        question_text: 'Write reasons for the following: Why is photosynthesis important for life on Earth?',
        question_answer: 'Photosynthesis is important because: 1) It produces oxygen that all living organisms need to breathe, 2) It removes carbon dioxide from the atmosphere, helping to regulate climate, 3) It provides food for the entire food chain as plants are primary producers, 4) It converts solar energy into chemical energy that sustains life.',
        default_marks: 4,
        class: '8th Grade',
        topic: 'Biology',
        subject: 'Science',
        question_type: 'write_reasons',
      },
      {
        question_id: 'q13',
        question_text: 'Analyze the impact of the Industrial Revolution on society and the environment. Provide a comprehensive discussion.',
        question_answer: 'The Industrial Revolution had profound impacts: Social changes included urbanization, improved living standards for some, but also poor working conditions and child labor. Economic impacts were increased production, new job opportunities, and economic growth. Environmental impacts included air and water pollution, deforestation, and the beginning of climate change due to increased fossil fuel use.',
        default_marks: 6,
        class: '9th Grade',
        topic: 'History',
        subject: 'Social Studies',
        question_type: 'long_answer',
      },
      {
        question_id: 'q14',
        question_text: 'Write reasons for the following: Why do we need to conserve water?',
        question_answer: 'We need to conserve water because: 1) Fresh water is a limited resource with only 3% of Earth\'s water being fresh, 2) Growing population increases demand for water, 3) Water is essential for all life forms and ecosystems, 4) Water conservation helps prevent droughts and water shortages, 5) It reduces energy costs for water treatment and distribution.',
        default_marks: 3,
        class: '7th Grade',
        topic: 'Environment',
        subject: 'Science',
        question_type: 'write_reasons',
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
      return NextResponse.json({ error: 'Failed to insert sample questions' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Database initialized successfully with Supabase',
      questionsCount: sampleQuestions.length,
      data
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({ error: 'Database initialization failed' }, { status: 500 })
  }
}