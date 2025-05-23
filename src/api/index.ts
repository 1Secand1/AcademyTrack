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
  put: async (url: string, data: any) => {
    const response = await apiClient.put(url, { json: data }).json();
    return response;
  },
  delete: async (url: string) => {
    const response = await apiClient.delete(url).json();
    return response;
  }
}; 