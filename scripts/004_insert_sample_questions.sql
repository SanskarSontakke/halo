-- Insert sample questions for testing
INSERT INTO questions (
  question_text,
  question_type,
  subject,
  topic,
  class_level,
  difficulty_level,
  marks,
  options,
  correct_answer,
  explanation
) VALUES 
-- Mathematics Questions
(
  'What is the value of x in the equation 2x + 5 = 15?',
  'multiple_choice',
  'Mathematics',
  'Algebra',
  '10',
  'medium',
  2,
  '["5", "10", "7", "3"]'::jsonb,
  '5',
  'Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5'
),
(
  'Calculate the area of a circle with radius 7 cm. (Use π = 22/7)',
  'multiple_choice',
  'Mathematics',
  'Geometry',
  '10',
  'medium',
  3,
  '["154 cm²", "144 cm²", "164 cm²", "174 cm²"]'::jsonb,
  '154 cm²',
  'Area = πr² = (22/7) × 7² = (22/7) × 49 = 154 cm²'
),
(
  'Solve for y: 3y - 12 = 21',
  'short_answer',
  'Mathematics',
  'Algebra',
  '9',
  'easy',
  2,
  null,
  '11',
  'Add 12 to both sides: 3y = 33, then divide by 3: y = 11'
),
(
  'Find the perimeter of a rectangle with length 12 cm and width 8 cm.',
  'multiple_choice',
  'Mathematics',
  'Geometry',
  '8',
  'easy',
  2,
  '["40 cm", "20 cm", "96 cm", "32 cm"]'::jsonb,
  '40 cm',
  'Perimeter = 2(length + width) = 2(12 + 8) = 2(20) = 40 cm'
),

-- Science Questions
(
  'What is the chemical formula for water?',
  'multiple_choice',
  'Science',
  'Chemistry',
  '9',
  'easy',
  1,
  '["H2O", "CO2", "NaCl", "O2"]'::jsonb,
  'H2O',
  'Water consists of two hydrogen atoms and one oxygen atom'
),
(
  'Which planet is known as the Red Planet?',
  'multiple_choice',
  'Science',
  'Astronomy',
  '8',
  'easy',
  1,
  '["Venus", "Mars", "Jupiter", "Saturn"]'::jsonb,
  'Mars',
  'Mars appears red due to iron oxide (rust) on its surface'
),
(
  'Explain the process of photosynthesis in plants.',
  'essay',
  'Science',
  'Biology',
  '10',
  'medium',
  5,
  null,
  'Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen using chlorophyll.',
  'Key points: sunlight energy, chlorophyll, CO2 + H2O → glucose + O2, occurs in chloroplasts'
),

-- English Questions
(
  'Identify the noun in the sentence: "The quick brown fox jumps over the lazy dog."',
  'multiple_choice',
  'English',
  'Grammar',
  '7',
  'easy',
  1,
  '["quick", "fox", "jumps", "over"]'::jsonb,
  'fox',
  'A noun is a person, place, thing, or idea. "Fox" and "dog" are both nouns in this sentence.'
),
(
  'What is the past tense of the verb "run"?',
  'short_answer',
  'English',
  'Grammar',
  '6',
  'easy',
  1,
  null,
  'ran',
  'The past tense of "run" is "ran"'
),

-- History Questions
(
  'In which year did World War II end?',
  'multiple_choice',
  'History',
  'World Wars',
  '10',
  'medium',
  2,
  '["1944", "1945", "1946", "1947"]'::jsonb,
  '1945',
  'World War II ended in 1945 with the surrender of Japan in September'
);
