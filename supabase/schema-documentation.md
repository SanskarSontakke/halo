# Project Halo - Questions Database Schema Documentation

## Overview
This document describes the complete database schema for the Project Halo Exam Generator questions system. The schema is designed to support multiple question types with flexible data structures.

## Database Table: `questions`

### Table Structure

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for each record |
| `question_id` | TEXT | UNIQUE, NOT NULL | Human-readable question identifier (e.g., 'q1', 'q2') |
| `question_text` | TEXT | NOT NULL | The main question text/content |
| `question_answer` | TEXT | NULL | The correct answer or answer key |
| `default_marks` | INTEGER | DEFAULT 1 | Points awarded for correct answer |
| `class` | TEXT | NULL | Grade/class level (e.g., '6th Grade', '10th Grade') |
| `topic` | TEXT | NULL | Subject topic (e.g., 'Algebra', 'Biology') |
| `subject` | TEXT | NULL | Subject area (e.g., 'Mathematics', 'Science') |
| `question_type` | TEXT | NOT NULL, CHECK constraint | Type of question (see Question Types below) |
| `options` | JSONB | NULL | Multiple choice options (JSON object) |
| `correct_option_id` | TEXT | NULL | Correct option identifier (A, B, C, D) |
| `left_items` | TEXT[] | NULL | Left side items for match pairs |
| `right_items` | TEXT[] | NULL | Right side items for match pairs |
| `blanks` | TEXT | NULL | Text with blanks for fill-in-the-blanks |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record last update timestamp |

## Question Types

### 1. Multiple Choice (`multiple_choice`)
- **Description**: Questions with predefined answer options
- **Required Fields**: `question_text`, `options`, `correct_option_id`, `question_answer`
- **Optional Fields**: `class`, `topic`, `subject`, `default_marks`
- **Example**:
  ```json
  {
    "question_text": "What is the capital of France?",
    "options": {"A": "Paris", "B": "London", "C": "Berlin", "D": "Madrid"},
    "correct_option_id": "A",
    "question_answer": "A"
  }
  ```

### 2. Fill in the Blanks (`fill_in_blanks`)
- **Description**: Questions where students fill in missing words
- **Required Fields**: `question_text`, `question_answer`, `blanks`
- **Optional Fields**: `class`, `topic`, `subject`, `default_marks`
- **Example**:
  ```json
  {
    "question_text": "Photosynthesis occurs in the ____ of plant cells.",
    "question_answer": "chloroplasts",
    "blanks": "Photosynthesis occurs in the ___ of plant cells."
  }
  ```

### 3. Match the Pairs (`match_pairs`)
- **Description**: Questions where students match items from two lists
- **Required Fields**: `question_text`, `left_items`, `right_items`, `question_answer`
- **Optional Fields**: `class`, `topic`, `subject`, `default_marks`
- **Example**:
  ```json
  {
    "question_text": "Match the chemical formulas with their names",
    "left_items": ["H2O", "NaCl", "CO2"],
    "right_items": ["Water", "Salt", "Carbon Dioxide"],
    "question_answer": "A-1, B-2, C-3"
  }
  ```

### 4. Short Answer (`short_answer`)
- **Description**: Open-ended questions requiring written responses
- **Required Fields**: `question_text`, `question_answer`
- **Optional Fields**: `class`, `topic`, `subject`, `default_marks`
- **Example**:
  ```json
  {
    "question_text": "Explain the water cycle in your own words.",
    "question_answer": "The water cycle is the continuous movement of water through evaporation, condensation, and precipitation."
  }
  ```

### 5. Long Answer Type (`long_answer`)
- **Description**: Extended open-ended questions requiring detailed written responses
- **Required Fields**: `question_text`, `question_answer`
- **Optional Fields**: `class`, `topic`, `subject`, `default_marks`
- **Example**:
  ```json
  {
    "question_text": "Discuss the causes and effects of climate change in detail.",
    "question_answer": "Climate change is caused by greenhouse gas emissions, deforestation, and industrial activities. Effects include rising temperatures, sea level rise, and extreme weather events."
  }
  ```

### 6. Write Reasons for the Following (`write_reasons`)
- **Description**: Questions asking students to provide reasons or explanations for given statements
- **Required Fields**: `question_text`, `question_answer`
- **Optional Fields**: `class`, `topic`, `subject`, `default_marks`
- **Example**:
  ```json
  {
    "question_text": "Write reasons for the following: Why is photosynthesis important for life on Earth?",
    "question_answer": "Photosynthesis is important because it produces oxygen, removes carbon dioxide, and provides food for the food chain."
  }
  ```

