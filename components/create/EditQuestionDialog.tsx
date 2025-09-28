"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Question } from "@/app/create/types"

interface EditQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: Question | null
  onSubmit: (updatedQuestion: Question) => void
}

export default function EditQuestionDialog({ open, onOpenChange, question, onSubmit }: EditQuestionDialogProps) {
  const [formData, setFormData] = useState<Partial<Question>>({})
  const [leftItems, setLeftItems] = useState<string[]>([])
  const [rightItems, setRightItems] = useState<string[]>([])
  const [newLeftItem, setNewLeftItem] = useState("")
  const [newRightItem, setNewRightItem] = useState("")
  const [newPairLeft, setNewPairLeft] = useState("")
  const [newPairRight, setNewPairRight] = useState("")
  const [newSubpart, setNewSubpart] = useState("")

  useEffect(() => {
    if (question) {
      setFormData(question)
      setLeftItems(question.left_items || [])
      setRightItems(question.right_items || [])
    }
  }, [question])

  const handleSubmit = () => {
    if (!question) return
    
    const updatedQuestion: Question = {
      ...question,
      ...formData,
      left_items: leftItems,
      right_items: rightItems,
      subparts: (formData.subparts as string[] | undefined) || null,
    } as Question
    
    onSubmit(updatedQuestion)
    onOpenChange(false)
  }

  const addLeftItem = () => {
    if (newLeftItem.trim()) {
      setLeftItems([...leftItems, newLeftItem.trim()])
      setNewLeftItem("")
    }
  }

  const addRightItem = () => {
    if (newRightItem.trim()) {
      setRightItems([...rightItems, newRightItem.trim()])
      setNewRightItem("")
    }
  }

  const addPair = () => {
    if (newPairLeft.trim() && newPairRight.trim()) {
      setLeftItems([...leftItems, newPairLeft.trim()])
      setRightItems([...rightItems, newPairRight.trim()])
      setNewPairLeft("")
      setNewPairRight("")
    }
  }

  const removeLeftItem = (index: number) => {
    setLeftItems(leftItems.filter((_, i) => i !== index))
  }

  const removeRightItem = (index: number) => {
    setRightItems(rightItems.filter((_, i) => i !== index))
  }

  const addSubpart = () => {
    if (newSubpart.trim()) {
      const list = [...(formData.subparts || []) as string[], newSubpart.trim()]
      setFormData({ ...formData, subparts: list })
      setNewSubpart("")
    }
  }

  const removeSubpart = (index: number) => {
    const list = (formData.subparts || []) as string[]
    const next = list.filter((_, i) => i !== index)
    setFormData({ ...formData, subparts: next })
  }

  if (!question) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">Edit Question</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Basic Question Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="questionText" className="text-gray-300 text-sm">Question Text</Label>
              <Textarea 
                id="questionText"
                value={formData.question_text || ""} 
                onChange={(e) => setFormData({...formData, question_text: e.target.value})} 
                className="mt-1 h-20 text-sm bg-gray-800 border-gray-600 text-white"
                placeholder="Enter question text..."
              />
            </div>
            <div>
              <Label htmlFor="marks" className="text-gray-300 text-sm">Marks</Label>
              <Input 
                id="marks"
                type="number" 
                value={formData.default_marks || ""} 
                onChange={(e) => setFormData({...formData, default_marks: parseInt(e.target.value) || 0})} 
                className="mt-1 h-8 text-sm bg-gray-800 border-gray-600 text-white"
                placeholder="Enter marks"
              />
            </div>
          </div>

          {/* MCQ Options */}
          {formData.question_type === 'multiple_choice' && (
            <div>
              <Label className="text-gray-300 text-sm">MCQ Options</Label>
              <div className="mt-1 space-y-2">
                {formData.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm w-6">{String.fromCharCode(65 + index)})</span>
                    <Input 
                      value={option} 
                      onChange={(e) => {
                        const newOptions = [...(formData.options || [])]
                        newOptions[index] = e.target.value
                        setFormData({...formData, options: newOptions})
                      }}
                      className="h-8 text-sm bg-gray-800 border-gray-600 text-white"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        const newOptions = formData.options?.filter((_, i) => i !== index) || []
                        setFormData({...formData, options: newOptions})
                      }}
                      className="h-8 px-2 text-xs hover:bg-gray-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    const newOptions = [...(formData.options || []), ""]
                    setFormData({...formData, options: newOptions})
                  }}
                  className="h-8 px-2 text-xs border-gray-600 text-white hover:bg-gray-800"
                >
                  Add Option
                </Button>
              </div>
            </div>
          )}

          {/* Match Pairs Items */}
          {formData.question_type === 'match_pairs' && (
            <div className="space-y-4">
              {/* Add New Pair */}
              <div>
                <Label className="text-gray-300 text-sm">Add New Pair</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input 
                    value={newPairLeft} 
                    onChange={(e) => setNewPairLeft(e.target.value)}
                    placeholder="Left item (A, B, C...)"
                    className="h-8 text-sm bg-gray-800 border-gray-600 text-white"
                  />
                  <Input 
                    value={newPairRight} 
                    onChange={(e) => setNewPairRight(e.target.value)}
                    placeholder="Right item (1, 2, 3...)"
                    className="h-8 text-sm bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={addPair}
                  className="mt-2 h-8 px-2 text-xs border-gray-600 text-white hover:bg-gray-800"
                >
                  Add Pair
                </Button>
              </div>

              {/* Existing Pairs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300 text-sm">Left Items (A, B, C...)</Label>
                  <div className="mt-1 space-y-2">
                    {leftItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-6">{String.fromCharCode(65 + index)})</span>
                        <Input 
                          value={item} 
                          onChange={(e) => {
                            const newItems = [...leftItems]
                            newItems[index] = e.target.value
                            setLeftItems(newItems)
                          }}
                          className="h-8 text-sm bg-gray-800 border-gray-600 text-white"
                        />
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeLeftItem(index)}
                          className="h-8 px-2 text-xs hover:bg-gray-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300 text-sm">Right Items (1, 2, 3...)</Label>
                  <div className="mt-1 space-y-2">
                    {rightItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-6">{index + 1})</span>
                        <Input 
                          value={item} 
                          onChange={(e) => {
                            const newItems = [...rightItems]
                            newItems[index] = e.target.value
                            setRightItems(newItems)
                          }}
                          className="h-8 text-sm bg-gray-800 border-gray-600 text-white"
                        />
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeRightItem(index)}
                          className="h-8 px-2 text-xs hover:bg-gray-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Multi-part (subparts) */}
          {formData.question_type === 'multi_part' && (
            <div>
              <Label className="text-gray-300 text-sm">Subparts</Label>
              <div className="mt-1 space-y-2">
                {(formData.subparts || []).map((sp, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm w-6">{String.fromCharCode(97 + index)})</span>
                    <Input 
                      value={sp} 
                      onChange={(e) => {
                        const list = [...(formData.subparts || []) as string[]]
                        list[index] = e.target.value
                        setFormData({ ...formData, subparts: list })
                      }}
                      className="h-8 text-sm bg-gray-800 border-gray-600 text-white"
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => removeSubpart(index)}
                      className="h-8 px-2 text-xs hover:bg-gray-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input 
                    value={newSubpart} 
                    onChange={(e) => setNewSubpart(e.target.value)}
                    placeholder="Add subpart text"
                    className="h-8 text-sm bg-gray-800 border-gray-600 text-white flex-1"
                  />
                  <Button size="sm" variant="outline" onClick={addSubpart} className="h-8 px-2 text-xs border-gray-600 text-white hover:bg-gray-800">Add</Button>
                </div>
              </div>
            </div>
          )}

          {/* Long Answer Type */}
          {formData.question_type === 'long_answer' && (
            <div>
              <Label htmlFor="questionAnswer" className="text-gray-300 text-sm">Expected Answer (for reference)</Label>
              <Textarea 
                id="questionAnswer"
                value={formData.question_answer || ""} 
                onChange={(e) => setFormData({...formData, question_answer: e.target.value})} 
                className="mt-1 h-24 text-sm bg-gray-800 border-gray-600 text-white"
                placeholder="Enter the expected answer or key points..."
              />
            </div>
          )}

          {/* Write Reasons for the Following */}
          {formData.question_type === 'write_reasons' && (
            <div>
              <Label htmlFor="questionAnswer" className="text-gray-300 text-sm">Expected Reasons (for reference)</Label>
              <Textarea 
                id="questionAnswer"
                value={formData.question_answer || ""} 
                onChange={(e) => setFormData({...formData, question_answer: e.target.value})} 
                className="mt-1 h-24 text-sm bg-gray-800 border-gray-600 text-white"
                placeholder="Enter the expected reasons or explanations..."
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-8 px-4 text-sm hover:bg-gray-800">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-4 text-sm">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
