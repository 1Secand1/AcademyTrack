<template>
  <div class="group-card">
    <div class="group-card__avatar" />
    <div class="">
      <h5 class="group-card__title">
        {{ groupName }}
      </h5>
      <p class="group-card__text">
        Студентов: {{ numberOfStudents }}
      </p>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    groupName: String,
    numberOfStudents: [String, Number],
  });
</script>

<style>
.group-card__avatar {
	width: 30px;
	height: 30px;
	border-radius: 100%;
	background: #797878;
}

.group-card {
	display: flex;
	align-items: center;

	min-width: 200px;

	border-radius: 5px;
	background: white;
	border: solid #9A9B9C 1px;
	cursor: pointer;

	padding: 10px 10px;
	gap: 10px;
}

.group-card__title {}

.group-card__text {}
</style>