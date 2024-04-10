import { useFetch } from './useFetch'

export async function getStudents(codeGroup = null) {
	const url = 'http://localhost:80/student'

	if (!null) {
		url += `?groupCode=${codeGroup}`
	}
	return await useFetch(url)
}
