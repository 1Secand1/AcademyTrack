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
			const response = await apiClient.post(this.endpointName, { json: body });
			const data = await response.json();
			return data;
		} catch (error) {
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
			throw error;
		}
	}

	async update(id, body) {
		try {
			return await apiClient.patch(`${this.endpointName}/${id}`, { json: body }).json();
		} catch (error) {
			throw error;
		}
	}

	async remove(id) {
		if (!id) throw new Error('ID is required for deletion');

		try {
			return await apiClient.delete(`${this.endpointName}/${id}`).json();
		} catch (error) {
			throw error;
		}
	}
}
