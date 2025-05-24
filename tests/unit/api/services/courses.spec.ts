import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CourseService } from '../../../../src/api/services/courses'
import { apiClient } from '../../../../src/api/client'
import { COURSES } from '../../../../src/api/endpoints'

vi.mock('../../../../src/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('CourseService', () => {
  let api: CourseService

  beforeEach(() => {
    api = new CourseService()
    vi.clearAllMocks()
  })

  describe('getAllCourses', () => {
    it('should fetch all courses with pagination', async () => {
      const mockResponse = {
        data: {
          data: [{ id: 1, title: 'Test Course' }],
          total: 1,
          per_page: 10,
          current_page: 1
        },
        status: 200,
        statusText: 'OK'
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const response = await api.getAllCourses({ page: 1, per_page: 10 })

      expect(apiClient.get).toHaveBeenCalledWith(COURSES.LIST, {
        params: { page: 1, per_page: 10 }
      })
      expect(response).toEqual({
        data: mockResponse.data,
        status: 200,
        message: 'OK'
      })
    })
  })

  describe('getCourseById', () => {
    it('should fetch a course by id', async () => {
      const courseId = '1'
      const mockResponse = {
        data: { id: 1, title: 'Test Course' },
        status: 200,
        statusText: 'OK'
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const response = await api.getCourseById(courseId)

      expect(apiClient.get).toHaveBeenCalledWith(COURSES.DETAIL(courseId))
      expect(response).toEqual({
        data: mockResponse.data,
        status: 200,
        message: 'OK'
      })
    })
  })
}) 