"use client"

import { useEffect, useMemo, useState } from "react"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, useDroppable, DragOverlay } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { BookOpen, Download, GripVertical, ChevronDown, ChevronUp } from "lucide-react"
import jsPDF from "jspdf"
import SectionDialog from "@/components/create/SectionDialog"
import QuestionRow from "@/components/create/QuestionRow"
import PaperRow from "@/components/create/PaperRow"
import EditQuestionDialog from "@/components/create/EditQuestionDialog"
import type { Question, PaperItem, Filters } from "./types"

// types moved to app/create/types

// components moved to components/create/*

export default function CreatePage() {
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState<Filters>({ topics: [], types: [] })
  const [details, setDetails] = useState<{ schoolName: string; className: string; topicName: string; date: string; testName: string }>({ schoolName: "", className: "", topicName: "", date: "", testName: "" })
  const [options, setOptions] = useState<{ classes?: string[]; subjects?: string[]; topics?: string[]; types?: string[] }>({ classes: [], subjects: [], topics: [], types: [] })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [paper, setPaper] = useState<PaperItem[]>([])
  const [isSectionOpen, setIsSectionOpen] = useState(false)
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true)
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isEditQuestionOpen, setIsEditQuestionOpen] = useState(false)
  

  useEffect(() => { 
    setMounted(true)
    // Load from localStorage after mounting
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

  useEffect(() => {
    localStorage.setItem("halo.create.filters", JSON.stringify(filters))
  }, [filters])

  useEffect(() => {
    localStorage.setItem("halo.create.details", JSON.stringify(details))
  }, [details])

  // Fetch ALL questions once, then filter/paginate on client
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('Fetching questions from API...')
        const response = await fetch('/api/questions')
        const data = await response.json()
        console.log('API Response:', data)
        
        if (data.questions) {
          const normalized: Question[] = data.questions.map((q: any) => ({
            question_id: q.question_id,
            question_text: q.question_text,
            default_marks: q.default_marks || 1,
            class: q.class || null,
            subject: q.subject || null,
            topic: q.topic || null,
            question_type: q.question_type,
            options: q.options || null,
            left_items: q.left_items || null,
            right_items: q.right_items || null,
            blanks: q.blanks || null,
            question_answer: q.question_answer || null,
            correct_option_id: q.correct_option_id || null,
          }))
          setAllQuestions(normalized)
          setOptions(data.options || { classes: [], subjects: [], topics: [], types: [] })
          console.log('Questions loaded:', normalized.length)
          console.log('Sample question:', normalized[0])
          console.log('Options loaded:', data.options)
        } else {
          console.error('No questions in response:', data)
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
      }
    }
    
    fetchQuestions()
  }, [])

  // Client-side filtering + pagination
  useEffect(() => {
    const matches = (q: Question) => {
      // Filter by class
      if (filters.class && q.class !== filters.class) return false
      
      // Filter by subject
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
    
    console.log('Filtering results:', {
      allQuestions: allQuestions.length,
      filtered: filtered.length,
      filters,
      sampleQuestion: allQuestions[0]
    })
  }, [allQuestions, filters, page])


  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 10)), [total])

  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor))

  const onDragStart = (e?: any) => {
    if (e?.active?.id) setActiveId(String(e.active.id))
    try { document.body.style.overflow = 'hidden' } catch {}
  }

  const { setNodeRef: setPaperDroppable } = useDroppable({ id: 'paper' })

  const onDragEnd = (e: DragEndEvent) => {
    try { document.body.style.overflow = '' } catch {}
    setActiveId(null)
    const id = String(e.active.id)
    const overId = e.over?.id ? String(e.over.id) : undefined
    if (!overId) return
    // Only allow reordering within paper
    if (paper.some(it => it.id === id) && paper.some(it => it.id === overId)) {
      const oldIndex = paper.findIndex(it => it.id === id)
      const newIndex = paper.findIndex(it => it.id === overId)
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) setPaper(prev => arrayMove(prev, oldIndex, newIndex))
    }
  }

  const removeFromPaper = (id: string) => setPaper(prev => prev.filter(it => it.id !== id))

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setIsEditQuestionOpen(true)
  }

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    // Update only the question in the paper - don't affect the original database
    setPaper(prev => prev.map(item => 
      item.kind === 'question' && item.question.question_id === updatedQuestion.question_id
        ? { ...item, question: updatedQuestion }
        : item
    ))
    
    // Don't update allQuestions or database - keep them separate
    setEditingQuestion(null)
    setIsEditQuestionOpen(false)
  }


  const exportPDF = () => {
    const pdf = new jsPDF()
    const margin = 15
    const pageW = pdf.internal.pageSize.getWidth()
    const contentW = pageW - margin * 2
    let y = margin
    const maxMarks = paper.reduce((sum, it) => it.kind === 'question' ? sum + (Number(it.question.default_marks) || 0) : sum, 0)
    // Top details box (compact)
    const boxH = 46
    pdf.setDrawColor(0,0,0); pdf.setLineWidth(0.8); pdf.rect(margin, y, contentW, boxH)
    // Big centered school name
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(22)
    const schoolText = (details.schoolName || '').trim() || 'SCHOOL'
    const schoolW = pdf.getTextWidth(schoolText)
    const schoolX = margin + (contentW - schoolW) / 2
    pdf.text(schoolText, schoolX, y + 10)
    // Divider line under school name
    pdf.setLineWidth(0.6)
    pdf.line(margin + 4, y + 14, margin + contentW - 4, y + 14)
    // Test name just below divider
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(20)
    const testNameText = (details.testName || '').trim() || 'Test Name'
    const tnW = pdf.getTextWidth(testNameText)
    const tnX = margin + (contentW - tnW) / 2
    pdf.text(testNameText, tnX, y + 24)
    // Row with equal spacing
    pdf.setFontSize(12)
    const topicText = `Topic: ${details.topicName || '-'}`
    const classText = `Class: ${details.className || '-'}`
    const dateText = `Date: ${details.date || '-'}`
    const mmText = `Max Marks: ${maxMarks}`
    const cols = 4
    const colW = contentW / cols
    pdf.text(topicText, margin + colW * 0 + 6, y + 34)
    pdf.text(classText, margin + colW * 1 + 6, y + 34)
    pdf.text(dateText,  margin + colW * 2 + 6, y + 34)
    pdf.text(mmText,    margin + colW * 3 + 6, y + 34)
    y += boxH + 10
    pdf.setFontSize(12)
    let qNum = 1
    paper.forEach((it) => {
      if (it.kind === 'section') {
        // Draw a labeled section (no underline)
        pdf.setFont("helvetica", "bold"); pdf.setFontSize(12)
        const txt = it.text || ''
        if (txt) {
          const label = (it.prefix ? it.prefix + ' ' : '') + txt
          pdf.text(label, margin, y)
          y += 5
        }
        if (y > pdf.internal.pageSize.getHeight() - margin) { pdf.addPage(); y = margin }
        // Reset numbering for each section
        qNum = 1
        return
      }
      // Questions not bold
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(12)
      const markText = `[${it.question.default_marks}]`
      const markW = pdf.getTextWidth(markText)
      const indent = 10
      const availableW = contentW - markW - 8 - indent
      const qText = `${qNum}. ${it.question.question_text}`
      const lines = pdf.splitTextToSize(qText, availableW)
      const lineHeight = 5.5
      // equal padding above and below each question block
      const questionTopGap = 2
      // top padding before question
      y += questionTopGap
      // render with left indent so numbers have padding
      pdf.text(lines, margin + indent, y)
      const lastLineY = y + (lines.length - 1) * lineHeight
      pdf.text(markText, margin + contentW - markW, lastLineY)
      y += lines.length * lineHeight

      // Uniform compact spacing after question
      const questionToOptionsGap = 1

      // MCQ options in compact inline text
      if (String(it.question.question_type).toLowerCase() === 'multiple_choice' && it.question.options) {
        pdf.setFontSize(10)
        const opts = it.question.options
        const optionPairs = Object.keys(opts).sort().map(k => `${k}) ${opts[k]}`)
        const optionsLine = optionPairs.join('    ')
        const optLines = pdf.splitTextToSize(optionsLine, availableW)
        const optLineHeight = 3.8
        pdf.text(optLines, margin + indent + 4, y + questionToOptionsGap)
        y += questionToOptionsGap + optLines.length * optLineHeight
        // bottom padding after options
        y += questionTopGap
        pdf.setFontSize(12)
      } else if (String(it.question.question_type).toLowerCase() === 'match_pairs' && (it.question.left_items || it.question.right_items)) {
        // Match-the-pairs: draw two columns with consistent gap
        pdf.setFontSize(10)
        const left = it.question.left_items || []
        const right = it.question.right_items || []
        const n = Math.max(left.length, right.length)

        const leftTexts = Array.from({ length: n }, (_, i) => left[i] ? `${String.fromCharCode(65 + i)}) ${left[i]}` : '')
        const rightTexts = Array.from({ length: n }, (_, i) => right[i] ? `${i + 1}) ${right[i]}` : '')

        // Measure max left width to align right column
        const xLeft = margin + indent + 4
        const leftWidths = leftTexts.map(t => pdf.getTextWidth(t))
        const leftMaxW = Math.max(0, ...leftWidths)
        const colGap = 12
        const xRight = xLeft + leftMaxW + colGap
        const rowHeight = 4.2

        let yy = y + questionToOptionsGap
        for (let i = 0; i < n; i++) {
          if (leftTexts[i]) pdf.text(leftTexts[i], xLeft, yy)
          if (rightTexts[i]) pdf.text(rightTexts[i], xRight, yy)
          yy += rowHeight
        }
        y = yy
        y += questionTopGap
        pdf.setFontSize(12)
      } else {
        // bottom padding after non-MCQ question
        y += questionTopGap
      }
      if (y > pdf.internal.pageSize.getHeight() - margin) { pdf.addPage(); y = margin }
      qNum += 1
    })
    pdf.save("question_paper.pdf")
  }

  return (
    <main className="container mx-auto px-1 py-1 max-w-7xl space-y-1 text-white bg-black">
      {/* Collapsible Details header */}
      <Card className="bg-gray-900 border border-gray-700 shadow-sm rounded-lg">
        <CardContent className="p-1">
          <div className="w-full">
            <Button 
              variant="ghost" 
              onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
              className="w-full justify-between p-1 h-auto text-left hover:bg-gray-800"
            >
              <span className="text-sm font-medium text-white">Main Details</span>
              {isDetailsCollapsed ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronUp className="w-4 h-4 text-white" />}
            </Button>
          </div>
          {!isDetailsCollapsed && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end mt-1">
              <div>
                <label className="text-xs text-gray-300">School Name</label>
                <Input value={details.schoolName} onChange={(e) => setDetails(d => ({ ...d, schoolName: e.target.value }))} placeholder="e.g., Springdale High" className="mt-1 h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40"/>
              </div>
              <div>
                <label className="text-xs text-gray-300">Class</label>
                <Input value={details.className} onChange={(e) => setDetails(d => ({ ...d, className: e.target.value }))} placeholder="e.g., 7th Grade" className="mt-1 h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40"/>
              </div>
              <div>
                <label className="text-xs text-gray-300">Topic</label>
                <Input value={details.topicName} onChange={(e) => setDetails(d => ({ ...d, topicName: e.target.value }))} placeholder="e.g., Biology" className="mt-1 h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40"/>
              </div>
              <div>
                <label className="text-xs text-gray-300">Date</label>
                <Input value={details.date} onChange={(e) => setDetails(d => ({ ...d, date: e.target.value }))} placeholder="e.g., 2025-09-23" className="mt-1 h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40"/>
              </div>
              <div>
                <label className="text-xs text-gray-300">Test Name</label>
                <Input value={details.testName} onChange={(e) => setDetails(d => ({ ...d, testName: e.target.value }))} placeholder="e.g., Mid Term Examination" className="mt-1 h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40"/>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-[80vh]">
        {/* Left: Question Set - always visible */}
        <Card className="bg-gray-900 border border-gray-700 shadow-sm rounded-lg flex flex-col">
          <CardContent className="p-2 space-y-2 flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-1 text-white"><BookOpen className="w-4 h-4"/> Question Set</h2>
              <Button 
                variant="ghost" 
                onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                className="p-1 h-auto hover:bg-gray-800"
              >
                {isFiltersCollapsed ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronUp className="w-4 h-4 text-white" />}
              </Button>
            </div>
            
            {/* Collapsible Filters */}
            {!isFiltersCollapsed && (
              <div className="space-y-2">
                {/* Filters Label */}
                <div className="text-sm font-medium text-white">Filters</div>
                
                {/* Compact horizontal filter row */}
                <div className="flex items-end gap-2 flex-wrap">
                  <div className="flex-shrink-0">
                    <label className="text-xs text-gray-300">Class</label>
                    <Select value={filters.class || ""} onValueChange={(v) => { setPage(1); setFilters({ ...filters, class: v === "All" ? undefined : v }) }}>
                      <SelectTrigger className="h-7 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40 w-24"><SelectValue placeholder="All"/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {(options.classes || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-shrink-0">
                    <label className="text-xs text-gray-300">Subject</label>
                    <Select value={filters.subject || ""} onValueChange={(v) => { setPage(1); setFilters({ ...filters, subject: v === "All" ? undefined : v }) }}>
                      <SelectTrigger className="h-7 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40 w-24"><SelectValue placeholder="All"/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {(options.subjects || []).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-shrink-0">
                    <label className="text-xs text-gray-300">Search</label>
                    <Input placeholder="Search questions..." value={filters.search || ""} onChange={(e) => { setPage(1); setFilters({ ...filters, search: e.target.value }) }} className="h-7 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40 w-24"/>
                  </div>
                  <div className="flex-shrink-0">
                    <Button variant="ghost" onClick={() => { setFilters({ topics: [], types: [] }); setPage(1) }} className="h-7 px-2 text-xs hover:bg-gray-800">Clear</Button>
                  </div>
                </div>
                
                {/* Topics and Types - show placeholder when not selected */}
                <div className="space-y-1">
                  <div>
                    <label className="text-xs text-gray-300">Topics</label>
                    <div className="flex flex-wrap gap-1 p-1 border border-gray-600 rounded bg-gray-800">
                      {(filters.class && filters.subject) ? (
                        (options.topics || []).map(t => (
                          <label key={t} className="flex items-center gap-1 text-xs text-gray-300">
                            <Checkbox checked={filters.topics.includes(t)} onCheckedChange={(ck) => {
                              setPage(1)
                              setFilters(prev => ({ ...prev, topics: ck ? [...prev.topics, t] : prev.topics.filter(x => x !== t) }))
                            }}/>
                            {t}
                          </label>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500 italic">First select class and subject to show topics</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-300">Type</label>
                    <div className="flex flex-wrap gap-1 p-1 border border-gray-600 rounded bg-gray-800">
                      {(filters.class && filters.subject) ? (
                        (options.types || []).map(tp => (
                          <label key={tp} className="flex items-center gap-1 text-xs text-gray-300">
                            <Checkbox checked={filters.types.includes(tp)} onCheckedChange={(ck) => {
                              setPage(1)
                              setFilters(prev => ({ ...prev, types: ck ? [...prev.types, tp] : prev.types.filter(x => x !== tp) }))
                            }}/>
                            {tp}
                          </label>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500 italic">First select class and subject to show types</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                          // Create an independent copy of the question with a new unique ID
                          const questionCopy: Question = {
                            ...qq,
                            question_id: `paper_${qq.question_id}_${Date.now()}`, // Unique ID for paper copy
                            // Keep all other properties as copies
                          }
                          setPaper(prev => [...prev, { kind: 'question', id: questionCopy.question_id, question: questionCopy }])
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
              {allQuestions.length === 0 && (
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-2">No questions in database yet</div>
                  <div className="text-xs text-blue-400">Questions will appear here once loaded</div>
                </div>
              )}
            </div>
          </div>
        )}
            
            {/* Pagination at bottom - only show when Class and Subject are selected */}
            {(filters.class && filters.subject) && (
              <div className="flex items-center justify-between pt-1 flex-shrink-0">
                <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-7 px-2 text-xs border-gray-600 text-white hover:bg-gray-800">Prev</Button>
                  <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-7 px-2 text-xs border-gray-600 text-white hover:bg-gray-800">Next</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Paper */}
        <Card className="bg-gray-900 border border-gray-700 shadow-sm rounded-lg flex flex-col">
          <CardContent className="p-2 space-y-2 flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between gap-2 flex-shrink-0">
              <h2 className="text-lg font-bold text-white">Main Question Paper</h2>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" onClick={() => { setIsSectionOpen(true) }} className="h-7 px-2 text-xs border-gray-600 text-white hover:bg-gray-800">Add Section</Button>
                <Button size="sm" className="rounded bg-blue-600 hover:bg-blue-700 text-white h-7 px-2 text-xs" onClick={exportPDF}><Download className="w-3 h-3 mr-1"/>Export PDF</Button>
              </div>
            </div>
            <SectionDialog open={isSectionOpen} onOpenChange={setIsSectionOpen} onSubmit={({ text, prefix }) => setPaper(prev => [...prev, { kind: 'section', id: `sec_${Date.now()}`, text, prefix }])} />
            <EditQuestionDialog 
              open={isEditQuestionOpen} 
              onOpenChange={setIsEditQuestionOpen} 
              question={editingQuestion} 
              onSubmit={handleUpdateQuestion} 
            />
            <div ref={setPaperDroppable} className="flex-1 overflow-y-auto overflow-x-hidden pr-1 min-h-0">
              <SortableContext items={paper.map(it => it.id)} strategy={verticalListSortingStrategy}>
                <div className={`min-h-[150px] rounded border ${paper.length ? "border-gray-700" : "border-dashed border-gray-600"} p-2 space-y-1`}>
                  {paper.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm">Drag questions here</div>
                  ) : (
                    paper.map((it) => (
                      <PaperRow key={it.id} item={it} onRemove={removeFromPaper} onEditQuestion={handleEditQuestion} />
                    ))
                  )}
                </div>
              </SortableContext>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Drag overlay for sorting within paper */}
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          (() => {
            const it = paper.find(x => x.id === activeId)
            if (!it) return null
            return it.kind === 'section' ? (
              <div className="flex items-center gap-2 p-2 rounded border bg-gray-900 border-gray-700 shadow-2xl scale-[1.02]">
                <div className="p-1"><GripVertical className="w-3 h-3 text-gray-400" /></div>
                <div className="flex-1 flex items-center gap-1">
                  {it.prefix ? <span className="text-xs text-gray-300 whitespace-nowrap">{it.prefix}</span> : null}
                  <div className="w-full text-center text-xs text-gray-300">{it.text || 'Section'}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-2 rounded border bg-gray-900 border-gray-700 shadow-2xl scale-[1.02]">
                <div className="p-1"><GripVertical className="w-3 h-3 text-gray-400" /></div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-medium text-xs text-white">{it.question.question_text}</p>
                    <Badge variant="secondary" className="bg-blue-600 text-white border-0 text-xs px-1 py-0">{it.question.default_marks}m</Badge>
                  </div>
                  <div className="flex gap-1 flex-wrap text-xs">
                    <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{it.question.subject}</Badge>
                    <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{it.question.topic}</Badge>
                    <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{it.question.class}</Badge>
                    <Badge variant="outline" className="rounded border-gray-600 text-gray-300 text-xs px-1 py-0">{it.question.question_type}</Badge>
                  </div>
                </div>
              </div>
            )
          })()
        ) : null}
      </DragOverlay>
      </DndContext>
    </main>
  )
}


