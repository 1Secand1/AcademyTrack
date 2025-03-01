export async function getLessonPlan() {
	const lessonPlan = {
		groupCode: 'ИСП-216',
		teacherFullName: 'Иванова Тамара Ивановна',
		subject: 'Математика',
		lessonsAttendance: [
			{
				lessonNumber: 1,
				date: '2024-09-15',
				status: 'completed',
				attended: 25,
				absent: 3,
			},
			{
				lessonNumber: 1,
				date: '2024-09-22',
				status: 'completed',
				attended: 23,
				absent: 5,
			},
			{
				lessonNumber: 1,
				date: '2024-10-15',
				status: 'planned',
			},
			{
				lessonNumber: 1,
				date: '2024-10-22',
				status: 'planned',
			},
			{
				lessonNumber: 1,
				date: '2024-12-22',
				status: 'planned',
			},
			{
				lessonNumber: 1,
				date: '2024-05-09',
				status: 'planned',
			},
		],
	};

	return await Promise.resolve(lessonPlan);
}
