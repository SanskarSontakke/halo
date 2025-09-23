import type { Question } from "@/components/exam-creator"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export interface QuestionFilters {
  subject?: string
  topic?: string | string[]
  class?: string
  question_type?: string
  search?: string
  page?: number
  limit?: number
}

export async function fetchQuestions(filters: QuestionFilters = {}): Promise<{ questions: Question[]; total: number }> {
  try {
    const params = new URLSearchParams()
    
    if (filters.subject) params.append('subject', filters.subject)
    if (filters.topic) {
      if (Array.isArray(filters.topic)) {
        params.append('topic', filters.topic.join(','))
      } else {
        params.append('topic', filters.topic)
      }
    }
    if (filters.class) params.append('class', filters.class)
    if (filters.question_type) params.append('question_type', filters.question_type)
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const response = await fetch(`${API_BASE_URL}/questions?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch questions')
    }
    
    const data = await response.json()
    return {
      questions: data.questions,
      total: data.total
    }
  } catch (error) {
    console.error('Error fetching questions:', error)
    // Fallback to empty result
    return { questions: [], total: 0 }
  }
}

export async function fetchFilterOptions(filters: { subject?: string; class?: string; topic?: string | string[]; question_type?: string } = {}) {
  try {
    const params = new URLSearchParams()
    if (filters.subject) params.append('subject', filters.subject)
    if (filters.class) params.append('class', filters.class)
    if (filters.topic) {
      if (Array.isArray(filters.topic)) {
        params.append('topic', filters.topic.join(','))
      } else {
        params.append('topic', filters.topic)
      }
    }
    if (filters.question_type) params.append('question_type', filters.question_type)

    const response = await fetch(`${API_BASE_URL}/filter-options?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch filter options')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching filter options:', error)
    // Fallback to empty options
    return {
      subjects: [],
      classes: [],
      topics: [],
      types: []
    }
  }
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

export async function createSection(
  examPaperId: string,
  sectionName: string,
  position: number,
): Promise<Section | null> {
  const { createSection: localCreateSection } = await import("./local-database")
  return localCreateSection(examPaperId, sectionName, position)
}

export async function fetchExamPaperItems(examPaperId: string): Promise<ExamPaperItem[]> {
  const { fetchExamPaperItems: localFetchExamPaperItems } = await import("./local-database")
  return localFetchExamPaperItems(examPaperId)
}

export async function updateItemPositions(examPaperId: string, items: ExamPaperItem[]): Promise<boolean> {
  const { updateItemPositions: localUpdateItemPositions } = await import("./local-database")
  return localUpdateItemPositions(examPaperId, items)
}

export async function updateSectionName(sectionId: string, newName: string): Promise<boolean> {
  const { updateSectionName: localUpdateSectionName } = await import("./local-database")
  return localUpdateSectionName(sectionId, newName)
}

export async function deleteSection(sectionId: string): Promise<boolean> {
  const { deleteSection: localDeleteSection } = await import("./local-database")
  return localDeleteSection(sectionId)
}

export async function addQuestionToExamPaper(
  examPaperId: string,
  questionId: string,
  marksAllocated: number,
  position: number,
): Promise<boolean> {
  const { addQuestionToExamPaper: localAddQuestionToExamPaper } = await import("./local-database")
  return localAddQuestionToExamPaper(examPaperId, questionId, marksAllocated, position)
}

export async function moveQuestionBetweenSections(
  questionId: string,
  newSectionId: string,
  newOrder: number,
): Promise<boolean> {
  const { moveQuestionBetweenSections: localMoveQuestionBetweenSections } = await import("./local-database")
  return localMoveQuestionBetweenSections(questionId, newSectionId, newOrder)
}
