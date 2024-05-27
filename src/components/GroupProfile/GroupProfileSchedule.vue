<template>
  <div class="day-schedule">
    <div class="">
      <button @click="backGroup">
        Назад
      </button>

      <button @click="nextGroup">
        Вперёд
      </button>
    </div>

    <div class="day-schedule__day-cards">
      <GroupProfileDayScheduleCards
        v-for="schedule in currentScheduleCardGroup"
        :key="schedule.weekdayTextName"
        :weekday-name="schedule.weekdayTextName"
        :lessons-for-the-day="schedule.schedule"
      />
    </div>
  </div>
</template>

<script setup>
  import GroupProfileDayScheduleCards from '@components/GroupProfile/GroupProfileDaySchedule.vue';
  import { weekSchedules } from '@service/weekSchedules';
  import { computed, ref, watch } from 'vue';

  const screenWidth = ref(document.documentElement.clientWidth);

  const quantityElementsInGroup = computed(() => {
    if (screenWidth.value > 1400) return 3;
    if (screenWidth.value > 1020) return 2;
    return 1;
  });

  const scheduleCardGroups = computed(groupSchedulesSorted);
  const currentScheduleCardGroup = computed(() => scheduleCardGroups.value[currentScheduleCardGroupNumber.value]);
  const currentScheduleCardGroupNumber = ref(0);

  watch(scheduleCardGroups,() => {
    currentScheduleCardGroupNumber.value = 0;
  });

  function groupSchedulesSorted() {
    const numberOfGroups = Math.ceil(weekSchedules.length / quantityElementsInGroup.value);
    const groups = Array.from({ length: numberOfGroups }, () => []);

    for (let index = 0; index < weekSchedules.length; index++) {
      const groupNumber = Math.floor(index / quantityElementsInGroup.value);
      groups[groupNumber].push(weekSchedules[index]);
    }

    return groups;
  }

  function nextGroup() {

    if (currentScheduleCardGroupNumber.value >= scheduleCardGroups.value.length - 1) {
      return scheduleCardGroups.value.length - 1;
    }

    currentScheduleCardGroupNumber.value++;
  }

  function backGroup() {

    if (currentScheduleCardGroupNumber.value <= 0) {
      currentScheduleCardGroupNumber.value;
      return 0;
    }

    currentScheduleCardGroupNumber.value--;
  }

  window.addEventListener('resize', () => {
    screenWidth.value = document.documentElement.clientWidth;
  });
</script>

<style scoped>
.day-schedule__day-cards {
	width: 100%;
	height: 80svh;
	display: flex;
	overflow: auto;

	justify-content: space-between;

	margin-top: 20px;
	gap: 10px;
}

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

.day-schedule {
	width: 100%;
}
</style>