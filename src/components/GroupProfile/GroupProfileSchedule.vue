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
			<GroupProfileDayScheduleCards />
			<GroupProfileDayScheduleCards />
			<GroupProfileDayScheduleCards />
		</div>
	</div>
</template>

<script setup>
import GroupProfileDayScheduleCards from "@components/GroupProfile/GroupProfileDayScheduleCards.vue"

</script>

<style scoped>
.day-schedule__day-cards {
	display: flex;
	justify-content: space-between;

	margin-top: 20px;
	gap: 10px;
}

.day-schedule__day-cards {}

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
</style>