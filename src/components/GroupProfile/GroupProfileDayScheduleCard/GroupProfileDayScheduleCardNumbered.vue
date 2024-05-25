<template>
  <GroupProfileDayScheduleCard>
    <span class="card__lesson-number">
      {{ number }}
    </span>
    <div class="card__info-box">
      <slot />
    </div>
  </GroupProfileDayScheduleCard>
</template>

<script setup>
  import GroupProfileDayScheduleCard from '@components/GroupProfile/GroupProfileDayScheduleCard/GroupProfileDayScheduleCard.vue';

  defineProps(['number']);
</script>

<style scoped>
.card__lesson-number {
	display: grid;
	place-items: center;

	min-width: 35px;
	height: 35px;

	border-radius: 100%;
	background: #2196F3;
	color: rgb(255, 255, 255);
}

.card__info-box {
	display: grid;
	margin-left: 10px;
	width: 100%;
}
</style>