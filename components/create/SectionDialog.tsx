"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function SectionDialog({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (v: boolean) => void; onSubmit: (data: { text: string; prefix: string }) => void }) {
  const [text, setText] = useState("")
  const [prefix, setPrefix] = useState("")
  const [preset, setPreset] = useState("custom")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const presets = [
    { value: 'fill', label: 'Fill in the blanks', text: 'Fill in the blanks' },
    { value: 'match', label: 'Match the pairs', text: 'Match the pairs' },
    { value: 'solve', label: 'Solve the following', text: 'Solve the following' },
    { value: 'custom', label: 'Custom', text: '' },
  ]

  const applyPreset = (v: string) => {
    setPreset(v)
    const p = presets.find(x => x.value === v)
    setText(p?.text || "")
  }

  const handleSubmit = () => {
    try {
      onSubmit({ text: text.trim(), prefix: prefix.trim() })
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting section:', error)
    }
  }

  const handleClose = () => {
    try {
      onOpenChange(false)
    } catch (error) {
      console.error('Error closing dialog:', error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-sm">Add Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 items-end">
            <div>
              <Label htmlFor="sectionPrefix" className="text-gray-300 text-xs">Prefix</Label>
              <Input 
                id="sectionPrefix" 
                value={prefix} 
                onChange={(e) => setPrefix(e.target.value)} 
                placeholder="e.g., 1A)" 
                className="h-8 text-xs bg-gray-800 border-gray-600 text-white" 
              />
            </div>
            <div className="col-span-2">
              <Label className="text-gray-300 text-xs">Preset</Label>
              <Select value={preset} onValueChange={applyPreset}>
                <SelectTrigger className="mt-1 h-8 text-xs bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Choose preset" />
                </SelectTrigger>
                <SelectContent>
                  {presets.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="sectionText" className="text-gray-300 text-xs">Section title</Label>
            <Input 
              id="sectionText" 
              value={text} 
              onChange={(e) => { setText(e.target.value); setPreset('custom') }} 
              placeholder="e.g., Fill in the blanks" 
              className="h-8 text-xs bg-gray-800 border-gray-600 text-white" 
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={handleClose} 
            className="h-7 px-2 text-xs hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-2 text-xs"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


