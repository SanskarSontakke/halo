"use client"

import { useEffect } from "react"
import { generateQuestionPaperPDF } from "@/lib/pdf-generator"
import { useCreatePageState } from "@/hooks/use-create-page-state"
import { useQuestionFilters } from "@/hooks/use-question-filters"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop"
import MainDetailsSection from "@/components/create/MainDetailsSection"
import FiltersSection from "@/components/create/FiltersSection"
import QuestionSetPanel from "@/components/create/QuestionSetPanel"
import QuestionPaperPanel from "@/components/create/QuestionPaperPanel"
import EditQuestionDialog from "@/components/create/EditQuestionDialog"

export default function CreatePage() {
  const {
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
    addSectionToPaper
  } = useCreatePageState()

  // Use custom hooks
  const {
    availableClasses,
    availableSubjects,
    availableClassesForSubject,
    filteredTopics,
    filteredTypes
  } = useQuestionFilters(allQuestions, filters, setFilters, setPage)

  const {
    activeId,
    sensors,
    onDragStart,
    onDragEnd
  } = useDragAndDrop(paper, setPaper)

  // Export PDF function
  const exportPDF = () => {
    generateQuestionPaperPDF(paper, details)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-2 sm:p-3 max-w-7xl space-y-3">
      {/* Main Details Section */}
      <MainDetailsSection 
        details={details}
        onDetailsChange={setDetails}
      />

      {/* Filters Section */}
      <FiltersSection
        filters={filters}
        onFiltersChange={setFilters}
        onPageChange={setPage}
        availableClassesForSubject={availableClassesForSubject}
        availableSubjects={availableSubjects}
        filteredTopics={filteredTopics}
        filteredTypes={filteredTypes}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-[calc(100vh-200px)]">
        {/* Question Set Panel */}
        <QuestionSetPanel
          questions={questions}
          paper={paper}
          onAddQuestion={addQuestionToPaper}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          filters={filters}
          allQuestionsCount={allQuestions.length}
        />

        {/* Main Question Paper Panel */}
        <QuestionPaperPanel
          paper={paper}
          onPaperChange={setPaper}
          onRemoveFromPaper={removeFromPaper}
          onEditQuestion={handleEditQuestion}
          isSectionOpen={isSectionOpen}
          onSectionOpenChange={setIsSectionOpen}
          onAddSection={addSectionToPaper}
          onExportPDF={exportPDF}
          activeId={activeId}
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      </div>

      {/* Edit Question Dialog */}
      <EditQuestionDialog
        open={isEditQuestionOpen}
        onOpenChange={setIsEditQuestionOpen}
        question={editingQuestion}
        onSubmit={handleUpdateQuestion}
      />
    </main>
  )
}