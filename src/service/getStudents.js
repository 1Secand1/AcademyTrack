import { useFetch } from './useFetch'

export async function getStudents() {
	return await useFetch('http://localhost:80/student')
}
