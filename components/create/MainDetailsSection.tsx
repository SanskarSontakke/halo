"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp } from "lucide-react"

interface MainDetailsSectionProps {
  details: {
    schoolName: string
    className: string
    topicName: string
    date: string
    testName: string
  }
  onDetailsChange: (details: any) => void
}

export default function MainDetailsSection({ details, onDetailsChange }: MainDetailsSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-0">
        <div 
          className="flex items-center justify-between cursor-pointer px-2 py-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="text-sm font-medium text-white">Main Details</span>
          {isCollapsed ? <ChevronDown className="h-0 w-4 text-gray-400" /> : <ChevronUp className="h-0 w-4 text-gray-400" />}
        </div>
        
        {!isCollapsed && (
          <div className="grid grid-cols-5 gap-2 px-2 pb-0">
            <div>
              <label className="text-xs text-gray-300">School Name</label>
              <Input 
                value={details.schoolName} 
                onChange={(e) => onDetailsChange({ ...details, schoolName: e.target.value })} 
                placeholder="e.g., Springdale High" 
                className="mt-1 h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Class</label>
              <Input 
                value={details.className} 
                onChange={(e) => onDetailsChange({ ...details, className: e.target.value })} 
                placeholder="e.g., 7th Grade" 
                className="mt-1 h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Topic</label>
              <Input 
                value={details.topicName} 
                onChange={(e) => onDetailsChange({ ...details, topicName: e.target.value })} 
                placeholder="e.g., Biology" 
                className="mt-1 h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Date</label>
              <Input 
                value={details.date} 
                onChange={(e) => onDetailsChange({ ...details, date: e.target.value })} 
                placeholder="e.g., 12/03/2025" 
                className="mt-1 h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="text-xs text-gray-300">Test Name</label>
              <Input 
                value={details.testName} 
                onChange={(e) => onDetailsChange({ ...details, testName: e.target.value })} 
                placeholder="e.g., Mid-term Exam" 
                className="mt-1 h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
