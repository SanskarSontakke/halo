export type Question = {
  question_id: string
  question_text: string
  default_marks: number
  class: string
  subject: string
  topic: string
  question_type: string
  options?: Record<string, string>
  left_items?: string[]
  right_items?: string[]
}

export type PaperItem =
  | { kind: 'question'; id: string; question: Question }
  | { kind: 'section'; id: string; text: string; prefix?: string }

export type Filters = {
  class?: string
  subject?: string
  topics: string[]
  types: string[]
  search?: string
}


