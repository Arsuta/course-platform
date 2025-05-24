import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BaseAPI } from '../../../src/api/base'
import { apiClient } from '../../../src/api/client'

vi.mock('../../../src/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('BaseAPI', () => {
  let api: BaseAPI

  beforeEach(() => {
    api = new BaseAPI()
    vi.clearAllMocks()
  })

  describe('setToken', () => {
    it('should set the token', () => {
      api.setToken('test-token')
      expect((api as any).token).toBe('test-token')
    })
  })

  describe('clearToken', () => {
    it('should clear the token', () => {
      api.setToken('test-token')
      api.clearToken()
      expect((api as any).token).toBeNull()
    })
  })

  describe('get', () => {
    it('should make a GET request with the token', async () => {
      api.setToken('test-token')
      const mockResponse = { data: { test: true }, status: 200, statusText: 'OK' }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const response = await (api as any).get('/test')

      expect(apiClient.get).toHaveBeenCalledWith('/test', {
        headers: {
          Authorization: 'Bearer test-token'
        }
      })
      expect(response).toEqual({
        data: { test: true },
        status: 200,
        message: 'OK'
      })
    })

    it('должен корректно обрабатывать успешный GET запрос', async () => {
      const mockResponse = {
        data: { id: '1', name: 'Test' },
        status: 200,
        statusText: 'OK'
      }
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const response = await api['get']('/test')
      expect(response).toEqual({
        data: { id: '1', name: 'Test' },
        status: 200,
        message: 'OK'
      })
      expect(apiClient.get).toHaveBeenCalledWith('/test', undefined)
    })

    it('должен корректно обрабатывать ошибку GET запроса', async () => {
      const error = new Error('Network Error')
      vi.mocked(apiClient.get).mockRejectedValue(error)

      await expect(api['get']('/test')).rejects.toThrow('Network Error')
    })
  })

  describe('post', () => {
    it('должен корректно обрабатывать успешный POST запрос', async () => {
      const mockResponse = {
        data: { id: '1', name: 'Test' },
        status: 201,
        statusText: 'Created'
      }
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const response = await api['post']('/test', { name: 'Test' })
      expect(response).toEqual({
        data: { id: '1', name: 'Test' },
        status: 201,
        message: 'Created'
      })
      expect(apiClient.post).toHaveBeenCalledWith('/test', { name: 'Test' }, undefined)
    })
  })

  // Аналогичные тесты для put и delete методов
}) 