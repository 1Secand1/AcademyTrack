<template>
  <GroupProfileDayScheduleCardNumbered
    :number="lessonsForTheDayValues?.lessonNumber"
  >
    <div class="card__info-box-heder">
      <p class="card__teacher-name">
        {{ lessonsForTheDayValues?.teacherName }}
      </p>
      <span class="card__classRoom-number" v-if="lessonsForTheDayValues?.classRoomNumber">
        К {{ lessonsForTheDayValues?.classRoomNumber }}
      </span>
    </div>

    <p class="card__subject-name">
      {{ lessonsForTheDayValues?.subjectName }}
    </p>
  </GroupProfileDayScheduleCardNumbered>
</template>

<script setup>
import GroupProfileDayScheduleCard from '@components/GroupProfile/GroupProfileDayScheduleCard/GroupProfileDayScheduleCard.vue';
import GroupProfileDayScheduleCardNumbered from '@components/GroupProfile/GroupProfileDayScheduleCard/GroupProfileDayScheduleCardNumbered.vue';

const props = defineProps({
  lessonsForTheDayValues: {
    type: Object,
    required: true,
  }
});
</script>

<style scoped>
.card__info-box-heder {
	display: flex;
	justify-content: space-between;
}

.card__teacher-name {}

.card__subject-name {
	display: flex;
	display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
	-webkit-line-clamp: 2;
	-moz-line-clamp: 2;
	line-clamp: 2;

	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;

	margin-top: 5px;
	margin-bottom: auto;
	font-size: 12px;
}

.card__classRoom-number {
	width: min-content;
	white-space: nowrap;
	height: min-content;

	color: white;
	background: #2196F3;
	margin-left: auto;
	border-radius: 5px;
	padding: 1px 5px;
}
</style>