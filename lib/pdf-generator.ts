import jsPDF from "jspdf"
import type { PaperItem } from "@/app/create/types"

interface PDFDetails {
  schoolName: string
  className: string
  topicName: string
  date: string
  testName: string
}

export const generateQuestionPaperPDF = (paper: PaperItem[], details: PDFDetails) => {
  const pdf = new jsPDF()
  
  // Page setup - reduced margins for more compact layout
  const pageW = pdf.internal.pageSize.getWidth()
  const margin = 8
  const contentW = pageW - 2 * margin
  const maxMarks = paper.reduce((sum, it) => it.kind === 'question' ? sum + (Number(it.question.default_marks) || 0) : sum, 0)

  // Header - school name inside a full-width box with minimal top spacing
  pdf.setFontSize(16)
  const schoolText = (details.schoolName || '').trim() || 'SCHOOL'
  const schoolW = pdf.getTextWidth(schoolText)
  const schoolBoxH = 10
  const schoolBoxX = margin
  const schoolBoxY = 8
  // Draw full-width box and then centered text
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.5)
  pdf.rect(schoolBoxX, schoolBoxY, contentW, schoolBoxH)
  const schoolTextX = margin + (contentW - schoolW) / 2
  const schoolTextY = schoolBoxY + 7
  pdf.text(schoolText, schoolTextX, schoolTextY)

  // Test name in its own full-width box directly beneath
  pdf.setFontSize(14)
  const testNameText = (details.testName || '').trim() || 'Test Name'
  const tnW = pdf.getTextWidth(testNameText)
  const testBoxH = 10
  const testBoxX = margin
  const testBoxY = schoolBoxY + schoolBoxH + 2
  pdf.rect(testBoxX, testBoxY, contentW, testBoxH)
  const tnX = margin + (contentW - tnW) / 2
  const tnY = testBoxY + 7
  pdf.text(testNameText, tnX, tnY)

  // Details row with box around it
  pdf.setFontSize(12)
  const topicText = `Topic: ${details.topicName || '-'}`
  const classText = `Class: ${details.className || '-'}`
  const dateText = `Date: ${details.date || '-'}`
  const mmText = `Max Marks: ${maxMarks}`
  const cols = 4
  const colW = contentW / cols
  
  // Draw box around details just below the test box
  const boxY = testBoxY + testBoxH + 3
  const boxHeight = 12
  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.5)
  pdf.rect(margin, boxY, contentW, boxHeight)
  
  // Add details text inside the box
  pdf.text(topicText, margin + 2, boxY + 7)
  pdf.text(classText, margin + colW + 2, boxY + 7)
  pdf.text(dateText, margin + 2 * colW + 2, boxY + 7)
  pdf.text(mmText, margin + 3 * colW + 2, boxY + 7)

  // Questions - start closer to details box
  let y = boxY + boxHeight + 5
  let qNum = 1
  const lineHeight = 4.5
  const questionTopGap = 1
  const indent = 8

  paper.forEach(it => {
    if (y > pdf.internal.pageSize.getHeight() - margin) { pdf.addPage(); y = margin }

    if (it.kind === 'section') {
      // Section header
      pdf.setFontSize(12)
      const txt = it.text
      const label = (it.prefix ? it.prefix + ' ' : '') + txt
      pdf.text(label, margin, y)
      y += lineHeight + 0.5
      return
    }

    // Question
    pdf.setFontSize(12)
    const qText = `${qNum}. ${it.question.question_text}`
    const markText = `[${it.question.default_marks || 0}]`
    const markW = pdf.getTextWidth(markText)
    const availableW = contentW - markW - indent - 4

    const lines = pdf.splitTextToSize(qText, availableW)
    pdf.text(lines, margin + indent, y)
    const lastLineY = y + (lines.length - 1) * lineHeight
    pdf.text(markText, margin + contentW - markW, lastLineY)
    y += lines.length * lineHeight

    // Uniform compact spacing after question
    const questionToOptionsGap = 0.5

    // MCQ options in compact inline text
    if (String(it.question.question_type).toLowerCase() === 'multiple_choice' && it.question.options) {
      pdf.setFontSize(10)
      const opts = it.question.options
      const optionPairs = Object.keys(opts).sort().map(k => `${k}) ${opts[k]}`)
      const optionsLine = optionPairs.join('    ')
      const optLines = pdf.splitTextToSize(optionsLine, availableW)
      const optLineHeight = 3.5
      pdf.text(optLines, margin + indent + 4, y + questionToOptionsGap)
      y += questionToOptionsGap + optLines.length * optLineHeight
      // bottom padding after options
      y += 0.5
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
      const rowHeight = 3.8

      let yy = y + questionToOptionsGap
      for (let i = 0; i < n; i++) {
        if (leftTexts[i]) pdf.text(leftTexts[i], xLeft, yy)
        if (rightTexts[i]) pdf.text(rightTexts[i], xRight, yy)
        yy += rowHeight
      }
      y = yy
      y += 0.5
      pdf.setFontSize(12)
    } else if (String(it.question.question_type).toLowerCase() === 'long_answer' || 
               String(it.question.question_type).toLowerCase() === 'write_reasons') {
      // Long answer and write reasons questions - add space for answer
      y += questionToOptionsGap + 6 // Extra space for long answers
    } else {
      // bottom padding after other question types
      y += questionToOptionsGap
    }
    if (y > pdf.internal.pageSize.getHeight() - margin) { pdf.addPage(); y = margin }
    qNum += 1
  })
  
  pdf.save("question_paper.pdf")
}