import ky from 'ky';
import { getCookie } from '@utils/cookie.js';
import router from '@router/index.js';

const { VITE_BASE_API_URL: prefixUrl } = import.meta.env;

console.log(prefixUrl,'prefixUrl');

export const apiClient = ky.create({
  prefixUrl,
  timeout: 30000,
  retry: {
    limit: 3,
    methods: ['get', 'post', 'head', 'delete', 'options', 'patch'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504, 521, 522, 524],
  },
  hooks: {
    beforeRequest: [
      request => {
        // Добавляем заголовок для предотвращения кэширования
        request.headers.set('Cache-Control', 'no-cache');

        // Добавляем JWT токен в заголовки
        const token = getCookie('token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          if (response.status === 401) {
            // Если токен недействителен, перенаправляем на страницу входа через Vue Router
            await router.replace('/login');
          }
          const error = new Error(`HTTP error! status: ${response.status}`);
          error.response = response;
          throw error;
        }
      },
    ],
  },
});