"use client"

import { useEffect, useMemo, useState } from "react"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { BookOpen, Download, GripVertical } from "lucide-react"
import jsPDF from "jspdf"

type Question = {
  question_id: string
  question_text: string
  default_marks: number
  class: string
  subject: string
  topic: string
  question_type: string
  options?: Record<string, string>
}

type Filters = {
  class?: string
  subject?: string
  topics: string[]
  types: string[]
  search?: string
}

function SortableRow({ q }: { q: Question }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: q.question_id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-3 p-3 rounded-lg border bg-[#202036]">
      <div {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing"><GripVertical className="w-4 h-4 text-muted-foreground" /></div>
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm">{q.question_text}</p>
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">{q.default_marks} marks</Badge>
        </div>
        <div className="flex gap-2 flex-wrap text-xs">
          <Badge variant="outline" className="rounded-full">{q.subject}</Badge>
          <Badge variant="outline" className="rounded-full">{q.topic}</Badge>
          <Badge variant="outline" className="rounded-full">{q.class}</Badge>
          <Badge variant="outline" className="rounded-full">{q.question_type}</Badge>
        </div>
      </div>
    </div>
  )
}

export default function CreatePage() {
  const [filters, setFilters] = useState<Filters>(() => {
    try { const s = localStorage.getItem("halo.create.filters"); return s ? JSON.parse(s) : { topics: [], types: [] } } catch { return { topics: [], types: [] } }
  })
  const [options, setOptions] = useState<{ classes?: string[]; subjects?: string[]; topics?: string[]; types?: string[] }>({ classes: [], subjects: [], topics: [], types: [] })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [paper, setPaper] = useState<Question[]>([])

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    localStorage.setItem("halo.create.filters", JSON.stringify(filters))
  }, [filters])

  useEffect(() => {
    const p = new URLSearchParams()
    if (filters.class) p.append("class", filters.class)
    if (filters.subject) p.append("subject", filters.subject)
    if (filters.topics.length) p.append("topic", filters.topics.join(","))
    if (filters.types.length) p.append("question_type", filters.types[0])
    p.append("page", String(page))
    p.append("limit", "10")
    fetch(`/api/questions?${p.toString()}`).then(r => r.json()).then((d) => {
      const normalized: Question[] = d.questions.map((q: any) => ({ ...q, options: q.options }))
      setQuestions(normalized)
      setTotal(d.total)
    }).catch(() => {})
  }, [filters, page])

  useEffect(() => {
    const p = new URLSearchParams()
    if (filters.class) p.append("class", filters.class)
    if (filters.subject) p.append("subject", filters.subject)
    if (filters.topics.length) p.append("topic", filters.topics.join(","))
    fetch(`/api/filter-options?${p.toString()}`).then(r => r.json()).then(setOptions).catch(() => {})
  }, [filters.class, filters.subject, filters.topics])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 10)), [total])

  const onDragEnd = (e: DragEndEvent) => {
    const id = String(e.active.id)
    const overId = e.over?.id ? String(e.over.id) : undefined
    // If dragging from pool to paper
    const fromPool = questions.find(q => q.question_id === id)
    if (fromPool && !paper.some(q => q.question_id === id)) {
      setPaper(prev => [...prev, fromPool])
      return
    }
    // Reorder inside paper
    if (overId) {
      const oldIndex = paper.findIndex(q => q.question_id === id)
      const newIndex = paper.findIndex(q => q.question_id === overId)
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) setPaper(prev => arrayMove(prev, oldIndex, newIndex))
    }
  }

  const removeFromPaper = (id: string) => setPaper(prev => prev.filter(q => q.question_id !== id))

  const exportPDF = () => {
    const pdf = new jsPDF()
    const margin = 15
    const pageW = pdf.internal.pageSize.getWidth()
    const contentW = pageW - margin * 2
    let y = margin
    pdf.setFontSize(18)
    pdf.text("Project Halo - Question Paper", margin, y)
    y += 10
    pdf.setLineWidth(0.5); pdf.line(margin, y, pageW - margin, y); y += 8
    pdf.setFontSize(12)
    paper.forEach((q, idx) => {
      const text = `Q${idx + 1}. (${q.default_marks} marks) ${q.question_text}`
      const lines = pdf.splitTextToSize(text, contentW)
      pdf.text(lines, margin, y)
      y += lines.length * 6 + 4
      if (y > pdf.internal.pageSize.getHeight() - margin) { pdf.addPage(); y = margin }
    })
    pdf.save("question_paper.pdf")
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Question Set */}
        <Card className="bg-[#1e1e2f] border-border/40 shadow-lg rounded-xl">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><BookOpen className="w-5 h-5"/> Question Set</h2>
            {/* Filters */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Class</label>
                <Select value={filters.class || ""} onValueChange={(v) => { setPage(1); setFilters({ ...filters, class: v }) }}>
                  <SelectTrigger><SelectValue placeholder="All"/></SelectTrigger>
                  <SelectContent>{(options.classes || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Subject</label>
                <Select value={filters.subject || ""} onValueChange={(v) => { setPage(1); setFilters({ ...filters, subject: v }) }}>
                  <SelectTrigger><SelectValue placeholder="All"/></SelectTrigger>
                  <SelectContent>{(options.subjects || []).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground">Topics</label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-lg">
                  {(options.topics || []).map(t => (
                    <label key={t} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={filters.topics.includes(t)} onCheckedChange={(ck) => {
                        setPage(1)
                        setFilters(prev => ({ ...prev, topics: ck ? [...prev.topics, t] : prev.topics.filter(x => x !== t) }))
                      }}/>
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground">Type</label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-lg">
                  {(options.types || []).map(tp => (
                    <label key={tp} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={filters.types.includes(tp)} onCheckedChange={(ck) => {
                        setPage(1)
                        setFilters(prev => ({ ...prev, types: ck ? [...prev.types, tp] : prev.types.filter(x => x !== tp) }))
                      }}/>
                      {tp}
                    </label>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <Input placeholder="Search questions..." value={filters.search || ""} onChange={(e) => { setPage(1); setFilters({ ...filters, search: e.target.value }) }}/>
              </div>
            </div>

            {/* List */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <div className="space-y-3">
                {questions.map(q => (
                  <div key={q.question_id} id={q.question_id}>
                    <SortableRow q={q}/>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                </div>
              </div>
            </DndContext>
          </CardContent>
        </Card>

        {/* Right: Paper */}
        <Card className="bg-[#1e1e2f] border-border/40 shadow-lg rounded-xl">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Main Question Paper</h2>
              <Button size="sm" onClick={exportPDF}><Download className="w-4 h-4 mr-2"/>Export to PDF</Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={paper.map(q => q.question_id)} strategy={verticalListSortingStrategy}>
                <div className={`min-h-[200px] rounded-lg border ${paper.length ? "" : "border-dashed"} p-3 space-y-3`}>
                  {paper.length === 0 ? (
                    <div className="text-center text-muted-foreground">Drag questions here</div>
                  ) : (
                    paper.map((q) => (
                      <div key={q.question_id} className="relative group">
                        <SortableRow q={q}/>
                        <Button size="sm" variant="ghost" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={() => removeFromPaper(q.question_id)}>Remove</Button>
                      </div>
                    ))
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


