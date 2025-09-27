"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import QuestionRow from "./QuestionRow"
import type { Question, PaperItem } from "@/app/create/types"

interface QuestionSetPanelProps {
  questions: Question[]
  paper: PaperItem[]
  onAddQuestion: (question: Question) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  filters: {
    class?: string
    subject?: string
  }
  allQuestionsCount: number
}

export default function QuestionSetPanel({
  questions,
  paper,
  onAddQuestion,
  page,
  totalPages,
  onPageChange,
  filters,
  allQuestionsCount
}: QuestionSetPanelProps) {
  return (
    <Card className="bg-gray-900 border-gray-700 h-full flex flex-col">
      <CardHeader className="p-2 flex-shrink-0">
        <CardTitle className="text-white text-sm">Question Set</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-1 flex flex-col min-h-0">
        {/* List in its own scroll area - only show when Class and Subject are selected */}
        {(filters.class && filters.subject) ? (
          <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 min-h-0">
            {questions.length > 0 ? (
              <div className="space-y-1">
                {questions.map(q => {
                  // Check if this question is added by looking for the original question_id in paper items
                  const added = paper.some(x => x.kind === 'question' && x.question.question_id.startsWith(`paper_${q.question_id}_`))
                  return (
                    <div key={q.question_id} id={q.question_id}>
                      <QuestionRow q={q} isAdded={added} onAdd={(qq) => { 
                        if (!added) {
                          onAddQuestion(qq)
                        }
                      }}/>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-0">
                <div className="text-center text-gray-400 text-sm">
                  <div className="mb-2">No questions found</div>
                  <div className="text-xs text-gray-500">Try adjusting your filters or add sample questions</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="text-center text-gray-400 text-sm">
              <div className="mb-2">Select Class and Subject to view questions</div>
              <div className="text-xs text-gray-500">Use the filters above to get started</div>
            </div>
          </div>
        )}
            
        {/* Pagination at bottom - only show when Class and Subject are selected */}
        {(filters.class && filters.subject) && (
          <div className="flex items-center justify-between pt-1 flex-shrink-0">
            <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="h-6 w-6 p-0 hover:bg-gray-800"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="h-6 w-6 p-0 hover:bg-gray-800"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
