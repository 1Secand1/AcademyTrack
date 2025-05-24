import { apiClient } from '@service/apiClient';

export const api = {
  get: async (url: string) => {
    const response = await apiClient.get(url).json();
    return response;
  },
  post: async (url: string, data: any) => {
    const response = await apiClient.post(url, { json: data }).json();
    return response;
  },
  patch: async (url: string, data: any) => {
    const response = await apiClient.patch(url, { json: data }).json();
    return response;
  },
  delete: async (url: string) => {
    const response = await apiClient.delete(url).json();
    return response;
  }
}; 