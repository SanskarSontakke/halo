import { useState, useEffect, useMemo } from "react"
import type { Question, PaperItem, Filters } from "@/app/create/types"

interface CreatePageState {
  mounted: boolean
  filters: Filters
  details: {
    schoolName: string
    className: string
    topicName: string
    date: string
    testName: string
  }
  page: number
  total: number
  allQuestions: Question[]
  questions: Question[]
  paper: PaperItem[]
  isSectionOpen: boolean
  editingQuestion: Question | null
  isEditQuestionOpen: boolean
}

export const useCreatePageState = () => {
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState<Filters>({ topics: [], types: [] })
  const [details, setDetails] = useState({
    schoolName: "",
    className: "",
    topicName: "",
    date: "",
    testName: ""
  })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [paper, setPaper] = useState<PaperItem[]>([])
  const [isSectionOpen, setIsSectionOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isEditQuestionOpen, setIsEditQuestionOpen] = useState(false)

  // Load from localStorage after mounting
  useEffect(() => { 
    setMounted(true)
    try {
      const savedFilters = localStorage.getItem("halo.create.filters")
      if (savedFilters) {
        setFilters(JSON.parse(savedFilters))
      }
    } catch {}
    
    try {
      const savedDetails = localStorage.getItem("halo.create.details")
      if (savedDetails) {
        setDetails(JSON.parse(savedDetails))
      }
    } catch {}
  }, [])

  // Save to localStorage when filters or details change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("halo.create.filters", JSON.stringify(filters))
    }
  }, [filters, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("halo.create.details", JSON.stringify(details))
    }
  }, [details, mounted])

  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions')
      const data = await response.json()
      
      if (data.questions) {
        // Normalize the data to match our Question type
        const normalized: Question[] = data.questions.map((q: any) => ({
          question_id: q.question_id || '',
          question_text: q.question_text || '',
          default_marks: q.default_marks || 1,
          class: q.class || null,
          subject: q.subject || null,
          topic: q.topic || null,
          question_type: q.question_type || '',
          options: q.options || null,
          left_items: q.left_items || null,
          right_items: q.right_items || null,
          blanks: q.blanks || null,
          question_answer: q.question_answer || null,
          correct_option_id: q.correct_option_id || null,
        }))
        setAllQuestions(normalized)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  // Filter and paginate questions
  useEffect(() => {
    const matches = (q: Question) => {
      // Filter by class (only if class filter is applied)
      if (filters.class && q.class !== filters.class) return false
      
      // Filter by subject (only if subject filter is applied)
      if (filters.subject && q.subject !== filters.subject) return false
      
      // Filter by topics (only if topics filter is applied)
      if (filters.topics.length > 0 && q.topic && !filters.topics.includes(q.topic)) return false
      
      // Filter by types (only if types filter is applied)
      if (filters.types.length > 0 && !filters.types.includes(q.question_type)) return false
      
      // Search filter
      if (filters.search && filters.search.trim()) {
        const s = filters.search.trim().toLowerCase()
        const hay = `${q.question_text} ${q.subject || ''} ${q.topic || ''} ${q.class || ''} ${q.question_type}`.toLowerCase()
        if (!hay.includes(s)) return false
      }
      
      return true
    }
    
    const filtered = allQuestions.filter(matches)
    const pageSize = 10
    const totalCount = filtered.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    setQuestions(filtered.slice(start, end))
    setTotal(totalCount)
  }, [allQuestions, filters, page])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 10)), [total])

  // Paper management functions
  const removeFromPaper = (id: string) => setPaper(prev => prev.filter(it => it.id !== id))

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setIsEditQuestionOpen(true)
  }

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setPaper(prev => prev.map(item => 
      item.kind === 'question' && item.question.question_id === updatedQuestion.question_id
        ? { ...item, question: updatedQuestion }
        : item
    ))
  }

  const addQuestionToPaper = (question: Question) => {
    const questionCopy: Question = {
      ...question,
      question_id: `paper_${question.question_id}_${Date.now()}`,
    }
    setPaper(prev => [...prev, { kind: 'question', id: questionCopy.question_id, question: questionCopy }])
  }

  const addSectionToPaper = (text: string, prefix?: string) => {
    const id = `section_${Date.now()}`
    setPaper(prev => [...prev, { kind: 'section', id, text, prefix }])
  }

  return {
    // State
    mounted,
    filters,
    details,
    page,
    total,
    allQuestions,
    questions,
    paper,
    isSectionOpen,
    editingQuestion,
    isEditQuestionOpen,
    totalPages,
    
    // Setters
    setFilters,
    setDetails,
    setPage,
    setPaper,
    setIsSectionOpen,
    setEditingQuestion,
    setIsEditQuestionOpen,
    
    // Functions
    removeFromPaper,
    handleEditQuestion,
    handleUpdateQuestion,
    addQuestionToPaper,
    addSectionToPaper,
    fetchQuestions
  }
}
