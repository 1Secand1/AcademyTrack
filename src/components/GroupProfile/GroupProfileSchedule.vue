<template>
	<div class="day-schedule">
		<div class="day-schedule__progress-bar">
			<div class="day-schedule__progress-bar-item day-schedule__progress-bar-item--active "></div>
			<div class="day-schedule__progress-bar-item day-schedule__progress-bar-item--active "></div>
			<div class="day-schedule__progress-bar-item day-schedule__progress-bar-item--active "></div>
			<div class="day-schedule__progress-bar-item"></div>
			<div class="day-schedule__progress-bar-item"></div>
			<div class="day-schedule__progress-bar-item"></div>
		</div>

		<div class="day-schedule__day-cards">
			<GroupProfileDayScheduleCards
				v-for='schedule in weeklySchedule'
				:key='schedule.weekdayTextName'
				:weekdayName='schedule.weekdayTextName'
				:lessonsForTheDay="schedule.schedule"
			/>
		</div>

	</div>
</template>

<script setup>
import GroupProfileDayScheduleCards from "@components/GroupProfile/GroupProfileDayScheduleCards.vue"

const weeklySchedule = {
	monday: {
		weekdayTextName: "Понедельник",
		schedule: [
			{
				lessonNumber: "1",
				teacherName: "Иванов Иванов Иваныч",
				cabinetNumber: "212",
				subjectName: "Элективные дисциплины (курсы) по физической культуре и спорту общая физическая подготовка каф.ФКиС"
			},
			{
				lessonNumber: "2",
				teacherName: "Смирнов Алексей Сергеевич",
				cabinetNumber: "101",
				subjectName: "Математика"
			},
			{
				lessonNumber: "3",
				teacherName: "Попова Мария Ивановна",
				cabinetNumber: "304",
				subjectName: "История"
			},
			{
				lessonNumber: "4",
				teacherName: "Кузнецов Николай Николаевич",
				cabinetNumber: "102",
				subjectName: "Биология"
			},
			{
				lessonNumber: "5",
				teacherName: "Сидоров Петр Петрович",
				cabinetNumber: "203",
				subjectName: "Физика"
			},
			{
				lessonNumber: "6",
				teacherName: "Петрова Анна Викторовна",
				cabinetNumber: "305",
				subjectName: "Литература"
			},
			{
				lessonNumber: "7",
				teacherName: "Васильев Дмитрий Александрович",
				cabinetNumber: "202",
				subjectName: "Химия"
			},
		]
	},
	tuesday: {
		weekdayTextName: "Вторник",
		schedule: [
			{
				lessonNumber: "1",
				teacherName: "Петров Петр Петрович",
				cabinetNumber: "101",
				subjectName: "Литература"
			},
			{
				lessonNumber: "2",
				teacherName: "Сидоров Сидор Сидорович",
				cabinetNumber: "203",
				subjectName: "Физика"
			},
		]
	},
	wednesday: {
		weekdayTextName: "Среда",
		schedule: []
	},
	thursday: {
		weekdayTextName: "Четверг",
		schedule: [
			{
				lessonNumber: "1",
				teacherName: "Алексеев Алексей Алексеевич",
				cabinetNumber: "201",
				subjectName: "Химия"
			},
			{
				lessonNumber: "2",
				teacherName: "Петров Петр Петрович",
				cabinetNumber: "101",
				subjectName: "Литература"
			},
			{
				lessonNumber: "3",
				teacherName: "Иванова Мария Ивановна",
				cabinetNumber: "304",
				subjectName: "История"
			},
		]
	},
	friday: {
		weekdayTextName: "Пятница",
		schedule: [
			{
				lessonNumber: "1",
				teacherName: "Сидоров Сидор Сидорович",
				cabinetNumber: "203",
				subjectName: "Физика"
			},
			{
				lessonNumber: "2",
				teacherName: "Иванова Мария Ивановна",
				cabinetNumber: "304",
				subjectName: "История"
			},
			{
				lessonNumber: "3",
				teacherName: "Кузнецов Николай Николаевич",
				cabinetNumber: "102",
				subjectName: "Биология"
			},
			{
				lessonNumber: "4",
				teacherName: "Попова Мария Ивановна",
				cabinetNumber: "304",
				subjectName: "История"
			},
			{
				lessonNumber: "5",
				teacherName: "Петрова Анна Викторовна",
				cabinetNumber: "305",
				subjectName: "Литература"
			},
		]
	},
	saturday: {
		weekdayTextName: "Суббота",
		schedule: [
			{
				lessonNumber: "1",
				teacherName: "Кузнецов Николай Николаевич",
				cabinetNumber: "102",
				subjectName: "Биология"
			},
			{
				lessonNumber: "2",
				teacherName: "Алексеев Алексей Алексеевич",
				cabinetNumber: "201",
				subjectName: "Химия"
			},
			{
				lessonNumber: "3",
				teacherName: "Иванова Мария Ивановна",
				cabinetNumber: "304",
				subjectName: "История"
			},
			{
				lessonNumber: "4",
				teacherName: "Смирнов Алексей Сергеевич",
				cabinetNumber: "101",
				subjectName: "Математика"
			},
		]
	},
};

</script>

<style scoped>
.day-schedule__day-cards {
	width: 100%;
	height: 80svh;
	display: flex;
	overflow: auto;

	justify-content: space-between;

	margin-top: 20px;
	gap: 10px;
}


.day-schedule__progress-bar {
	display: flex;

	gap: 10px;
	margin-top: 15px;
}

.day-schedule__progress-bar-item {
	width: 100%;
	height: 10px;
	border-radius: 5px;
	background: #D9D9D9;
}

.day-schedule__progress-bar-item--active {
	background: #627BFF;

}

.day-schedule {
	width: 100%;
}
</style>