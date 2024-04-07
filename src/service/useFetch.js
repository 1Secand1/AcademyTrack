import { getCookie } from '../utils/cookie'

export async function useFetch(url, method = 'GET') {
	const fetchOptions = {
		method: method,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			Authorization: `Bearer ${getCookie('token')}`,
		},
	}
	try {
		const response = await fetch(url, fetchOptions)

		if (!response.ok) {
			throw new Error('Network response was not ok')
		}

		const responseData = await response.json()
		return responseData
	} catch (error) {
		console.error('There was a problem with your fetch operation:', error)
		throw error
	}
}
