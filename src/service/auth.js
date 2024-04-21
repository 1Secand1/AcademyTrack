const { VITE_BASE_API_URL } = import.meta.env

export async function getToken(login, password) {
	try {
		const user = {
			login: login,
			password: password,
		}

		const response = await fetch(`${VITE_BASE_API_URL}/auth`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(user),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		return data['token']
	} catch (error) {
		return undefined
	}
}
