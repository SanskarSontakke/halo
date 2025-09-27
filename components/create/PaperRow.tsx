"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PaperItem } from "@/app/create/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

export default function PaperRow({ item, onRemove, onEditSection, onEditQuestion }: { item: PaperItem; onRemove: (id: string) => void; onEditSection?: (id: string) => void; onEditQuestion?: (question: Question) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform || null), transition, opacity: isDragging ? 0 : 1 }
  return (
    <div ref={setNodeRef} style={style} className="relative group text-white">
      {item.kind === 'section' ? (
        <div className="flex items-center gap-2 p-2 rounded border bg-gray-800 border-gray-700">
          <div {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing"><GripVertical className="w-3 h-3 text-gray-400" /></div>
          <div className="flex-1 flex items-center gap-1">
            {item.prefix ? <span className="text-xs text-gray-300 whitespace-nowrap">{item.prefix}</span> : null}
            <div className="w-full text-center text-xs text-gray-300">{item.text || 'Section'}</div>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEditSection && onEditSection(item.id)} className="h-6 px-1 text-xs hover:bg-gray-700">Edit</Button>
            <Button size="sm" variant="ghost" onClick={() => onRemove(item.id)} className="h-6 px-1 text-xs hover:bg-gray-700">Remove</Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2 p-2 rounded border bg-gray-800 border-gray-700 overflow-hidden">
          <div {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing flex-shrink-0"><GripVertical className="w-3 h-3 text-gray-400" /></div>
          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-start justify-between gap-1 min-w-0">
              <p className="font-medium text-xs truncate flex-1 min-w-0 text-white">{item.question.question_text}</p>
              <Badge variant="secondary" className="bg-blue-600 text-white border-0 flex-shrink-0 text-xs px-1 py-0">{item.question.default_marks}m</Badge>
            </div>
            {String(item.question.question_type).toLowerCase() === 'match_pairs' && (item.question.left_items?.length || item.question.right_items?.length) ? (
              <div className="text-xs text-gray-300 truncate min-w-0">
                {(item.question.left_items || []).map((l, i) => `${String.fromCharCode(65 + i)}) ${l}`).join('  ')}
                {item.question.right_items?.length ? '   |   ' : ''}
                {(item.question.right_items || []).map((r, i) => `${i + 1}) ${r}`).join('  ')}
              </div>
            ) : (
              <div className="flex gap-1 flex-wrap text-xs">
                <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{item.question.subject}</Badge>
                <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{item.question.topic}</Badge>
                <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{item.question.class}</Badge>
                <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{item.question.question_type}</Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button size="sm" variant="ghost" onClick={() => onEditQuestion && onEditQuestion(item.question)} className="h-6 px-1 text-xs hover:bg-gray-700">Edit</Button>
            <Button size="sm" variant="ghost" onClick={() => onRemove(item.id)} className="h-6 px-1 text-xs hover:bg-gray-700">Remove</Button>
          </div>
        </div>
      )}
    </div>
  )
}


