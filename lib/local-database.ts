import type { Question } from "@/components/exam-creator"

export interface QuestionFilters {
  subject?: string
  topic?: string
  class?: string
  question_type?: string
  search?: string
  page?: number
  limit?: number
}

export interface Section {
  id: string
  exam_paper_id: string
  section_name: string
  position: number
  total_marks: number
}

export interface ExamPaperItem {
  type: "section" | "question"
  id: string
  position: number
  data: Section | Question
}

// Sample data for local development
const sampleQuestions: Question[] = [
  {
    question_id: "1",
    question_text: "What is the value of x in the equation 2x + 5 = 15?",
    question_answer: "A",
    default_marks: 2,
    class: "10th Grade",
    topic: "Algebra",
    subject: "Mathematics",
    question_type: "multiple_choice",
    options: { "A": "5", "B": "10", "C": "7.5", "D": "15" },
    correctOptionId: "A"
  },
  {
    question_id: "2",
    question_text: "What is the chemical formula for water?",
    question_answer: "A",
    default_marks: 1,
    class: "9th Grade",
    topic: "Chemistry",
    subject: "Science",
    question_type: "multiple_choice",
    options: { "A": "H2O", "B": "CO2", "C": "NaCl", "D": "CH4" },
    correctOptionId: "A"
  },
  {
    question_id: "3",
    question_text: "Photosynthesis occurs in which part of the plant cell?",
    question_answer: "C",
    default_marks: 2,
    class: "9th Grade",
    topic: "Biology",
    subject: "Science",
    question_type: "multiple_choice",
    options: { "A": "Nucleus", "B": "Mitochondria", "C": "Chloroplasts", "D": "Ribosomes" },
    correctOptionId: "C"
  },
  {
    question_id: "4",
    question_text: "World War II ended in which year?",
    question_answer: "B",
    default_marks: 2,
    class: "12th Grade",
    topic: "World Wars",
    subject: "History",
    question_type: "multiple_choice",
    options: { "A": "1944", "B": "1945", "C": "1946", "D": "1947" },
    correctOptionId: "B"
  },
  {
    question_id: "5",
    question_text: "The area of a circle with radius 7 cm is:",
    question_answer: "A",
    default_marks: 3,
    class: "10th Grade",
    topic: "Geometry",
    subject: "Mathematics",
    question_type: "multiple_choice",
    options: { "A": "49π cm²", "B": "14π cm²", "C": "21π cm²", "D": "7π cm²" },
    correctOptionId: "A"
  }
]

// In-memory storage for local development
let questions: Question[] = [...sampleQuestions]
let examPapers: any[] = []
let sections: Section[] = []
let examPaperQuestions: any[] = []

// Generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export async function fetchQuestions(filters: QuestionFilters = {}): Promise<{ questions: Question[]; total: number }> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100))
  
  let filteredQuestions = [...questions]
  
  // Apply filters
  if (filters.subject) {
    filteredQuestions = filteredQuestions.filter(q => q.subject === filters.subject)
  }
  if (filters.topic) {
    filteredQuestions = filteredQuestions.filter(q => q.topic === filters.topic)
  }
  if (filters.class) {
    filteredQuestions = filteredQuestions.filter(q => q.class === filters.class)
  }
  if (filters.question_type) {
    filteredQuestions = filteredQuestions.filter(q => q.question_type === filters.question_type)
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredQuestions = filteredQuestions.filter(q => 
      q.question_text.toLowerCase().includes(searchLower)
    )
  }
  
  // Apply pagination
  const page = filters.page || 1
  const limit = filters.limit || 10
  const offset = (page - 1) * limit
  
  const paginatedQuestions = filteredQuestions.slice(offset, offset + limit)
  
  return { 
    questions: paginatedQuestions, 
    total: filteredQuestions.length 
  }
}

export async function fetchFilterOptions() {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50))
  
  const subjects = [...new Set(questions.map(q => q.subject))]
  const topics = [...new Set(questions.map(q => q.topic))]
  const classes = [...new Set(questions.map(q => q.class))]
  const types = [...new Set(questions.map(q => q.question_type))]
  
  return { subjects, topics, classes, types }
}

export async function createSection(
  examPaperId: string,
  sectionName: string,
  position: number,
): Promise<Section | null> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const section: Section = {
    id: generateId(),
    exam_paper_id: examPaperId,
    section_name: sectionName,
    position: position,
    total_marks: 0,
  }
  
  sections.push(section)
  return section
}

export async function fetchExamPaperItems(examPaperId: string): Promise<ExamPaperItem[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const items: ExamPaperItem[] = []
  
  // Add sections
  const examSections = sections.filter(s => s.exam_paper_id === examPaperId)
  examSections.forEach(section => {
    items.push({
      type: "section",
      id: section.id,
      position: section.position,
      data: section,
    })
  })
  
  // Add questions
  const examQuestions = examPaperQuestions.filter(eq => eq.exam_paper_id === examPaperId)
  examQuestions.forEach(item => {
    const question = questions.find(q => q.question_id === item.question_id)
    if (question) {
      items.push({
        type: "question",
        id: item.id,
        position: item.question_order,
        data: question,
      })
    }
  })
  
  // Sort by position
  return items.sort((a, b) => a.position - b.position)
}

export async function updateItemPositions(examPaperId: string, items: ExamPaperItem[]): Promise<boolean> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100))
  
  try {
    // Update sections
    const sectionUpdates = items
      .filter(item => item.type === "section")
      .map((item, index) => ({
        id: item.id,
        position: index,
      }))
    
    sectionUpdates.forEach(update => {
      const section = sections.find(s => s.id === update.id)
      if (section) {
        section.position = update.position
      }
    })
    
    // Update questions
    const questionUpdates = items
      .filter(item => item.type === "question")
      .map((item, index) => ({
        id: item.id,
        question_order: index,
      }))
    
    questionUpdates.forEach(update => {
      const examQuestion = examPaperQuestions.find(eq => eq.id === update.id)
      if (examQuestion) {
        examQuestion.question_order = update.question_order
      }
    })
    
    return true
  } catch (error) {
    console.error("Error updating item positions:", error)
    return false
  }
}

export async function updateSectionName(sectionId: string, newName: string): Promise<boolean> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const section = sections.find(s => s.id === sectionId)
  if (section) {
    section.section_name = newName
    return true
  }
  return false
}

export async function deleteSection(sectionId: string): Promise<boolean> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const index = sections.findIndex(s => s.id === sectionId)
  if (index !== -1) {
    sections.splice(index, 1)
    return true
  }
  return false
}

export async function addQuestionToExamPaper(
  examPaperId: string,
  questionId: string,
  marksAllocated: number,
  position: number,
): Promise<boolean> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const examPaperQuestion = {
    id: generateId(),
    exam_paper_id: examPaperId,
    question_id: questionId,
    question_order: position,
    marks_allocated: marksAllocated,
    created_at: new Date().toISOString(),
  }
  
  examPaperQuestions.push(examPaperQuestion)
  return true
}

export async function moveQuestionBetweenSections(
  questionId: string,
  newSectionId: string,
  newOrder: number,
): Promise<boolean> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const examQuestion = examPaperQuestions.find(eq => eq.question_id === questionId)
  if (examQuestion) {
    examQuestion.section_id = newSectionId
    examQuestion.question_order = newOrder
    return true
  }
  return false
}
