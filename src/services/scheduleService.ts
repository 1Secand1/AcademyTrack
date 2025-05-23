import { api } from '@/api';
import type { Schedule, ScheduleCreate, ScheduleUpdate } from '@/types/schedule';

export const scheduleService = {
  // Получение расписания для группы
  async getGroupSchedule(groupId: string, month?: string, year?: string): Promise<Schedule[]> {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const response = await api.get(`/schedule/groups/${groupId}?${params.toString()}`);
    return response.schedule;
  },

  // Получение расписания для конкретной связи преподаватель-группа
  async getSchedule(teachingAssignmentId: string, month?: string, year?: string): Promise<Schedule[]> {
    const params = new URLSearchParams();
    params.append('teachingAssignmentId', teachingAssignmentId);
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const response = await api.get(`/schedule?${params.toString()}`);
    return response;
  },

  // Создание расписания
  async createSchedule(data: ScheduleCreate): Promise<Schedule> {
    const response = await api.post('/schedule', data);
    return response;
  },

  // Обновление расписания
  async updateSchedule(data: ScheduleUpdate): Promise<Schedule> {
    const response = await api.put(`/schedule/${data.id}`, data);
    return response;
  },

  // Удаление расписания
  async deleteSchedule(id: string): Promise<void> {
    await api.delete(`/schedule/${id}`);
  }
}; 