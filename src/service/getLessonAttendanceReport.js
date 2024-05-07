export function serverResponse() {
	const serverResponse = {
		dateOfTheLastLesson: '2024-10-22',
		teacherFullName: 'Иванова Тамара Ивановна',
		groupCode: 'ИСП-216',
		totalStudents: 2,
		students: [
			{
				fullName: 'Боев Владислав Владимирович',
				attendance: {
					'2024-09-15': 'attended',
					'2024-09-22': 'attended',
					'2024-10-15': 'attended',
					'2024-10-22': 'sick',
				},
			},

			{
				fullName: 'Иванов Иван Иваныч',
				attendance: {
					'2024-09-15': 'attended',
					'2024-09-22': 'attended',
					'2024-10-15': 'attended',
					'2024-10-22': 'attended',
				},
			},
		],
	}
	return Promise.resolve(serverResponse)
}
