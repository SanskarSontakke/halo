# Supabase Data Import Guide

## Files Created

1. **`schema-documentation.md`** - Complete database schema documentation
2. **`sample-questions.csv`** - CSV format with 20 sample questions
3. **`sample-questions.json`** - JSON format with 20 sample questions

## How to Import Data into Supabase

### Method 1: Using Supabase Dashboard (Recommended)

#### For CSV Import:
1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **questions** table
3. Click the **Import** button (or **Insert** → **Import data from CSV**)
4. Upload the `sample-questions.csv` file
5. Map the columns correctly (they should auto-map)
6. Click **Import**

#### For JSON Import:
1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **questions** table
3. Click **Insert** → **Insert row**
4. For each question in the JSON file, manually add the data
5. Or use the **SQL Editor** with INSERT statements

### Method 2: Using SQL Editor

#### Import via SQL INSERT statements:
```sql
-- Copy and paste this into your Supabase SQL Editor
INSERT INTO questions (question_id, question_text, question_answer, default_marks, class, topic, subject, question_type, options, correct_option_id, left_items, right_items, blanks) VALUES
('q1', 'What is the value of x in the equation 2x + 5 = 15?', 'A', 2, '10th Grade', 'Algebra', 'Mathematics', 'multiple_choice', '{"A": "5", "B": "10", "C": "7.5", "D": "15"}', 'A', NULL, NULL, NULL),
('q2', 'What is the chemical formula for water?', 'A', 1, '8th Grade', 'Chemistry', 'Science', 'multiple_choice', '{"A": "H2O", "B": "CO2", "C": "NaCl", "D": "O2"}', 'A', NULL, NULL, NULL),
('q3', 'Photosynthesis occurs in the ____ of plant cells.', 'chloroplasts', 1, '7th Grade', 'Biology', 'Science', 'fill_in_blanks', NULL, NULL, NULL, NULL, 'Photosynthesis occurs in the ___ of plant cells.'),
-- ... (continue with all 20 questions)
```

### Method 3: Using Supabase API

#### Import via REST API:
```bash
# Example using curl
curl -X POST 'https://your-project-ref.supabase.co/rest/v1/questions' \
-H "apikey: your-anon-key" \
-H "Authorization: Bearer your-anon-key" \
-H "Content-Type: application/json" \
-d @sample-questions.json
```

## Data Structure Overview

### Question Types Included:
- **Multiple Choice**: 8 questions (q1, q2, q8, q11, q15, q19)
- **Fill in Blanks**: 4 questions (q3, q9, q12, q16, q20)
- **Match Pairs**: 4 questions (q4, q7, q10, q13, q17)
- **Short Answer**: 4 questions (q5, q6, q14, q18)

### Subjects Covered:
- **Mathematics**: 3 questions (Algebra, Arithmetic, Basic Math)
- **Science**: 12 questions (Chemistry, Biology, Physics, Astronomy, etc.)
- **Social Studies**: 3 questions (Geography, World History)
- **Technology**: 1 question (Computer Science)

### Grade Levels:
- **6th Grade**: 5 questions
- **7th Grade**: 4 questions
- **8th Grade**: 4 questions
- **9th Grade**: 2 questions
- **10th Grade**: 4 questions

## Verification

After importing, verify the data by running:

```sql
-- Check total count
SELECT COUNT(*) FROM questions;

-- Check by question type
SELECT question_type, COUNT(*) as count 
FROM questions 
GROUP BY question_type;

-- Check by subject
SELECT subject, COUNT(*) as count 
FROM questions 
GROUP BY subject;

-- Check by class
SELECT class, COUNT(*) as count 
FROM questions 
GROUP BY class;
```

## Customization

You can modify the sample data by:
1. Editing the CSV/JSON files
2. Adding more questions following the same structure
3. Changing question types, subjects, or difficulty levels
4. Adding your own question content

## Troubleshooting

### Common Issues:
1. **CSV Import Errors**: Ensure proper escaping of quotes and commas
2. **JSON Import Errors**: Validate JSON syntax before importing
3. **Constraint Violations**: Check that question_id values are unique
4. **Data Type Mismatches**: Ensure arrays are properly formatted

### Tips:
- Always backup your data before importing
- Test with a small subset first
- Use the SQL Editor for complex data validation
- Check the Table Editor to verify data after import
