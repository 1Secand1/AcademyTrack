import { ServerManager } from '../serverManager.js';

export class TeachingAssignmentsService extends ServerManager {
    constructor() {
        super('teaching-assignments');
    }

    async create(assignmentData) {
        try {
            const response = await super.create(assignmentData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async get(teacherId) {
        try {
            const response = await super.get(teacherId ? `?teacherId=${teacherId}` : '');
            return response;
        } catch (error) {
            throw error;
        }
    }

    async update(assignmentId, data) {
        try {
            const response = await super.update(assignmentId, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async delete(assignmentId) {
        try {
            const response = await super.delete(assignmentId);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export const teachingAssignmentsService = new TeachingAssignmentsService();