import { useFetch } from './useFetch'

export async function getStudents(codeGroup = null) {
	let url = 'http://localhost:80/student'

	if (codeGroup) {
		url += `?groupCode=${codeGroup}`
	}

	return await useFetch(url)
}
