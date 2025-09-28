export type Question = {
  question_id: string
  question_text: string
  default_marks: number
  class: string | null
  subject: string | null
  topic: string | null
  question_type: string
  options?: Record<string, string> | null
  left_items?: string[] | null
  right_items?: string[] | null
  blanks?: string | null
  question_answer?: string | null
  correct_option_id?: string | null
  // New: subparts for questions with a), b), c) style sub-questions
  subparts?: string[] | null
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


