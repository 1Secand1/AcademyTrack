import { getCookie } from '@utils/cookie'

export async function useFetch(url, method = 'GET', body = null) {
	const fetchOptions = {
		method: method,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			Authorization: `Bearer ${getCookie('token')}`,
		},
	}

	if (method !== 'GET' && method !== 'DELETE') {
		fetchOptions.body = JSON.stringify(body)
		console.log(fetchOptions)
	}

	try {
		const response = await fetch(url, fetchOptions)

		if (!response.ok) {
			const errContent = await response.text()
			console.warn(
				`${response.statusText} (${response.status}) - ${errContent}`
			)
			throw new Error(`Network response was not ok`)
		}

		const responseData = await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}
