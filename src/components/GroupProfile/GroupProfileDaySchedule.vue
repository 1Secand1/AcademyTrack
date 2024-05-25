<template>
  <div class="day-schedule">
    <h3 class="day-schedule__title">
      {{ weekdayName }}
    </h3>
    <div class="cards">
      <template
        v-for="lesson in formattedLessonsForTheDay"
        :key="lesson.lessonNumber"
      >
        <GroupProfileDayScheduleCardNumbered
          v-if="lesson?.unplanned"
          class="cards__lesson-card--unplanned"
          :number="lesson.lessonNumber"
        >
          <p>Урок не запланирован</p>
        </GroupProfileDayScheduleCardNumbered>

        <GroupProfileScheduleLessonCard
          v-else
          :lessons-for-the-day-values="lesson"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import GroupProfileScheduleLessonCard from '@components/GroupProfile/GroupProfileDayScheduleCard/GroupProfileScheduleCardLesson.vue';
  import GroupProfileDayScheduleCardNumbered from '@components/GroupProfile/GroupProfileDayScheduleCard/GroupProfileDayScheduleCardNumbered.vue';

  const props = defineProps({
    weekdayName: {
      type: String,
      required: true,
    },
    lessonsForTheDay: {
      type: Array,
      required: true,
    },
  });

  const formattedLessonsForTheDay = computed(() => {
    const lessonsMap = new Map();
    for (let i = 1; i <= 7; i++) {
      const template = {
        lessonNumber: i,
        unplanned: true,
      };
      lessonsMap.set(`${i}`, template);
    }
    props.lessonsForTheDay.forEach(lesson => lessonsMap.set(lesson.lessonNumber, lesson));
    return [...lessonsMap.values()];
  });
</script>

<style scoped>
.cards {
	display: grid;
	width: 100%;

	gap: 10px;
	margin-top: 10px;
}

.day-schedule__title {
	width: 100%;
}

.cards__lesson-card--unplanned{
opacity: 0.5;
}

.day-schedule {
	width: 100%;
}
</style>