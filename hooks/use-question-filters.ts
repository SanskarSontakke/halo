import { useMemo, useEffect } from "react"
import type { Question, Filters } from "@/app/create/types"

export const useQuestionFilters = (
  allQuestions: Question[],
  filters: Filters,
  setFilters: (filters: Filters) => void,
  setPage: (page: number) => void
) => {
  // Compute available classes and subjects based on existing combinations
  const availableClasses = useMemo(() => {
    return [...new Set(
      allQuestions
        .filter(q => q.class)
        .map(q => q.class!)
        .filter(Boolean)
    )].sort()
  }, [allQuestions])

  const availableSubjects = useMemo(() => {
    if (!filters.class) {
      // If no class selected, show all subjects that have questions
      return [...new Set(
        allQuestions
          .filter(q => q.subject)
          .map(q => q.subject!)
          .filter(Boolean)
      )].sort()
    } else {
      // If class selected, show only subjects that have questions for that class
      return [...new Set(
        allQuestions
          .filter(q => q.class === filters.class && q.subject)
          .map(q => q.subject!)
          .filter(Boolean)
      )].sort()
    }
  }, [allQuestions, filters.class])

  const availableClassesForSubject = useMemo(() => {
    if (!filters.subject) {
      // If no subject selected, show all classes that have questions
      return [...new Set(
        allQuestions
          .filter(q => q.class)
          .map(q => q.class!)
          .filter(Boolean)
      )].sort()
    } else {
      // If subject selected, show only classes that have questions for that subject
      return [...new Set(
        allQuestions
          .filter(q => q.subject === filters.subject && q.class)
          .map(q => q.class!)
          .filter(Boolean)
      )].sort()
    }
  }, [allQuestions, filters.subject])

  // Compute filtered topics and types based on selected class and subject
  const filteredTopics = useMemo(() => {
    if (!filters.class || !filters.subject) return []
    return [...new Set(
      allQuestions
        .filter(q => q.class === filters.class && q.subject === filters.subject && q.topic)
        .map(q => q.topic!)
        .filter(Boolean)
    )].sort()
  }, [allQuestions, filters.class, filters.subject])

  const filteredTypes = useMemo(() => {
    if (!filters.class || !filters.subject) return []
    return [...new Set(
      allQuestions
        .filter(q => q.class === filters.class && q.subject === filters.subject && q.question_type)
        .map(q => q.question_type)
        .filter(Boolean)
    )].sort()
  }, [allQuestions, filters.class, filters.subject])

  // Clear topics and types filters when class or subject changes
  useEffect(() => {
    setFilters({
      ...filters,
      topics: [],
      types: []
    })
  }, [filters.class, filters.subject])

  // Clear invalid class/subject selections when they're no longer available
  useEffect(() => {
    setFilters(prev => {
      let newFilters = { ...prev }
      
      // If current class is not available for current subject, clear it
      if (prev.class && !availableClassesForSubject.includes(prev.class)) {
        newFilters.class = undefined
        newFilters.topics = []
        newFilters.types = []
      }
      
      // If current subject is not available for current class, clear it
      if (prev.subject && !availableSubjects.includes(prev.subject)) {
        newFilters.subject = undefined
        newFilters.topics = []
        newFilters.types = []
      }
      
      return newFilters
    })
  }, [availableClassesForSubject, availableSubjects])

  return {
    availableClasses,
    availableSubjects,
    availableClassesForSubject,
    filteredTopics,
    filteredTypes
  }
}
