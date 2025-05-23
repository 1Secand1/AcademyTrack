import { apiClient } from '@service/apiClient.js';

export class ServerManager {
	endpointName = '';

	constructor(endpointName) {
		if (!endpointName) {
			throw new Error('Endpoint is required');
		}
		this.endpointName = endpointName;
	}

	async create(body) {
		try {
			console.log('ServerManager: Creating with data:', {
				endpoint: this.endpointName,
				body
			});
			const response = await apiClient.post(this.endpointName, { json: body });
			const data = await response.json();
			console.log('ServerManager: Create successful:', data);
			return data;
		} catch (error) {
			console.error('ServerManager: Error creating:', {
				endpoint: this.endpointName,
				request: body,
				error: error.message,
				status: error.response?.status,
				statusText: error.response?.statusText,
				response: error.response
			});
			throw error;
		}
	}

	async get(id = '', params = {}) {
		const url = id ? `${this.endpointName}/${id}` : this.endpointName;
		
		try {
			const response = await apiClient.get(url, {
				searchParams: params
			}).json();
			return Array.isArray(response) ? response : [response];
		} catch (error) {
			console.error('Ошибка при получении:', {
				endpoint: this.endpointName,
				request: { id, params },
				error: error.message,
				status: error.response?.status,
				statusText: error.response?.statusText
			});
			throw error;
		}
	}

	async update(id, body) {
		try {
			return await apiClient.patch(`${this.endpointName}/${id}`, { json: body }).json();
		} catch (error) {
			console.error('Ошибка при обновлении:', {
				endpoint: this.endpointName,
				request: { id, body },
				error: error.message,
				status: error.response?.status,
				statusText: error.response?.statusText
			});
			throw error;
		}
	}

	async remove(id) {
		if (!id) throw new Error('ID is required for deletion');

		try {
			return await apiClient.delete(`${this.endpointName}/${id}`).json();
		} catch (error) {
			console.error('Ошибка при удалении:', {
				endpoint: this.endpointName,
				request: { id },
				error: error.message,
				status: error.response?.status,
				statusText: error.response?.statusText
			});
			throw error;
		}
	}
}
