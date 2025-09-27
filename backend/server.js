const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB setup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'project_halo';
let dbClient;
let questionsCol;

async function bootstrapMongo() {
  dbClient = new MongoClient(MONGODB_URI);
  await dbClient.connect();
  const db = dbClient.db(MONGODB_DB);
  questionsCol = db.collection('questions');
  await questionsCol.createIndex({ question_id: 1 }, { unique: true });

  // Seed or upsert sample questions so changes are reflected even if collection exists
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
      created_at: new Date(),
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
      created_at: new Date(),
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
      options: { A: 'Chloroplast', B: 'Mitochondria', C: 'Nucleus', D: 'Cell Wall' },
      correct_option_id: 'A',
      created_at: new Date(),
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
      options: { A: '1945', B: '1944', C: '1946', D: '1943' },
      correct_option_id: 'A',
      created_at: new Date(),
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
      options: { A: 'Paris', B: 'London', C: 'Berlin', D: 'Madrid' },
      correct_option_id: 'A',
      created_at: new Date(),
    },
      // 5 Fill in the blanks
      { question_id: 'f1', question_text: 'The capital of India is _____ .', question_answer: '', default_marks: 1, class: '6th Grade', topic: 'General Knowledge', subject: 'Social Studies', question_type: 'fill_in_the_blanks', options: null, correct_option_id: null, created_at: new Date() },
      { question_id: 'f2', question_text: 'Water boils at _____ °C at sea level.', question_answer: '', default_marks: 1, class: '6th Grade', topic: 'Physics', subject: 'Science', question_type: 'fill_in_the_blanks', options: null, correct_option_id: null, created_at: new Date() },
      { question_id: 'f3', question_text: 'Photosynthesis occurs in the _____ of plant cells.', question_answer: '', default_marks: 1, class: '7th Grade', topic: 'Biology', subject: 'Science', question_type: 'fill_in_the_blanks', options: null, correct_option_id: null, created_at: new Date() },
      { question_id: 'f4', question_text: 'The largest ocean on Earth is the _____ Ocean.', question_answer: '', default_marks: 1, class: '8th Grade', topic: 'Geography', subject: 'Social Studies', question_type: 'fill_in_the_blanks', options: null, correct_option_id: null, created_at: new Date() },
      { question_id: 'f5', question_text: 'The formula for water is _____ .', question_answer: '', default_marks: 1, class: '6th Grade', topic: 'Chemistry', subject: 'Science', question_type: 'fill_in_the_blanks', options: null, correct_option_id: null, created_at: new Date() },
      // 5 Match the pairs (use left_items/right_items arrays)
      { question_id: 'm1', question_text: 'Match the pairs', question_answer: '', default_marks: 2, class: '7th Grade', topic: 'Planets', subject: 'Science', question_type: 'match_pairs', options: null, left_items: ['Mercury','Venus','Earth','Mars'], right_items: ['Smallest Planet','Morning Star','Blue Planet','Red Planet'], correct_option_id: null, created_at: new Date() },
      { question_id: 'm2', question_text: 'Match the pairs', question_answer: '', default_marks: 2, class: '7th Grade', topic: 'Chemistry Basics', subject: 'Science', question_type: 'match_pairs', options: null, left_items: ['H2O','NaCl','CO2','O2'], right_items: ['Water','Common salt','Carbon dioxide','Oxygen'], correct_option_id: null, created_at: new Date() },
      { question_id: 'm3', question_text: 'Match the pairs', question_answer: '', default_marks: 2, class: '6th Grade', topic: 'Indian Geography', subject: 'Social Studies', question_type: 'match_pairs', options: null, left_items: ['Delhi','Mumbai','Kolkata','Chennai'], right_items: ['India','Maharashtra','West Bengal','Tamil Nadu'], correct_option_id: null, created_at: new Date() },
      { question_id: 'm4', question_text: 'Match the pairs', question_answer: '', default_marks: 2, class: '6th Grade', topic: 'Shapes', subject: 'Mathematics', question_type: 'match_pairs', options: null, left_items: ['Triangle','Rectangle','Circle','Square'], right_items: ['3 sides','Opposite sides equal','No sides','4 equal sides'], correct_option_id: null, created_at: new Date() },
      { question_id: 'm5', question_text: 'Match the pairs', question_answer: '', default_marks: 2, class: '6th Grade', topic: 'Basics', subject: 'Computer', question_type: 'match_pairs', options: null, left_items: ['CPU','Monitor','Keyboard','Mouse'], right_items: ['Processing unit','Display','Input keys','Pointing device'], correct_option_id: null, created_at: new Date() },
      // 5 Textual answer questions
      { question_id: 't1', question_text: 'Define photosynthesis in one or two lines.', question_answer: '', default_marks: 2, class: '7th Grade', topic: 'Biology', subject: 'Science', question_type: 'short_answer', options: null, correct_option_id: null, created_at: new Date() },
      { question_id: 't2', question_text: 'Write the capital of France and one famous monument there.', question_answer: '', default_marks: 2, class: '6th Grade', topic: 'Europe', subject: 'Social Studies', question_type: 'short_answer', options: null, correct_option_id: null, created_at: new Date() },
      { question_id: 't3', question_text: 'Explain the water cycle briefly.', question_answer: '', default_marks: 3, class: '7th Grade', topic: 'Environment', subject: 'Science', question_type: 'short_answer', options: null, correct_option_id: null, created_at: new Date() },
      { question_id: 't4', question_text: 'What is an ecosystem?', question_answer: '', default_marks: 2, class: '8th Grade', topic: 'Ecology', subject: 'Science', question_type: 'short_answer', options: null, correct_option_id: null, created_at: new Date() },
      { question_id: 't5', question_text: 'State any two uses of a computer in daily life.', question_answer: '', default_marks: 2, class: '6th Grade', topic: 'Applications', subject: 'Computer', question_type: 'short_answer', options: null, correct_option_id: null, created_at: new Date() },
  ];

  // Upsert all sample questions (replace by question_id)
  const ops = sampleQuestions.map((doc) => ({
    replaceOne: {
      filter: { question_id: doc.question_id },
      replacement: doc,
      upsert: true,
    },
  }));
  await questionsCol.bulkWrite(ops, { ordered: false });
  console.log('Upserted sample questions into MongoDB');
}

