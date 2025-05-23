import { ServerManager } from '@service/serverManager.js';
import { groupsService } from './groups.js';

class StudentsService extends ServerManager {
    constructor() {
        super('students');
    }

    async get() {
        try {
            const response = await super.get();
            return response;
        } catch (error) {
            console.error('Ошибка при получении списка студентов:', error);
            throw error;
        }
    }

    async getByGroup(groupId) {
        return await groupsService.getStudents(groupId);
    }

    async create(studentData) {
        try {
            const response = await super.create(studentData);
            return response;
        } catch (error) {
            console.error('Ошибка при создании студента:', error);
            throw error;
        }
    }

    async update(studentId, studentData) {
        try {
            const response = await super.update(studentId, studentData);
            return response;
        } catch (error) {
            console.error('Ошибка при обновлении студента:', error);
            throw error;
        }
    }
}

export const studentsService = new StudentsService();