import { useState } from "react"
import { useSensors, useSensor, DragEndEvent, MouseSensor, TouchSensor } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import type { PaperItem } from "@/app/create/types"

export const useDragAndDrop = (paper: PaperItem[], setPaper: (items: PaperItem[]) => void) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  // Use dedicated sensors for mouse and touch. Touch sensor uses a small delay/tolerance
  // so that scrolling still works naturally while enabling drag on long-press.
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  )

  const onDragStart = (e?: any) => {
    setActiveId(e?.active?.id || null)
  }

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const id = String(e.active.id)
    const overId = e.over?.id ? String(e.over.id) : undefined

    if (overId && id !== overId) {
      const oldIndex = paper.findIndex(it => it.id === id)
      const newIndex = paper.findIndex(it => it.id === overId)
      if (oldIndex !== -1 && newIndex !== -1) {
        setPaper(arrayMove(paper, oldIndex, newIndex))
      }
    }
  }

  return {
    activeId,
    sensors,
    onDragStart,
    onDragEnd
  }
}
