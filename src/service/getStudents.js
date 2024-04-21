import { useFetch } from './useFetch'
const { VITE_BASE_API_URL } = import.meta.env

export async function getStudents(codeGroup = null) {
	let url = `${VITE_BASE_API_URL}/student`

	if (codeGroup) {
		url += `?groupCode=${codeGroup}`
	}

	return await useFetch(url)
}
