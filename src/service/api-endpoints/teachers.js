import { ServerManager } from '@service/serverManager.js';
import { groupsService } from './groups.js';

class TeachersService extends ServerManager {
    constructor() {
        super('teachers');
    }

    async get() {
        try {
            const response = await super.get();
            return response;
        } catch (error) {
            console.error('Ошибка при получении списка преподавателей:', error);
            throw error;
        }
    }

    async getByGroup(groupId) {
        return await groupsService.getTeachers(groupId);
    }

    async create(teacherData) {
        try {
            const response = await super.create(teacherData);
            return response;
        } catch (error) {
            console.error('Ошибка при создании преподавателя:', error);
            throw error;
        }
    }

    async update(teacherId, teacherData) {
        try {
            const response = await super.put(teacherId, teacherData);
            return response;
        } catch (error) {
            console.error('Ошибка при обновлении преподавателя:', error);
            throw error;
        }
    }
}

export const teachersService = new TeachersService();