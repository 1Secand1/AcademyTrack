import { useFetch } from './useFetch'

export async function getStudentGroups() {
	return await useFetch('http://localhost/group')
}
