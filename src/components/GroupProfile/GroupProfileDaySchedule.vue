<template>
  <div class="day-schedule">
    <h3 class="day-schedule__title">
      {{ weekdayName }}
    </h3>
    <div class="cards">
      <template
        v-for="pair in lessonsForTheDay"
        :key="pair.lessonNumber"
      >
        <GroupProfileDayScheduleCardNumbered
          v-if="!pair.lessons || !pair.lessons.length"
          class="cards__lesson-card--unplanned"
          :number="pair.lessonNumber"
        >
          <p>Урок не запланирован</p>
        </GroupProfileDayScheduleCardNumbered>
        <template v-else>
          <GroupProfileScheduleLessonCard
            v-for="lesson in pair.lessons"
            :key="lesson.lessonNumber + '-' + lesson.subjectName + '-' + lesson.teacherName"
            :lessons-for-the-day-values="lesson"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import GroupProfileScheduleLessonCard from '@components/GroupProfile/GroupProfileDayScheduleCard/GroupProfileScheduleCardLesson.vue';
import GroupProfileDayScheduleCardNumbered from '@components/GroupProfile/GroupProfileDayScheduleCard/GroupProfileDayScheduleCardNumbered.vue';

const props = defineProps({
  weekdayName: {
    type: String,
    required: true,
  },
  lessonsForTheDay: {
    type: Array, // [{ lessonNumber, lessons: [ ... ] }]
    required: true,
  }
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