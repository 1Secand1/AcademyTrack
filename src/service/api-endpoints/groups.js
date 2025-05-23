import { apiClient } from '../apiClient.js';

export const groupsService = {
    async getAll() {
        return await apiClient.get('groups').json();
    },

    async getById(id) {
        return await apiClient.get(`groups/${id}`).json();
    },

    async getDetails(id) {
        return await apiClient.get(`groups/${id}/details`).json();
    },

    async getStudents(id) {
        return await apiClient.get(`groups/${id}/students`).json();
    },

    async getTeachers(id) {
        return await apiClient.get(`groups/${id}/teachers`).json();
    },

    async getSchedule(id, month) {
        const params = month ? { month } : undefined;
        return await apiClient.get(`schedule/groups/${id}`, { searchParams: params }).json();
    },

    async getAttendance(id) {
        return await apiClient.get(`attendance/group/${id}`).json();
    },

    async create(groupData) {
        return await apiClient.post('groups', { json: groupData }).json();
    },

    async update(id, groupData) {
        return await apiClient.put(`groups/${id}`, { json: groupData }).json();
    },

    async delete(id) {
        return await apiClient.delete(`groups/${id}`).json();
    }
};