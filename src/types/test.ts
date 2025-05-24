export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface Test {
  id: string
  title: string
  description: string
  questions: Question[]
  timeLimit?: number
  passingScore?: number
}

export interface TestResult {
  testId: string
  userId: string
  score: number
  passed: boolean
  answers: Record<string, number>
  completedAt: string
}

export interface TestResponse {
  test: Test
  result?: TestResult
} 