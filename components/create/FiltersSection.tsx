"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { Filters } from "@/app/create/types"

interface FiltersSectionProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onPageChange: (page: number) => void
  availableClassesForSubject: string[]
  availableSubjects: string[]
  filteredTopics: string[]
  filteredTypes: string[]
}

export default function FiltersSection({
  filters,
  onFiltersChange,
  onPageChange,
  availableClassesForSubject,
  availableSubjects,
  filteredTopics,
  filteredTypes
}: FiltersSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-1">
        <div 
          className="flex items-center justify-between cursor-pointer p-1"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="text-sm font-medium text-white">Filters</span>
          {isCollapsed ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronUp className="h-4 w-4 text-gray-400" />}
        </div>
        
        {!isCollapsed && (
          <div className="space-y-2">
            {/* Compact horizontal filter row - 25% width each */}
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-xs text-gray-300">Class</label>
                <Select value={filters.class || ""} onValueChange={(v) => { onPageChange(1); onFiltersChange({ ...filters, class: v === "All" ? undefined : v }) }}>
                  <SelectTrigger className="h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40 w-full"><SelectValue placeholder="All"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {availableClassesForSubject.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-300">Subject</label>
                <Select value={filters.subject || ""} onValueChange={(v) => { onPageChange(1); onFiltersChange({ ...filters, subject: v === "All" ? undefined : v }) }}>
                  <SelectTrigger className="h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40 w-full"><SelectValue placeholder="All"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {availableSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-300">Search</label>
                <Input 
                  placeholder="Search questions..." 
                  value={filters.search || ""} 
                  onChange={(e) => { onPageChange(1); onFiltersChange({ ...filters, search: e.target.value }) }} 
                  className="h-8 text-xs bg-gray-800 border-gray-600 text-white focus:ring-1 focus:ring-blue-500/40 w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 opacity-0">Clear</label>
                <Button 
                  variant="ghost" 
                  onClick={() => { onFiltersChange({ topics: [], types: [] }); onPageChange(1) }} 
                  className="h-8 px-3 text-xs hover:bg-gray-800 w-full"
                >
                  Clear
                </Button>
              </div>
            </div>
            
            {/* Topics and Types - horizontal layout */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-300 whitespace-nowrap">Topics:</label>
                <div className="flex flex-wrap gap-1 p-1 border border-gray-600 rounded bg-gray-800 flex-1">
                  {(filters.class && filters.subject) ? (
                    filteredTopics.length > 0 ? (
                      filteredTopics.map(t => (
                        <label key={t} className="flex items-center gap-1 text-xs text-gray-300">
                          <Checkbox 
                            checked={filters.topics.includes(t)} 
                            onCheckedChange={(ck) => {
                              onPageChange(1)
                              onFiltersChange({ 
                                ...filters, 
                                topics: ck ? [...filters.topics, t] : filters.topics.filter(x => x !== t) 
                              })
                            }}
                          />
                          {t}
                        </label>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500 italic">No topics available for this class and subject</div>
                    )
                  ) : (
                    <div className="text-xs text-gray-500 italic">First select class and subject to show topics</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-300 whitespace-nowrap">Type:</label>
                <div className="flex flex-wrap gap-1 p-1 border border-gray-600 rounded bg-gray-800 flex-1">
                  {(filters.class && filters.subject) ? (
                    filteredTypes.length > 0 ? (
                      filteredTypes.map(tp => (
                        <label key={tp} className="flex items-center gap-1 text-xs text-gray-300">
                          <Checkbox 
                            checked={filters.types.includes(tp)} 
                            onCheckedChange={(ck) => {
                              onPageChange(1)
                              onFiltersChange({ 
                                ...filters, 
                                types: ck ? [...filters.types, tp] : filters.types.filter(x => x !== tp) 
                              })
                            }}
                          />
                          {tp}
                        </label>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500 italic">No question types available for this class and subject</div>
                    )
                  ) : (
                    <div className="text-xs text-gray-500 italic">First select class and subject to show types</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
