import { apiClient } from '../apiClient.js';

export async function getToken(login, password) {
	try {
		const user = {
			login: login,
			password: password,
		};

		const response = await apiClient.post('auth', { json: user }).json();
		return response.token;
	} catch (error) {
		console.error('Auth error:', error);
		return undefined;
	}
}
