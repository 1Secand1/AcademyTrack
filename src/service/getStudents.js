import { useFetch } from './useFetch'

export async function getStudents(codeGroup = null) {
	let url = 'http://localhost/student'

	if (codeGroup) {
		url += `?groupCode=${codeGroup}`
	}

	return await useFetch(url)
}
