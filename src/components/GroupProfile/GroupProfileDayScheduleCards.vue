<template>
  <div class="day-schedule">
    <h3 class="day-schedule__title">
      {{ weekdayName }}
    </h3>
    <div class="cards">
      <GroupProfileScheduleLessonCard
        v-for="lesson in lessonsForTheDay"
        :key="lesson"
        :lessons-for-the-day-values="lesson"
      />
    </div>
  </div>
</template>

<script setup>
import GroupProfileScheduleLessonCard from "./GroupProfileScheduleLessonCard.vue"

const props = defineProps({
	weekdayName: {
		type: String,
		required: true,
	},
	lessonsForTheDay: {
		type: Object,
		required: true,
	}
})

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

.day-schedule {
	width: 100%;
}
</style>