// API Routes

// Get all questions with filters
app.get('/api/questions', async (req, res) => {
  try {
  const { subject, topic, class: grade, question_type, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (subject) query.subject = subject;
    if (grade) query.class = grade;
    if (topic) query.topic = { $in: String(topic).split(',') };
  if (question_type) {
    const types = String(question_type).split(',');
      query.question_type = types.length > 1 ? { $in: types } : types[0];
    }
    if (search) query.question_text = { $regex: String(search), $options: 'i' };

    const total = await questionsCol.countDocuments(query);
    const items = await questionsCol
      .find(query)
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .toArray();

    const questions = items.map(row => ({
        question_id: row.question_id,
        question_text: row.question_text,
        question_answer: row.question_answer,
        default_marks: row.default_marks,
        class: row.class,
        topic: row.topic,
        subject: row.subject,
        question_type: row.question_type,
      options: row.options || null,
      left_items: row.left_items || null,
      right_items: row.right_items || null,
        correctOptionId: row.correct_option_id
      }));

      res.json({
        questions,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get filter options with cascading behavior
app.get('/api/filter-options', async (req, res) => {
  try {
  const { subject, class: grade, topic, question_type } = req.query;
    const topicsMatch = {};
    if (subject) topicsMatch.subject = subject;
    if (grade) topicsMatch.class = grade;
    const topics = await questionsCol.distinct('topic', topicsMatch);

    const typesMatch = {};
    if (topic) typesMatch.topic = { $in: String(topic).split(',') };
    if (subject) typesMatch.subject = subject;
    if (grade) typesMatch.class = grade;
    const types = await questionsCol.distinct('question_type', typesMatch);

    const classesMatch = {};
    if (subject) classesMatch.subject = subject;
    if (topic) classesMatch.topic = { $in: String(topic).split(',') };
    if (question_type) classesMatch.question_type = question_type;
    const classes = await questionsCol.distinct('class', classesMatch);

    const subjectsMatch = {};
    if (grade) subjectsMatch.class = grade;
    if (topic) subjectsMatch.topic = { $in: String(topic).split(',') };
    if (question_type) subjectsMatch.question_type = question_type;
    const subjects = await questionsCol.distinct('subject', subjectsMatch);

    res.json({ subjects, classes, topics, types });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Exam Generator Backend is running' });
});

// Start server
app.listen(PORT, async () => {
  await bootstrapMongo();
  console.log(`Server is running on port ${PORT}`);
  console.log(`MongoDB connected at: ${MONGODB_URI}, db: ${MONGODB_DB}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  try {
    if (dbClient) await dbClient.close();
    console.log('MongoDB connection closed.');
  } catch (err) {
    console.error(err);
  }
    process.exit(0);
});
