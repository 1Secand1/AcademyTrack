export async function getLessonPlan() {
	const lessonPlan = {
		groupCode: 'ИСП-216',
		teacherFullName: 'Иванова Тамара Ивановна',
		subject: 'Математика',
		lessonsAttendance: [
			// Сентябрь
			{ lessonNumber: 1, date: '2024-09-03', status: 'planned' },
			{ lessonNumber: 2, date: '2024-09-05', status: 'planned' },
			{ lessonNumber: 1, date: '2024-09-10', status: 'planned' },
			{ lessonNumber: 2, date: '2024-09-12', status: 'planned' },
			{ lessonNumber: 1, date: '2024-09-17', status: 'planned' },
			{ lessonNumber: 2, date: '2024-09-19', status: 'planned' },
			{ lessonNumber: 1, date: '2024-09-24', status: 'planned' },
			{ lessonNumber: 2, date: '2024-09-26', status: 'planned' },

			// Октябрь
			{ lessonNumber: 1, date: '2024-10-01', status: 'planned' },
			{ lessonNumber: 2, date: '2024-10-03', status: 'planned' },
			{ lessonNumber: 1, date: '2024-10-08', status: 'planned' },
			{ lessonNumber: 2, date: '2024-10-10', status: 'planned' },
			{ lessonNumber: 1, date: '2024-10-15', status: 'planned' },
			{ lessonNumber: 2, date: '2024-10-17', status: 'planned' },
			{ lessonNumber: 1, date: '2024-10-22', status: 'planned' },
			{ lessonNumber: 2, date: '2024-10-24', status: 'planned' },
			{ lessonNumber: 1, date: '2024-10-29', status: 'planned' },
			{ lessonNumber: 2, date: '2024-10-31', status: 'planned' },

			// Ноябрь
			{ lessonNumber: 1, date: '2024-11-05', status: 'planned' },
			{ lessonNumber: 2, date: '2024-11-07', status: 'planned' },
			{ lessonNumber: 1, date: '2024-11-12', status: 'planned' },
			{ lessonNumber: 2, date: '2024-11-14', status: 'planned' },
			{ lessonNumber: 1, date: '2024-11-19', status: 'planned' },
			{ lessonNumber: 2, date: '2024-11-21', status: 'planned' },
			{ lessonNumber: 1, date: '2024-11-26', status: 'planned' },
			{ lessonNumber: 2, date: '2024-11-28', status: 'planned' },

			// Декабрь
			{ lessonNumber: 1, date: '2024-12-03', status: 'planned' },
			{ lessonNumber: 2, date: '2024-12-05', status: 'planned' },
			{ lessonNumber: 1, date: '2024-12-10', status: 'planned' },
			{ lessonNumber: 2, date: '2024-12-12', status: 'planned' },
			{ lessonNumber: 1, date: '2024-12-17', status: 'planned' },
			{ lessonNumber: 2, date: '2024-12-19', status: 'planned' },

			// Январь

			// Февраль
			{ lessonNumber: 1, date: '2025-02-04', status: 'planned' },
			{ lessonNumber: 2, date: '2025-02-06', status: 'planned' },
			{ lessonNumber: 1, date: '2025-02-11', status: 'planned' },
			{ lessonNumber: 2, date: '2025-02-13', status: 'planned' },
			{ lessonNumber: 1, date: '2025-02-18', status: 'planned' },
			{ lessonNumber: 2, date: '2025-02-20', status: 'planned' },
			{ lessonNumber: 1, date: '2025-02-25', status: 'planned' },
			{ lessonNumber: 2, date: '2025-02-27', status: 'planned' },

			// Март
			{ lessonNumber: 1, date: '2025-03-04', status: 'planned' },
			{ lessonNumber: 2, date: '2025-03-06', status: 'planned' },
			{ lessonNumber: 1, date: '2025-03-11', status: 'planned' },
			{ lessonNumber: 2, date: '2025-03-13', status: 'planned' },
			{ lessonNumber: 1, date: '2025-03-18', status: 'planned' },
			{ lessonNumber: 2, date: '2025-03-20', status: 'planned' },
			{ lessonNumber: 1, date: '2025-03-25', status: 'planned' },
			{ lessonNumber: 2, date: '2025-03-27', status: 'planned' },

			// Апрель
			{ lessonNumber: 1, date: '2025-04-01', status: 'planned' },
			{ lessonNumber: 2, date: '2025-04-03', status: 'planned' },
			{ lessonNumber: 1, date: '2025-04-08', status: 'planned' },
			{ lessonNumber: 2, date: '2025-04-10', status: 'planned' },
			{ lessonNumber: 1, date: '2025-04-15', status: 'planned' },
			{ lessonNumber: 2, date: '2025-04-17', status: 'planned' },
			{ lessonNumber: 1, date: '2025-04-22', status: 'planned' },
			{ lessonNumber: 2, date: '2025-04-24', status: 'planned' },

			// Май
			{ lessonNumber: 1, date: '2025-05-06', status: 'planned' },
			{ lessonNumber: 2, date: '2025-05-08', status: 'planned' },
			{ lessonNumber: 1, date: '2025-05-13', status: 'planned' },
			{ lessonNumber: 2, date: '2025-05-15', status: 'planned' },
			{ lessonNumber: 1, date: '2025-05-20', status: 'planned' },
			{ lessonNumber: 2, date: '2025-05-22', status: 'planned' },
		],
	};

	return await Promise.resolve(lessonPlan);
}
