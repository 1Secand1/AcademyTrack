import { useFetch } from './useFetch'
const { VITE_BASE_API_URL } = import.meta.env

export async function getTeachersGroups() {
	return await useFetch(`${VITE_BASE_API_URL}/studentUserGroups`)
}
