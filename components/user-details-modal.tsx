"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ExamDetails } from "@/components/exam-creator"

interface UserDetailsModalProps {
  onSubmit: (details: ExamDetails) => void
  initialData?: ExamDetails
}

export function UserDetailsModal({ onSubmit, initialData }: UserDetailsModalProps) {
  const [formData, setFormData] = useState<ExamDetails>(initialData || {
    schoolName: "",
    examName: "",
    examDate: "",
    subject: "",
    topic: "",
    totalMarks: 100,
    class: "",
    time: "3",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store in localStorage for future use
    localStorage.setItem("halo-exam-details", JSON.stringify(formData))
    onSubmit(formData)
  }

  const handleChange = (field: keyof ExamDetails, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gradient">Setup Your Exam</CardTitle>
          <p className="text-muted-foreground">Configure your exam paper details</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  value={formData.schoolName}
                  onChange={(e) => handleChange("schoolName", e.target.value)}
                  placeholder="Enter school name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examName">Exam Name</Label>
                <Input
                  id="examName"
                  value={formData.examName}
                  onChange={(e) => handleChange("examName", e.target.value)}
                  placeholder="e.g., Mid-term Examination"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examDate">Exam Date</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => handleChange("examDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) => handleChange("class", e.target.value)}
                  placeholder="e.g., 10th Grade"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => handleChange("topic", e.target.value)}
                  placeholder="e.g., Algebra"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => handleChange("totalMarks", Number.parseInt(e.target.value) || 0)}
                  placeholder="100"
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time (hours)</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  placeholder="3"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 animate-glow-pulse"
              size="lg"
            >
              Create Exam Paper
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
