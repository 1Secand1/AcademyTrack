import { useFetch } from './useFetch'

export async function getTeachersGroups() {
	return await useFetch('http://localhost/studentUserGroups')
}
