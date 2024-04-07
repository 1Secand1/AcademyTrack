import { getCookie } from '../utils/cookie'

export async function getStudents() {
	try {
		const response = await fetch('http://localhost:80/student', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
				Authorization: `Bearer ${getCookie('token')}`,
			},
		})
		return await response.json()
	} catch (error) {
		throw new Error(`HTTP error! ${error}`)
	}
}
