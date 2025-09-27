"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Question } from "@/app/create/types"

export default function QuestionRow({ q, onAdd, isAdded }: { q: Question; onAdd: (q: Question) => void; isAdded?: boolean }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded border bg-gray-800 border-gray-700 text-white overflow-hidden">
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-start justify-between gap-1 min-w-0">
          <p className="font-medium text-xs truncate flex-1 min-w-0 text-white">{q.question_text}</p>
          <Badge variant="secondary" className="bg-blue-600 text-white border-0 flex-shrink-0 text-xs px-1 py-0">{q.default_marks}m</Badge>
        </div>
        {String(q.question_type).toLowerCase() === 'match_pairs' && (q.left_items?.length || q.right_items?.length) ? (
          <div className="text-xs text-gray-300 truncate min-w-0">
            {(q.left_items || []).map((l, i) => `${String.fromCharCode(65 + i)}) ${l}`).join('  ')}
            {q.right_items?.length ? '   |   ' : ''}
            {(q.right_items || []).map((r, i) => `${i + 1}) ${r}`).join('  ')}
          </div>
        ) : (
          <div className="flex gap-1 flex-wrap text-xs">
            {q.subject && <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{q.subject}</Badge>}
            {q.topic && <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{q.topic}</Badge>}
            {q.class && <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{q.class}</Badge>}
            <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{q.question_type}</Badge>
          </div>
        )}
      </div>
      <Button size="sm" variant={isAdded ? "outline" : "default"} onClick={() => onAdd(q)} disabled={!!isAdded} className="flex-shrink-0 h-6 px-2 text-xs border-gray-600 text-white hover:bg-gray-700">{isAdded ? 'Added' : 'Add'}</Button>
    </div>
  )
}


