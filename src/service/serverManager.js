import { apiClient } from '@service/apiClient.js';

export class ServerManager {
	endpointName = '';

	constructor(endpointName) {
		if (!endpointName) {throw new Error('Endpoint is required');}
		this.endpointName = endpointName;
	}

	create(body) {
		return apiClient.post(this.endpointName, {
			json: body,
		}).json();
	}

	get() {
		return apiClient.get(this.endpointName).json();
	}

	update(body) {
		return  apiClient.put(this.endpointName, {
			json: body,
		}).json();
	}
	remove() {
		return	apiClient.delete(this.endpointName).json();
	}
}
