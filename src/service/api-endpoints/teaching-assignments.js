import { ServerManager } from '../serverManager.js';

export class TeachingAssignmentsService extends ServerManager {
    constructor() {
        super('teaching-assignments');
    }

    async create(assignmentData) {
        try {
            console.log('Creating teaching assignment:', assignmentData);
            const response = await super.create(assignmentData);
            console.log('Teaching assignment created successfully:', response);
            return response;
        } catch (error) {
            console.error('Error creating teaching assignment:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });
            throw error;
        }
    }

    async get(teacherId) {
        try {
            console.log('Fetching teaching assignments' + (teacherId ? ` for teacher ${teacherId}` : ''));
            const response = await super.get(teacherId ? `?teacherId=${teacherId}` : '');
            console.log('Teaching assignments fetched successfully:', response);
            return response;
        } catch (error) {
            console.error('Error fetching teaching assignments:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });
            throw error;
        }
    }

    async update(assignmentId, data) {
        try {
            console.log('Updating teaching assignment:', { assignmentId, data });
            const response = await super.update(assignmentId, data);
            console.log('Teaching assignment updated successfully:', response);
            return response;
        } catch (error) {
            console.error('Error updating teaching assignment:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });
            throw error;
        }
    }

    async delete(assignmentId) {
        try {
            console.log('Deleting teaching assignment:', assignmentId);
            const response = await super.delete(assignmentId);
            console.log('Teaching assignment deleted successfully:', response);
            return response;
        } catch (error) {
            console.error('Error deleting teaching assignment:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });
            throw error;
        }
    }
}

export const teachingAssignmentsService = new TeachingAssignmentsService();