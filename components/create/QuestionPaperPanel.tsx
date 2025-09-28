"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, GripVertical } from "lucide-react"
import { DndContext, closestCenter, DragEndEvent, useDroppable, DragOverlay } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import PaperRow from "./PaperRow"
import SectionDialog from "./SectionDialog"
import type { Question, PaperItem } from "@/app/create/types"

interface QuestionPaperPanelProps {
  paper: PaperItem[]
  onPaperChange: (paper: PaperItem[]) => void
  onRemoveFromPaper: (id: string) => void
  onEditQuestion: (question: Question) => void
  isSectionOpen: boolean
  onSectionOpenChange: (open: boolean) => void
  onAddSection: (text: string, prefix?: string) => void
  onExportPDF: () => void
  activeId: string | null
  sensors: any
  onDragStart: (e?: any) => void
  onDragEnd: (e: DragEndEvent) => void
}

export default function QuestionPaperPanel({
  paper,
  onPaperChange,
  onRemoveFromPaper,
  onEditQuestion,
  isSectionOpen,
  onSectionOpenChange,
  onAddSection,
  onExportPDF,
  activeId,
  sensors,
  onDragStart,
  onDragEnd
}: QuestionPaperPanelProps) {
  const { setNodeRef: setPaperDroppable } = useDroppable({ id: 'paper' })

  return (
    <Card className="bg-gray-900 border-gray-700 h-full flex flex-col">
      <CardHeader className="p-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm">Main Question Paper</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              onClick={() => onSectionOpenChange(true)}
              className="h-7 px-2 text-xs hover:bg-gray-800"
            >
              Add Section
            </Button>
            <Button 
              onClick={onExportPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-2 text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 flex-1 flex flex-col min-h-0">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div 
            ref={setPaperDroppable}
            className="flex-1 overflow-y-auto overflow-x-hidden pr-1 min-h-0 touch-pan-y"
          >
            {paper.length > 0 ? (
              <SortableContext items={paper.map(it => it.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                  {paper.map(it => (
                    <div key={it.id} id={it.id}>
                      <PaperRow 
                        item={it} 
                        onRemove={() => onRemoveFromPaper(it.id)}
                        onEditQuestion={onEditQuestion}
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            ) : (
              <div className="flex items-center justify-center h-full min-h-0">
                <div className="text-center text-gray-400 text-sm">
                  <div className="mb-2">Drag questions here</div>
                  <div className="text-xs text-gray-500">Start by adding a section or search for questions</div>
                </div>
              </div>
            )}
          </div>
          <DragOverlay>
            {activeId ? (
              <div className="bg-gray-800 border border-gray-600 rounded p-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-white text-sm">
                    {paper.find(x => x.id === activeId)?.kind === 'question' 
                      ? paper.find(x => x.id === activeId)?.question.question_text 
                      : paper.find(x => x.id === activeId)?.text}
                  </span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </CardContent>
      
      <SectionDialog 
        open={isSectionOpen} 
        onOpenChange={onSectionOpenChange} 
        onSubmit={onAddSection}
      />
    </Card>
  )
}
