<template>
	<div class="card">
		<span class="card__lesson-number">
			{{ lessonsForTheDayValues?.lessonNumber }}
		</span>
		<div class="card__info-box">
			<div class="card__info-box-heder">
				<p class="card__teacher-name">
					{{ lessonsForTheDayValues?.teacherName }}
				</p>
				<span class="card__cabinet-number">
					К {{ lessonsForTheDayValues?.cabinetNumber }}
				</span>
			</div>

			<p class="card__subject-name">
				{{ lessonsForTheDayValues?.subjectName }}
			</p>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	lessonsForTheDayValues: Object
})

</script>

<style scoped>
.card {
	display: flex;
	width: 380px;
	height: 75px;

	padding: 10px;
	align-items: center;
	border-radius: 5px;
	border: solid 1px #2196F3;

	cursor: pointer;
}

.card__lesson-number {
	display: grid;
	place-items: center;

	min-width: 35px;
	height: 35px;

	border-radius: 100%;
	background: #2196F3;
	color: white;
}

.card__info-box {
	display: grid;
	margin-left: 10px;
	width: 100%;
	overflow: hidden;
}

.card__info-box-heder {
	display: flex;
	justify-content: space-between;
}

.card__teacher-name {}

.card__subject-name {
	display: -webkit-flex;
	display: -moz-flex;
	display: -ms-flex;
	display: -webkit-box;


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

.card__cabinet-number {
	width: min-content;
	white-space: nowrap;
	height: min-content;

	color: wheat;
	background: #2196F3;
	margin-left: auto;
	border-radius: 5px;
	padding: 1px 5px;
}
</style>