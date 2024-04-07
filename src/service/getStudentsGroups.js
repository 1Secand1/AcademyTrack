import { useFetch } from './useFetch'

export async function getStudentsGroups() {
	return await useFetch('http://localhost:80/studentUserGroups')
}
