import { BaseApiService } from '../base';
import { gameClient } from '../client';
import type { ApiResponse, ClickRequest, ClickResponse, LeaderboardResponse, StatsResponse } from '../types';
import { API_CLICKER } from '../constants';

/**
 * Сервис для работы с игровой платформой
 */
export class GameService extends BaseApiService {
  constructor() {
    super(gameClient); // Используем gameClient для запросов к игровому API
  }

  /**
   * Сохранить клики пользователя
   */
  async saveClicks(data: ClickRequest): Promise<ApiResponse<ClickResponse>> {
    return this.post<ClickResponse>(API_CLICKER.CLICKS, data);
  }

  /**
   * Получить таблицу лидеров
   */
  async getLeaderboard(limit?: number, offset?: number): Promise<ApiResponse<LeaderboardResponse>> {
    // Формируем параметры запроса
    const params: Record<string, string> = {};
    if (limit) params.limit = limit.toString();
    if (offset) params.offset = offset.toString();

    return this.get<LeaderboardResponse>(API_CLICKER.LEADERBOARD, { params });
  }

  /**
   * Получить статистику пользователя
   */
  async getStats(): Promise<ApiResponse<StatsResponse>> {
    return this.get<StatsResponse>(API_CLICKER.STATS);
  }
} 