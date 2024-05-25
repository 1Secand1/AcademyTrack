import { fetchRequest } from './fetchRequest';

const { VITE_BASE_API_URL } = import.meta.env;
const mapServerManager = {};

class ServerManager {
	constructor(baseUrl, path) {
		console.log(1);
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

	if (!(path in mapServerManager)) {
		mapServerManager[path] = new ServerManager(VITE_BASE_API_URL, path);
	}

	return mapServerManager[path];
}
