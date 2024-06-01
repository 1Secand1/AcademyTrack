import { fetchRequest } from './fetchRequest';

const { VITE_BASE_API_URL } = import.meta.env;
const mapServerManager = new Map();

class ServerManager {
	constructor(baseUrl, path) {
		console.log(path);
		this.baseUrl = baseUrl;
		this.path = path;
		this.url = `${this.baseUrl}/${this.path}`;
	}

	add(studentData) {
		return fetchRequest(this.url, 'POST', studentData);
	}

	get() {
		return fetchRequest(this.url);
	}

	delete() { }
}

export function createServerManager(path) {
	if (!VITE_BASE_API_URL) {
		throw new Error('VITE_BASE_API_URL is not defined');
	}

	if (!mapServerManager.has(path)) {
		mapServerManager.set(path,new ServerManager(VITE_BASE_API_URL, path));
	}

	return mapServerManager.get(path);
}
