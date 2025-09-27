-- Supabase Schema for Project Halo Exam Generator
-- Run this SQL in your Supabase SQL Editor

-- Create the questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id TEXT UNIQUE NOT NULL,
    question_text TEXT NOT NULL,
    question_answer TEXT,
    default_marks INTEGER DEFAULT 1,
    class TEXT,
    topic TEXT,
    subject TEXT,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'fill_in_blanks', 'match_pairs', 'short_answer')),
    options JSONB,
    correct_option_id TEXT,
    left_items TEXT[],
    right_items TEXT[],
    blanks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_class ON questions(class);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_question_id ON questions(question_id);

-- Enable Row Level Security (RLS)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- For public access, you can use this policy:
CREATE POLICY "Allow all operations for all users" ON questions
    FOR ALL USING (true);

-- Insert sample questions
INSERT INTO questions (
    question_id, question_text, question_answer, default_marks, 
    class, topic, subject, question_type, options, correct_option_id
) VALUES 
(
    'q1',
    'What is the value of x in the equation 2x + 5 = 15?',
    'A',
    2,
    '10th Grade',
    'Algebra',
    'Mathematics',
    'multiple_choice',
    '{"A": "5", "B": "10", "C": "7.5", "D": "15"}',
    'A'
),
(
    'q2',
    'What is the chemical formula for water?',
    'A',
    1,
    '8th Grade',
    'Chemistry',
    'Science',
    'multiple_choice',
    '{"A": "H2O", "B": "CO2", "C": "NaCl", "D": "O2"}',
    'A'
),
(
    'q3',
    'Photosynthesis occurs in the ____ of plant cells.',
    'chloroplasts',
    1,
    '7th Grade',
    'Biology',
    'Science',
    'fill_in_blanks',
    NULL,
    NULL
),
(
    'q4',
    'Match the pairs',
    'A-1, B-2, C-3, D-4',
    2,
    '7th Grade',
    'Chemistry Basics',
    'Science',
    'match_pairs',
    NULL,
    NULL
),
(
    'q5',
    'Define photosynthesis in one or two lines.',
    'Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen.',
    2,
    '7th Grade',
    'Biology',
    'Science',
    'short_answer',
    NULL,
    NULL
),
(
    'q6',
    'Explain the water cycle briefly.',
    'The water cycle is the continuous movement of water through evaporation, condensation, and precipitation.',
    3,
    '7th Grade',
    'Environment',
    'Science',
    'short_answer',
    NULL,
    NULL
),
(
    'q7',
    'Match the pairs',
    'A-1, B-2, C-3, D-4, E-5',
    2,
    '7th Grade',
    'Planets',
    'Science',
    'match_pairs',
    NULL,
    NULL
),
(
    'q8',
    'What is the capital of France?',
    'A',
    1,
    '6th Grade',
    'Geography',
    'Social Studies',
    'multiple_choice',
    '{"A": "Paris", "B": "London", "C": "Berlin", "D": "Madrid"}',
    'A'
),
(
    'q9',
    'The Great Wall of China is located in ____.',
    'China',
    1,
    '6th Grade',
    'World History',
    'Social Studies',
    'fill_in_blanks',
    NULL,
    NULL
),
(
    'q10',
    'Match the countries with their capitals',
    'A-1, B-2, C-3, D-4',
    2,
    '6th Grade',
    'Geography',
    'Social Studies',
    'match_pairs',
    NULL,
    NULL
)
ON CONFLICT (question_id) DO NOTHING;

-- Update match pairs questions with their items
UPDATE questions 
SET left_items = ARRAY['H2O', 'NaCl', 'CO2', 'O2'],
    right_items = ARRAY['Water', 'Common salt', 'Carbon dioxide', 'Oxygen']
WHERE question_id = 'q4';

UPDATE questions 
SET left_items = ARRAY['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
    right_items = ARRAY['Smallest Planet', 'Morning Star', 'Blue Planet', 'Red Planet', 'Largest Planet']
WHERE question_id = 'q7';

UPDATE questions 
SET left_items = ARRAY['France', 'Germany', 'Spain', 'Italy'],
    right_items = ARRAY['Paris', 'Berlin', 'Madrid', 'Rome']
WHERE question_id = 'q10';

-- Update fill in blanks questions with their blanks
UPDATE questions 
SET blanks = 'Photosynthesis occurs in the ___ of plant cells.'
WHERE question_id = 'q3';

UPDATE questions 
SET blanks = 'The Great Wall of China is located in ___.'
WHERE question_id = 'q9';

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_questions_updated_at 
    BEFORE UPDATE ON questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy querying with all question types
CREATE OR REPLACE VIEW questions_view AS
SELECT 
    id,
    question_id,
    question_text,
    question_answer,
    default_marks,
    class,
    topic,
    subject,
    question_type,
    options,
    correct_option_id,
    left_items,
    right_items,
    blanks,
    created_at,
    updated_at
FROM questions
ORDER BY created_at DESC;
