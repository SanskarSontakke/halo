import jsPDF from "jspdf"
import type { Question, ExamDetails } from "@/components/exam-creator"

export function generateExamPDF(examDetails: ExamDetails, questions: Question[]) {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15 // Reduced margin to save space
  const contentWidth = pageWidth - 2 * margin
  let currentY = margin

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
    pdf.setFontSize(fontSize)
    const lines = pdf.splitTextToSize(text, maxWidth)
    pdf.text(lines, x, y)
    return y + lines.length * fontSize * 0.35 // Reduced line spacing
  }

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - margin) {
      pdf.addPage()
      currentY = margin
      return true
    }
    return false
  }

  pdf.setDrawColor(0, 0, 0)
  pdf.setLineWidth(0.8)
  pdf.rect(margin, currentY, contentWidth, 32) // Slightly taller header box for better proportions

  // Header content inside box with improved spacing
  pdf.setFontSize(16)
  pdf.setFont("helvetica", "bold")
  // Center the school name
  const schoolNameWidth = pdf.getTextWidth(examDetails.schoolName)
  const schoolNameX = margin + (contentWidth - schoolNameWidth) / 2
  pdf.text(examDetails.schoolName, schoolNameX, currentY + 10)

  // Add a subtle line under school name
  pdf.setLineWidth(0.3)
  pdf.line(margin + 20, currentY + 13, pageWidth - margin - 20, currentY + 13)

  pdf.setFontSize(9)
  pdf.setFont("helvetica", "normal")
  const headerLine1 = `${examDetails.examName} | Subject: ${examDetails.subject} | Topic: ${examDetails.topic}`
  const headerLine2 = `Date: ${new Date(examDetails.examDate).toLocaleDateString()} | Class: ${examDetails.class} | Total Marks: ${examDetails.totalMarks} | Time: ${examDetails.time} hours`

  // Center align the exam details
  const line1Width = pdf.getTextWidth(headerLine1)
  const line2Width = pdf.getTextWidth(headerLine2)
  const line1X = margin + (contentWidth - line1Width) / 2
  const line2X = margin + (contentWidth - line2Width) / 2

  pdf.text(headerLine1, line1X, currentY + 20)
  pdf.text(headerLine2, line2X, currentY + 27)

  currentY += 37 // Adjusted spacing after header

  // Questions
  questions.forEach((question, index) => {
    // Check if we need space for the question (estimate)
    const estimatedSpace = question.question_type === "MCQ" ? 25 : 20
    checkNewPage(estimatedSpace)

    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(10)
    const questionHeader = `Q${index + 1}. (${question.default_marks} marks) ${question.question_text}`
    currentY = addWrappedText(questionHeader, margin, currentY, contentWidth, 10)
    currentY += 3 // Reduced spacing

    pdf.setFont("helvetica", "normal")

    // Handle different question types
    if (question.question_type === "MCQ" && question.options) {
      const optionsText = question.options.map((option) => `${option.id.toUpperCase()}) ${option.text}`).join("  ")
      currentY = addWrappedText(optionsText, margin + 5, currentY, contentWidth - 5, 9)
      currentY += 8
    } else if (question.question_type === "True/False") {
      pdf.text("True ☐  False ☐", margin + 5, currentY)
      currentY += 10
    } else {
      currentY += 5
    }

    currentY += 5 // Reduced space between questions
  })

  checkNewPage(15)
  currentY = Math.max(currentY, pageHeight - 25)

  pdf.setDrawColor(0, 0, 0)
  pdf.line(margin, currentY, pageWidth - margin, currentY)
  currentY += 8

  pdf.setFontSize(9)
  pdf.text(
    `Total Questions: ${questions.length}  Total Marks: ${questions.reduce((sum, q) => sum + q.default_marks, 0)}`,
    margin,
    currentY,
  )

  // Generate filename
  const filename = `${examDetails.examName.replace(/\s+/g, "_")}_${examDetails.subject.replace(/\s+/g, "_")}.pdf`

  // Save the PDF
  pdf.save(filename)
}
