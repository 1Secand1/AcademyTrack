<template>
  <div class="day-schedule">
    <div class="day-schedule__progress-bar">
      <div class="day-schedule__progress-bar-item day-schedule__progress-bar-item--active " />
      <div class="day-schedule__progress-bar-item day-schedule__progress-bar-item--active " />
      <div class="day-schedule__progress-bar-item day-schedule__progress-bar-item--active " />
      <div class="day-schedule__progress-bar-item" />
      <div class="day-schedule__progress-bar-item" />
      <div class="day-schedule__progress-bar-item" />
    </div>

    <div class="day-schedule__day-cards">
      <GroupProfileDayScheduleCards
        v-for="schedule in currentScheduleCardGroup"
        :key="schedule.weekdayTextName"
        :weekday-name="schedule.weekdayTextName"
        :lessons-for-the-day="schedule.schedule"
      />
    </div>
  </div>
</template>

<script setup>
  import GroupProfileDayScheduleCards from '@components/GroupProfile/GroupProfileDaySchedule.vue';
  import { computed, ref, watch } from 'vue';

  const weekSchedules = [
    {
      weekdayTextName: 'Понедельник',
      schedule: [
        {
          lessonNumber: '1',
          teacherName: 'Иванов Иванов Иваныч',
          classRoomNumber: '212',
          subjectName: 'Элективные дисциплины (курсы) по физической культуре и спорту общая физическая подготовка каф.ФКиС',
        },
        {
          lessonNumber: '2',
          teacherName: 'Смирнов Алексей Сергеевич',
          classRoomNumber: '101',
          subjectName: 'Математика',
        },
        {
          lessonNumber: '3',
          teacherName: 'Попова Мария Ивановна',
          classRoomNumber: '304',
          subjectName: 'История',
        },
        {
          lessonNumber: '4',
          teacherName: 'Кузнецов Николай Николаевич',
          classRoomNumber: '102',
          subjectName: 'Биология',
        },
        {
          lessonNumber: '5',
          teacherName: 'Сидоров Петр Петрович',
          classRoomNumber: '203',
          subjectName: 'Физика',
        },
        {
          lessonNumber: '6',
          teacherName: 'Петрова Анна Викторовна',
          classRoomNumber: '305',
          subjectName: 'Литература',
        },
        {
          lessonNumber: '7',
          teacherName: 'Васильев Дмитрий Александрович',
          classRoomNumber: '202',
          subjectName: 'Химия',
        },
      ],
    },
    {
      weekdayTextName: 'Вторник',
      schedule: [
        {
          lessonNumber: '1',
          teacherName: 'Петров Петр Петрович',
          classRoomNumber: '101',
          subjectName: 'Литература',
        },
        {
          lessonNumber: '3',
          teacherName: 'Сидоров Сидор Сидорович',
          classRoomNumber: '203',
          subjectName: 'Физика',
        },
      ],
    },
    {
      weekdayTextName: 'Среда',
      schedule: [],
    },
    {
      weekdayTextName: 'Четверг',
      schedule: [
        {
          lessonNumber: '1',
          teacherName: 'Алексеев Алексей Алексеевич',
          classRoomNumber: '201',
          subjectName: 'Химия',
        },
        {
          lessonNumber: '2',
          teacherName: 'Петров Петр Петрович',
          classRoomNumber: '101',
          subjectName: 'Литература',
        },
        {
          lessonNumber: '3',
          teacherName: 'Иванова Мария Ивановна',
          classRoomNumber: '304',
          subjectName: 'История',
        },
      ],
    },
    {
      weekdayTextName: 'Пятница',
      schedule: [
        {
          lessonNumber: '1',
          teacherName: 'Сидоров Сидор Сидорович',
          classRoomNumber: '203',
          subjectName: 'Физика',
        },
        {
          lessonNumber: '2',
          teacherName: 'Иванова Мария Ивановна',
          classRoomNumber: '304',
          subjectName: 'История',
        },
        {
          lessonNumber: '3',
          teacherName: 'Кузнецов Николай Николаевич',
          classRoomNumber: '102',
          subjectName: 'Биология',
        },
        {
          lessonNumber: '4',
          teacherName: 'Попова Мария Ивановна',
          classRoomNumber: '304',
          subjectName: 'История',
        },
        {
          lessonNumber: '5',
          teacherName: 'Петрова Анна Викторовна',
          classRoomNumber: '305',
          subjectName: 'Литература',
        },
      ],
    },
    {
      weekdayTextName: 'Суббота',
      schedule: [
        {
          lessonNumber: '1',
          teacherName: 'Кузнецов Николай Николаевич',
          classRoomNumber: '102',
          subjectName: 'Биология',
        },
        {
          lessonNumber: '2',
          teacherName: 'Алексеев Алексей Алексеевич',
          classRoomNumber: '201',
          subjectName: 'Химия',
        },
        {
          lessonNumber: '3',
          teacherName: 'Иванова Мария Ивановна',
          classRoomNumber: '304',
          subjectName: 'История',
        },
        {
          lessonNumber: '4',
          teacherName: 'Смирнов Алексей Сергеевич',
          classRoomNumber: '101',
          subjectName: 'Математика',
        },
      ],
    },
  ];

  const quantityElementsInGroup = ref(3);

  const currentScheduleCardGroupNumber = ref(0);

  const scheduleCardGroups = computed(groupSchedulesSorted);
  const currentScheduleCardGroup = computed(() => scheduleCardGroups.value[currentScheduleCardGroupNumber.value]);

  function groupSchedulesSorted() {
    const numberOfGroups = Math.ceil(weekSchedules.length / quantityElementsInGroup.value);
    const groups = Array.from({ length: numberOfGroups }, () => []);

    for (let index = 0; index < weekSchedules.length; index++) {
      const groupNumber = Math.floor(index / quantityElementsInGroup.value);
      groups[groupNumber].push(weekSchedules[index]);
    }

    return groups;
  }
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