const { VITE_BASE_API_URL:prefixUrl } = import.meta.env;
import ky from 'ky';

export const apiClient = ky.create({ prefixUrl });