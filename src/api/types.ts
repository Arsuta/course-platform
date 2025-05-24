export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  level: string;
  rating: number;
  thumbnail: string;
  category_id: string;
  category: string;
  status: string;
  created_by: string;
  students_count: number;
  studentsCount: number;
  image: string;
  isFree: boolean;
  created_at: string;
  updated_at: string;
  updatedAt: string;
  author?: string;
  progress?: number;
  lessonsCount?: number;
  modules?: CourseModule[];
  skills?: string[];
  requirements?: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseProgress {
  course_id: string;
  completed_lessons: number;
  total_lessons: number;
  percentage: number;
  xp_earned: number;
  completed_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  course_id: string;
  order_num: number;
  has_test: boolean;
  requires_test: boolean;
  completed: boolean;
  passed_test: boolean;
  test_score: number;
  viewed_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  role: string;
  total_xp: number;
  settings: Record<string, any>;
}

export interface TestResponse {
  test: Test;
  questions: Question[];
  passing_score: number;
  attempts_count: number;
  last_score: number;
  passed: boolean;
}

export interface Test {
  id: string;
  lesson_id: string;
  passing_score: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  test_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  created_at: string;
  updated_at: string;
} 