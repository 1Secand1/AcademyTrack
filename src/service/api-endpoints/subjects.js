import { apiClient } from '@service/apiClient.js';

export const subjectsService = {
  getAll() {
    return apiClient.get('subject');
  },

  getById(id) {
    return apiClient.get(`subject/${id}`);
  },

  getTeachers(id) {
    return apiClient.get(`subject/${id}/teachers`);
  },

  create(subject) {
    return apiClient.post('subject', { json: subject });
  },

  update(id, subject) {
    return apiClient.patch(`subject/${id}`, { json: subject });
  },

  delete(id) {
    return apiClient.delete(`subject/${id}`);
  },
};