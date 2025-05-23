<template>
  <div class="group-card">
    <div class="group-card__avatar" />
    <div class="">
      <h5 class="group-card__title">
        {{ groupCode }}
      </h5>
      <p v-if="groupTitle" class="group-card__subtitle">
        {{ groupTitle }}
      </p>
      <p class="group-card__text">
        Студентов: {{ numberOfStudents }}
      </p>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    groupCode: String,
    groupTitle: String,
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

.group-card__title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}
.group-card__subtitle {
  font-size: 0.95rem;
  color: #888;
  margin: 0 0 2px 0;
}
.group-card__text {}
</style>