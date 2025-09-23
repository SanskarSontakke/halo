# Exam Generator Backend

A Node.js backend API for the Exam Generator application using SQLite database.

## Features

- RESTful API endpoints for questions and filters
- SQLite database with sample questions
- Interdependent filtering system
- Multi-select topic filtering
- CORS enabled for frontend integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Questions
- `GET /api/questions` - Get questions with optional filters
  - Query parameters: `subject`, `topic`, `class`, `question_type`, `search`, `page`, `limit`
  - Example: `/api/questions?subject=Mathematics&class=10th Grade&page=1&limit=10`

### Filter Options
- `GET /api/filter-options` - Get available filter options
  - Query parameters: `subject`, `class` (for interdependent filtering)
  - Example: `/api/filter-options?subject=Science&class=8th Grade`

### Health Check
- `GET /api/health` - Check if the server is running

## Database Schema

### Questions Table
- `id` - Primary key
- `question_id` - Unique question identifier
- `question_text` - The question content
- `question_answer` - Answer to the question
- `default_marks` - Default marks for the question
- `class` - Grade/class level
- `topic` - Subject topic
- `subject` - Subject name
- `question_type` - Type of question (multiple_choice, etc.)
- `options` - JSON string of answer options
- `correct_option_id` - ID of the correct option
- `created_at` - Timestamp

## Sample Data

The database comes pre-populated with sample questions across various subjects:
- Mathematics (Algebra, Arithmetic)
- Science (Chemistry, Biology, Environmental Science, Astronomy)
- History (World Wars)
- Social Studies (Geography)
- English (Literature)

## Interdependent Filtering

The filter system supports interdependent filtering:
- When a subject is selected, topics are filtered to only show topics available for that subject
- When a class is selected, topics are filtered to only show topics available for that class
- When both subject and class are selected, topics are filtered to show topics available for that specific subject-class combination

## Multi-select Topics

The topic filter supports multiple selection:
- Users can select multiple topics at once
- Selected topics are displayed as badges
- Topics can be individually removed from selection
