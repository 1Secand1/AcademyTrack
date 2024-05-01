import { useFetch } from './useFetch'
const { VITE_BASE_API_URL } = import.meta.env

export function getTeachersGroups() {
	return useFetch(`${VITE_BASE_API_URL}/studentUserGroups`)
}
