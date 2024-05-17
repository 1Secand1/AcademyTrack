<template>
	<div class="day-schedule">
		<h3 class='day-schedule__title'>Понедельник</h3>
		<div class="cards">
			<GroupProfileScheduleLessonCard />
			<GroupProfileScheduleLessonCard />
			<GroupProfileScheduleLessonCard />
			<GroupProfileScheduleLessonCard />
			<GroupProfileScheduleLessonCard />
			<GroupProfileScheduleLessonCard />
			<GroupProfileScheduleLessonCard />
		</div>
	</div>
</template>

<script setup>
import GroupProfileScheduleLessonCard from "./GroupProfileScheduleLessonCard.vue"

</script>

<style scoped>
.cards {
	display: grid;
	width: 100%;

	gap: 10px;
	margin-top: 10px;
}
</style>