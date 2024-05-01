import { useFetch } from './useFetch'

const { VITE_BASE_API_URL } = import.meta.env

export class ServerManager {
	constructor(baseUrl, path) {
		this.baseUrl = baseUrl
		this.path = path
		this.url = `${this.baseUrl}/${this.path}`
	}

	add(studentData) {
		return useFetch(this.url, 'POST', studentData)
	}

	get() {
		return useFetch(this.url)
	}

	delete() {}
}

export function createServerManager(path) {
	if (!VITE_BASE_API_URL) throw new Error('VITE_BASE_API_URL is not defined')
	return new ServerManager(VITE_BASE_API_URL, path)
}
