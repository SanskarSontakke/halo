const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'exam_generator.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  // Create questions table
  db.run(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id TEXT UNIQUE NOT NULL,
    question_text TEXT NOT NULL,
    question_answer TEXT,
    default_marks INTEGER NOT NULL,
    class TEXT NOT NULL,
    topic TEXT NOT NULL,
    subject TEXT NOT NULL,
    question_type TEXT NOT NULL,
    options TEXT,
    correct_option_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert sample questions
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
      options: JSON.stringify({ A: '5', B: '10', C: '7.5', D: '15' }),
      correct_option_id: 'A'
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
      options: JSON.stringify({ A: 'H2O', B: 'CO2', C: 'NaCl', D: 'O2' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q3',
      question_text: 'Photosynthesis occurs in which part of the plant cell?',
      question_answer: 'A',
      default_marks: 2,
      class: '9th Grade',
      topic: 'Biology',
      subject: 'Science',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'Chloroplast', B: 'Mitochondria', C: 'Nucleus', D: 'Cell Wall' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q4',
      question_text: 'World War II ended in which year?',
      question_answer: 'A',
      default_marks: 2,
      class: '10th Grade',
      topic: 'World Wars',
      subject: 'History',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: '1945', B: '1944', C: '1946', D: '1943' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q5',
      question_text: 'What is the capital of France?',
      question_answer: 'A',
      default_marks: 1,
      class: '6th Grade',
      topic: 'Geography',
      subject: 'Social Studies',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'Paris', B: 'London', C: 'Berlin', D: 'Madrid' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q6',
      question_text: 'Solve: 3x + 7 = 22',
      question_answer: 'A',
      default_marks: 3,
      class: '8th Grade',
      topic: 'Algebra',
      subject: 'Mathematics',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'x = 5', B: 'x = 4', C: 'x = 6', D: 'x = 3' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q7',
      question_text: 'What is the largest planet in our solar system?',
      question_answer: 'A',
      default_marks: 1,
      class: '7th Grade',
      topic: 'Astronomy',
      subject: 'Science',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'Jupiter', B: 'Saturn', C: 'Earth', D: 'Neptune' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q8',
      question_text: 'Who wrote "Romeo and Juliet"?',
      question_answer: 'A',
      default_marks: 2,
      class: '9th Grade',
      topic: 'Literature',
      subject: 'English',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'William Shakespeare', B: 'Charles Dickens', C: 'Jane Austen', D: 'Mark Twain' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q9',
      question_text: 'What is the square root of 64?',
      question_answer: 'A',
      default_marks: 1,
      class: '6th Grade',
      topic: 'Arithmetic',
      subject: 'Mathematics',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: '8', B: '6', C: '7', D: '9' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q10',
      question_text: 'Which gas makes up most of Earth\'s atmosphere?',
      question_answer: 'A',
      default_marks: 2,
      class: '8th Grade',
      topic: 'Environmental Science',
      subject: 'Science',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'Nitrogen', B: 'Oxygen', C: 'Carbon Dioxide', D: 'Argon' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q11',
      question_text: 'Define photosynthesis in one sentence.',
      question_answer: 'Plants make food using sunlight, CO2 and water',
      default_marks: 2,
      class: '7th Grade',
      topic: 'Biology',
      subject: 'Science',
      question_type: 'short_answer',
      options: null,
      correct_option_id: null
    },
    {
      question_id: 'q12',
      question_text: 'True or False: The Earth revolves around the Sun.',
      question_answer: 'True',
      default_marks: 1,
      class: '6th Grade',
      topic: 'Astronomy',
      subject: 'Science',
      question_type: 'true_false',
      options: null,
      correct_option_id: null
    },
    {
      question_id: 'q13',
      question_text: 'Solve: 12 ÷ 3 × 2 = ?',
      question_answer: 'A',
      default_marks: 1,
      class: '6th Grade',
      topic: 'Arithmetic',
      subject: 'Mathematics',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: '8', B: '2', C: '6', D: '4' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q14',
      question_text: 'Which continent is the Sahara Desert located on?',
      question_answer: 'A',
      default_marks: 1,
      class: '7th Grade',
      topic: 'Geography',
      subject: 'Social Studies',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'Africa', B: 'Asia', C: 'Australia', D: 'South America' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q15',
      question_text: 'Compute the perimeter of a rectangle of length 5 and width 3.',
      question_answer: 'A',
      default_marks: 2,
      class: '8th Grade',
      topic: 'Mensuration',
      subject: 'Mathematics',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: '16', B: '15', C: '8', D: '30' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q16',
      question_text: 'Who discovered gravity after seeing a falling apple (as per legend)?',
      question_answer: 'A',
      default_marks: 1,
      class: '7th Grade',
      topic: 'Physics',
      subject: 'Science',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'Isaac Newton', B: 'Albert Einstein', C: 'Galileo Galilei', D: 'Nikola Tesla' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q17',
      question_text: 'Write an essay on the importance of trees (100–150 words).',
      question_answer: '',
      default_marks: 5,
      class: '9th Grade',
      topic: 'Environment',
      subject: 'English',
      question_type: 'essay',
      options: null,
      correct_option_id: null
    },
    {
      question_id: 'q18',
      question_text: 'Which river is known as the longest river in the world?',
      question_answer: 'A',
      default_marks: 1,
      class: '6th Grade',
      topic: 'Rivers',
      subject: 'Social Studies',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'Nile', B: 'Amazon', C: 'Yangtze', D: 'Mississippi' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q19',
      question_text: 'Find the HCF of 18 and 24.',
      question_answer: 'A',
      default_marks: 2,
      class: '7th Grade',
      topic: 'Number System',
      subject: 'Mathematics',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: '6', B: '12', C: '3', D: '2' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q20',
      question_text: 'True or False: Sound cannot travel through a vacuum.',
      question_answer: 'True',
      default_marks: 1,
      class: '8th Grade',
      topic: 'Sound',
      subject: 'Science',
      question_type: 'true_false',
      options: null,
      correct_option_id: null
    },
    {
      question_id: 'q21',
      question_text: 'Complete the sentence: She _____ to school every day.',
      question_answer: 'A',
      default_marks: 1,
      class: '7th Grade',
      topic: 'Grammar',
      subject: 'English',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'goes', B: 'go', C: 'going', D: 'gone' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q22',
      question_text: 'Which device is used to input text into a computer?',
      question_answer: 'A',
      default_marks: 1,
      class: '6th Grade',
      topic: 'Basics',
      subject: 'Computer',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'Keyboard', B: 'Monitor', C: 'Printer', D: 'Speaker' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q23',
      question_text: 'The process of water cycle does NOT include which stage?',
      question_answer: 'A',
      default_marks: 1,
      class: '7th Grade',
      topic: 'Environment',
      subject: 'Science',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'Erosion', B: 'Evaporation', C: 'Condensation', D: 'Precipitation' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q24',
      question_text: 'Translate to English: "Vande Mataram" means?',
      question_answer: 'A',
      default_marks: 2,
      class: '9th Grade',
      topic: 'Patriotic Songs',
      subject: 'Social Studies',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'I praise thee, Mother', B: 'Hail the King', C: 'Long live the nation', D: 'My motherland' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q25',
      question_text: 'What is the synonym of "Happy"?',
      question_answer: 'A',
      default_marks: 1,
      class: '6th Grade',
      topic: 'Vocabulary',
      subject: 'English',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'Joyful', B: 'Sad', C: 'Angry', D: 'Tired' }),
      correct_option_id: 'A'
    },
    {
      question_id: 'q26',
      question_text: 'Which of these is an ancient civilization? ',
      question_answer: 'A',
      default_marks: 1,
      class: '6th Grade',
      topic: 'Ancient Civilizations',
      subject: 'History',
      question_type: 'multiple_choice',
      options: JSON.stringify({ A: 'Mesopotamia', B: 'Silicon Valley', C: 'NASA', D: 'UNICEF' }),
      correct_option_id: 'A'
    },
    { question_id: 'q27', question_text: 'Simplify: 15 - 7 + 4', question_answer: 'A', default_marks: 1, class: '6th Grade', topic: 'Arithmetic', subject: 'Mathematics', question_type: 'multiple_choice', options: JSON.stringify({ A: '12', B: '6', C: '8', D: '4' }), correct_option_id: 'A' },
    { question_id: 'q28', question_text: 'The process by which plants lose water vapor is called?', question_answer: 'A', default_marks: 1, class: '7th Grade', topic: 'Biology', subject: 'Science', question_type: 'multiple_choice', options: JSON.stringify({ A: 'Transpiration', B: 'Respiration', C: 'Germination', D: 'Fermentation' }), correct_option_id: 'A' },
    { question_id: 'q29', question_text: 'Who is known as the Father of Computers?', question_answer: 'A', default_marks: 1, class: '8th Grade', topic: 'History of Computers', subject: 'Computer', question_type: 'multiple_choice', options: JSON.stringify({ A: 'Charles Babbage', B: 'Alan Turing', C: 'Bill Gates', D: 'Tim Berners-Lee' }), correct_option_id: 'A' },
    { question_id: 'q30', question_text: 'True or False: Water boils at 100°C at sea level.', question_answer: 'True', default_marks: 1, class: '6th Grade', topic: 'Physics', subject: 'Science', question_type: 'true_false', options: null, correct_option_id: null },
    { question_id: 'q31', question_text: 'Find the perimeter of a triangle with sides 3, 4, and 5.', question_answer: 'A', default_marks: 2, class: '7th Grade', topic: 'Mensuration', subject: 'Mathematics', question_type: 'multiple_choice', options: JSON.stringify({ A: '12', B: '9', C: '10', D: '14' }), correct_option_id: 'A' },
    { question_id: 'q32', question_text: 'Which organ pumps blood throughout the human body?', question_answer: 'A', default_marks: 1, class: '6th Grade', topic: 'Biology', subject: 'Science', question_type: 'multiple_choice', options: JSON.stringify({ A: 'Heart', B: 'Lungs', C: 'Brain', D: 'Liver' }), correct_option_id: 'A' },
    { question_id: 'q33', question_text: 'Short answer: Define ecosystem.', question_answer: '', default_marks: 2, class: '8th Grade', topic: 'Ecology', subject: 'Science', question_type: 'short_answer', options: null, correct_option_id: null },
    { question_id: 'q34', question_text: 'Which language is used to structure web pages?', question_answer: 'A', default_marks: 1, class: '8th Grade', topic: 'Web', subject: 'Computer', question_type: 'multiple_choice', options: JSON.stringify({ A: 'HTML', B: 'CSS', C: 'JavaScript', D: 'Python' }), correct_option_id: 'A' }
  ];

  // Insert sample questions
  const stmt = db.prepare(`INSERT OR IGNORE INTO questions (
    question_id, question_text, question_answer, default_marks, class, topic, subject, question_type, options, correct_option_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  sampleQuestions.forEach(question => {
    stmt.run([
      question.question_id,
      question.question_text,
      question.question_answer,
      question.default_marks,
      question.class,
      question.topic,
      question.subject,
      question.question_type,
      question.options,
      question.correct_option_id
    ]);
  });

  stmt.finalize();
});

// API Routes

// Get all questions with filters
app.get('/api/questions', (req, res) => {
  const { subject, topic, class: grade, question_type, search, page = 1, limit = 10 } = req.query;
  
  let query = 'SELECT * FROM questions WHERE 1=1';
  const params = [];

  if (subject) {
    query += ' AND subject = ?';
    params.push(subject);
  }

  if (topic) {
    // Handle multiple topics (comma-separated)
    const topics = topic.split(',');
    const placeholders = topics.map(() => '?').join(',');
    query += ` AND topic IN (${placeholders})`;
    params.push(...topics);
  }

  if (grade) {
    query += ' AND class = ?';
    params.push(grade);
  }

  if (question_type) {
    query += ' AND question_type = ?';
    params.push(question_type);
  }

  if (search) {
    query += ' AND question_text LIKE ?';
    params.push(`%${search}%`);
  }

  // Get total count
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
  db.get(countQuery, params, (err, countResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const total = countResult.total;
    const offset = (page - 1) * limit;
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    db.all(query, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const questions = rows.map(row => ({
        question_id: row.question_id,
        question_text: row.question_text,
        question_answer: row.question_answer,
        default_marks: row.default_marks,
        class: row.class,
        topic: row.topic,
        subject: row.subject,
        question_type: row.question_type,
        options: JSON.parse(row.options || '{}'),
        correctOptionId: row.correct_option_id
      }));

      res.json({
        questions,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      });
    });
  });
});

// Get filter options with cascading behavior
app.get('/api/filter-options', (req, res) => {
  const { subject, class: grade, topic, question_type } = req.query;

  // base queries (topics/types built below). Subjects and classes queries are built with constraints further below.

  // topics constrained by subject and/or class
  let topicsQuery = 'SELECT DISTINCT topic FROM questions';
  const topicsParams = [];
  if (subject) {
    topicsQuery += ' WHERE subject = ?';
    topicsParams.push(subject);
  }
  if (grade) {
    topicsQuery += subject ? ' AND class = ?' : ' WHERE class = ?';
    topicsParams.push(grade);
  }
  topicsQuery += ' ORDER BY topic';

  // types constrained by topic/subject/class (when topic is given, still constrain by class/subject if present)
  let typesQuery = 'SELECT DISTINCT question_type FROM questions';
  const typesParams = [];
  let typesHasWhere = false;
  if (topic) {
    const topics = String(topic).split(',');
    const placeholders = topics.map(() => '?').join(',');
    typesQuery += ` WHERE topic IN (${placeholders})`;
    typesParams.push(...topics);
    typesHasWhere = true;
  }
  if (subject) {
    typesQuery += typesHasWhere ? ' AND subject = ?' : ' WHERE subject = ?';
    typesParams.push(subject);
    typesHasWhere = true;
  }
  if (grade) {
    typesQuery += typesHasWhere ? ' AND class = ?' : ' WHERE class = ?';
    typesParams.push(grade);
    typesHasWhere = true;
  }
  typesQuery += ' ORDER BY question_type';

  // classes constrained by subject/topic/type if provided
  let classesQuery = 'SELECT DISTINCT class FROM questions';
  const classParams = [];
  const addWhereAnd = (query, hasWhere) => hasWhere ? ' AND ' : ' WHERE ';
  let hasWhere = false;
  if (subject) { classesQuery += ' WHERE subject = ?'; classParams.push(subject); hasWhere = true; }
  if (topic) {
    const topics = String(topic).split(',');
    classesQuery += addWhereAnd(classesQuery.includes('WHERE'), true) + `topic IN (${topics.map(()=>'?').join(',')})`;
    classParams.push(...topics);
    hasWhere = true;
  }
  if (question_type) { classesQuery += addWhereAnd(classesQuery.includes('WHERE'), true) + 'question_type = ?'; classParams.push(question_type); hasWhere = true; }
  classesQuery += ' ORDER BY class';

  // subjects constrained by class/topic/type if provided
  let subjectsQuery = 'SELECT DISTINCT subject FROM questions';
  const subjectParams = [];
  let sHasWhere = false;
  if (grade) { subjectsQuery += ' WHERE class = ?'; subjectParams.push(grade); sHasWhere = true; }
  if (topic) {
    const topics = String(topic).split(',');
    subjectsQuery += addWhereAnd(subjectsQuery.includes('WHERE'), true) + `topic IN (${topics.map(()=>'?').join(',')})`;
    subjectParams.push(...topics); sHasWhere = true;
  }
  if (question_type) { subjectsQuery += addWhereAnd(subjectsQuery.includes('WHERE'), true) + 'question_type = ?'; subjectParams.push(question_type); sHasWhere = true; }
  subjectsQuery += ' ORDER BY subject';

  db.all(subjectsQuery, subjectParams, (err, subjects) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all(classesQuery, classParams, (err, classes) => {
      if (err) return res.status(500).json({ error: err.message });

      db.all(topicsQuery, topicsParams, (err, topics) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all(typesQuery, typesParams, (err, types) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            subjects: subjects.map(s => s.subject),
            classes: classes.map(c => c.class),
            topics: topics.map(t => t.topic),
            types: types.map(t => t.question_type)
          });
        });
      });
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Exam Generator Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Database initialized at: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
