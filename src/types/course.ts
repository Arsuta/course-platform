export interface Course {
  id: number
  title: string
  description: string
  category: string
  image: string
  price: number
  isFree: boolean
  rating: number
  studentsCount: number
  author: {
    id: number
    name: string
    avatar: string
  }
}

export interface CourseResponse {
  data: Course[]
  total: number
  page: number
  pageSize: number
}