## Database Indexes

The following indexes are created for optimal query performance:

1. **`idx_questions_class`** - Index on `class` column
2. **`idx_questions_subject`** - Index on `subject` column
3. **`idx_questions_topic`** - Index on `topic` column
4. **`idx_questions_type`** - Index on `question_type` column
5. **`idx_questions_question_id`** - Index on `question_id` column

## Row Level Security (RLS)

- **Status**: Enabled
- **Policy**: "Allow all operations for all users"
- **Description**: Currently allows all operations for all users. Can be modified for authentication-based access control.

## Triggers

### Auto-Update Timestamp Trigger
- **Function**: `update_updated_at_column()`
- **Trigger**: `update_questions_updated_at`
- **Description**: Automatically updates the `updated_at` column whenever a record is modified

## Data Validation Rules

### Check Constraints
- **`question_type`**: Must be one of: 'multiple_choice', 'fill_in_blanks', 'match_pairs', 'short_answer'

### Required Fields by Question Type
- **All types**: `question_id`, `question_text`, `question_type`
- **Multiple Choice**: `options`, `correct_option_id`
- **Fill in Blanks**: `question_answer`, `blanks`
- **Match Pairs**: `left_items`, `right_items`
- **Short Answer**: `question_answer`

## Sample Data Structure

### Multiple Choice Example
```json
{
  "question_id": "q1",
  "question_text": "What is the value of x in the equation 2x + 5 = 15?",
  "question_answer": "A",
  "default_marks": 2,
  "class": "10th Grade",
  "topic": "Algebra",
  "subject": "Mathematics",
  "question_type": "multiple_choice",
  "options": {"A": "5", "B": "10", "C": "7.5", "D": "15"},
  "correct_option_id": "A"
}
```

### Fill in Blanks Example
```json
{
  "question_id": "q3",
  "question_text": "Photosynthesis occurs in the ____ of plant cells.",
  "question_answer": "chloroplasts",
  "default_marks": 1,
  "class": "7th Grade",
  "topic": "Biology",
  "subject": "Science",
  "question_type": "fill_in_blanks",
  "blanks": "Photosynthesis occurs in the ___ of plant cells."
}
```

### Match Pairs Example
```json
{
  "question_id": "q4",
  "question_text": "Match the chemical formulas with their names",
  "question_answer": "A-1, B-2, C-3, D-4",
  "default_marks": 2,
  "class": "7th Grade",
  "topic": "Chemistry Basics",
  "subject": "Science",
  "question_type": "match_pairs",
  "left_items": ["H2O", "NaCl", "CO2", "O2"],
  "right_items": ["Water", "Common salt", "Carbon dioxide", "Oxygen"]
}
```

### Short Answer Example
```json
{
  "question_id": "q5",
  "question_text": "Define photosynthesis in one or two lines.",
  "question_answer": "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen.",
  "default_marks": 2,
  "class": "7th Grade",
  "topic": "Biology",
  "subject": "Science",
  "question_type": "short_answer"
}
```

## Import Guidelines

### CSV Import
- Use the provided CSV file with proper column headers
- Ensure question_id values are unique
- For JSONB fields (options), use proper JSON format
- For array fields (left_items, right_items), use comma-separated values

### JSON Import
- Use the provided JSON file structure
- Each question should be a separate object in the array
- Ensure all required fields are present for each question type
- Validate JSON syntax before importing

## Query Examples

### Get all questions by subject
```sql
SELECT * FROM questions WHERE subject = 'Mathematics';
```

### Get questions by type and class
```sql
SELECT * FROM questions 
WHERE question_type = 'multiple_choice' 
AND class = '10th Grade';
```

### Get questions with specific topics
```sql
SELECT * FROM questions 
WHERE topic IN ('Algebra', 'Geometry') 
ORDER BY created_at DESC;
```

### Count questions by type
```sql
SELECT question_type, COUNT(*) as count 
FROM questions 
GROUP BY question_type;
```

## Maintenance Notes

- The `updated_at` column is automatically maintained by triggers
- Use the `question_id` field for human-readable references
- The `id` field is the primary key and should not be modified
- Consider archiving old questions instead of deleting them
- Regular backup of the questions table is recommended
