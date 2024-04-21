import { useFetch } from './useFetch'
const { VITE_BASE_API_URL } = import.meta.env

export async function getStudentGroups() {
	return await useFetch(`${VITE_BASE_API_URL}/group`)
}
