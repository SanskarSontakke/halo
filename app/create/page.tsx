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
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState<Filters>(() => {
    try { const s = localStorage.getItem("halo.create.filters"); return s ? JSON.parse(s) : { topics: [], types: [] } } catch { return { topics: [], types: [] } }
  })
  const [details, setDetails] = useState<{ schoolName: string; className: string; topicName: string; date: string }>(() => {
    try { const s = localStorage.getItem("halo.create.details"); return s ? JSON.parse(s) : { schoolName: "", className: "", topicName: "", date: "" } } catch { return { schoolName: "", className: "", topicName: "", date: "" } }
  })
  const [options, setOptions] = useState<{ classes?: string[]; subjects?: string[]; topics?: string[]; types?: string[] }>({ classes: [], subjects: [], topics: [], types: [] })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [paper, setPaper] = useState<Question[]>([])

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    localStorage.setItem("halo.create.filters", JSON.stringify(filters))
  }, [filters])

  useEffect(() => {
    localStorage.setItem("halo.create.details", JSON.stringify(details))
  }, [details])

  useEffect(() => {
    const p = new URLSearchParams()
    if (filters.class) p.append("class", filters.class)
    if (filters.subject) p.append("subject", filters.subject)
    if (filters.topics.length) p.append("topic", filters.topics.join(","))
    if (filters.types.length) p.append("question_type", filters.types.join(","))
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
    const maxMarks = paper.reduce((sum, q) => sum + (Number(q.default_marks) || 0), 0)
    // Top details box (compact)
    const boxH = 28
    pdf.setDrawColor(0,0,0); pdf.setLineWidth(0.8); pdf.rect(margin, y, contentW, boxH)
    // Big centered school name
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(22)
    const schoolText = (details.schoolName || '').trim() || 'SCHOOL'
    const schoolW = pdf.getTextWidth(schoolText)
    const schoolX = margin + (contentW - schoolW) / 2
    pdf.text(schoolText, schoolX, y + 10)
    // Smaller row values
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(12)
    const topicText = `Topic: ${details.topicName || '-'}`
    const classText = `Class: ${details.className || '-'}`
    const dateText = `Date: ${details.date || '-'}`
    const mmText = `Max Marks: ${maxMarks}`
    const mmW = pdf.getTextWidth(mmText)
    const mmX = margin + contentW - mmW - 6
    const dateW = pdf.getTextWidth(dateText)
    // Place rows with guaranteed spacing
    pdf.text(topicText, margin + 6, y + 20)
    pdf.text(classText, margin + contentW * 0.40, y + 20)
    // Date placed to end 12pt before Max Marks
    const tentativeDateX = mmX - dateW - 12
    const minDateX = margin + contentW * 0.55
    const dateX = Math.max(tentativeDateX, minDateX)
    pdf.text(dateText, dateX, y + 20)
    // Right aligned Max Marks
    pdf.text(mmText, mmX, y + 20)
    y += boxH + 8
    pdf.setFontSize(12)
    paper.forEach((q, idx) => {
      const text = `Q${idx + 1}. (${q.default_marks} marks) ${q.question_text}`
      const lines = pdf.splitTextToSize(text, contentW)
      pdf.text(lines, margin, y)
      // even tighter spacing between questions
      y += lines.length * 5.5 + 1
      if (y > pdf.internal.pageSize.getHeight() - margin) { pdf.addPage(); y = margin }
    })
    pdf.save("question_paper.pdf")
  }

  return (
    <main className="container mx-auto p-6 sm:p-8 max-w-7xl space-y-6">
      {/* Details header */}
      <Card className="bg-[#161626] border border-indigo-500/20 shadow-xl rounded-2xl">
        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-indigo-200/80">School Name</label>
              <Input value={details.schoolName} onChange={(e) => setDetails(d => ({ ...d, schoolName: e.target.value }))} placeholder="e.g., Springdale High" className="mt-1 bg-black/20 border-indigo-500/20 focus:ring-2 focus:ring-indigo-500/40"/>
            </div>
            <div>
              <label className="text-xs text-indigo-200/80">Class</label>
              <Input value={details.className} onChange={(e) => setDetails(d => ({ ...d, className: e.target.value }))} placeholder="e.g., 7th Grade" className="mt-1 bg-black/20 border-indigo-500/20 focus:ring-2 focus:ring-indigo-500/40"/>
            </div>
            <div>
              <label className="text-xs text-indigo-200/80">Topic</label>
              <Input value={details.topicName} onChange={(e) => setDetails(d => ({ ...d, topicName: e.target.value }))} placeholder="e.g., Biology" className="mt-1 bg-black/20 border-indigo-500/20 focus:ring-2 focus:ring-indigo-500/40"/>
            </div>
            <div>
              <label className="text-xs text-indigo-200/80">Date</label>
              <Input value={details.date} onChange={(e) => setDetails(d => ({ ...d, date: e.target.value }))} placeholder="e.g., 2025-09-23" className="mt-1 bg-black/20 border-indigo-500/20 focus:ring-2 focus:ring-indigo-500/40"/>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Question Set */}
        <Card className="bg-[#171730] border border-indigo-500/20 shadow-xl rounded-2xl">
          <CardContent className="p-5 sm:p-7 space-y-5">
            <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-6 h-6"/> Question Set</h2>
            {/* Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-indigo-200/80">Class</label>
                {mounted && (
                  <Select value={filters.class || ""} onValueChange={(v) => { setPage(1); setFilters({ ...filters, class: v }) }}>
                    <SelectTrigger className="bg:black/20 border-indigo-500/20 focus:ring-2 focus:ring-indigo-500/40"><SelectValue placeholder="All"/></SelectTrigger>
                    <SelectContent>{(options.classes || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <label className="text-xs text-indigo-200/80">Subject</label>
                {mounted && (
                  <Select value={filters.subject || ""} onValueChange={(v) => { setPage(1); setFilters({ ...filters, subject: v }) }}>
                    <SelectTrigger className="bg:black/20 border-indigo-500/20 focus:ring-2 focus:ring-indigo-500/40"><SelectValue placeholder="All"/></SelectTrigger>
                    <SelectContent>{(options.subjects || []).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                )}
              </div>
              <div className={`col-span-2 ${(!filters.class || !filters.subject) ? 'opacity-60 pointer-events-none' : ''}`}>
                <label className="text-xs text-indigo-200/80">Topics</label>
                <div className="flex flex-wrap gap-2 p-3 border border-indigo-500/20 rounded-lg bg-gradient-to-tr from-indigo-500/5 to-fuchsia-500/5">
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
              <div className={`col-span-2 ${(!filters.class || !filters.subject) ? 'opacity-60 pointer-events-none' : ''}`}>
                <label className="text-xs text-indigo-200/80">Type</label>
                <div className="flex flex-wrap gap-2 p-3 border border-indigo-500/20 rounded-lg bg-gradient-to-tr from-indigo-500/5 to-fuchsia-500/5">
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
              <div className="col-span-2 flex items-center gap-3">
                <Input placeholder="Search questions..." value={filters.search || ""} onChange={(e) => { setPage(1); setFilters({ ...filters, search: e.target.value }) }} className="bg-black/20 border-indigo-500/20 focus:ring-2 focus:ring-indigo-500/40"/>
                <Button variant="ghost" onClick={() => { setFilters({ topics: [], types: [] }); setPage(1) }}>Clear</Button>
              </div>
            </div>

            {/* List in its own scroll area */}
            <div className="max-h-[65vh] overflow-y-auto pr-2">
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
            </div>
          </CardContent>
        </Card>

        {/* Right: Paper */}
        <Card className="bg-[#1b1b2d] border border-white/10 shadow-xl rounded-2xl">
          <CardContent className="p-5 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Main Question Paper</h2>
              <Button size="sm" className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600" onClick={exportPDF}><Download className="w-4 h-4 mr-2"/>Export to PDF</Button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto pr-2">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


