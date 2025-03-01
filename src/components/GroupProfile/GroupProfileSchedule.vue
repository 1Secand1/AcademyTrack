<template>
  <div class="day-schedule">
    <div class="day-schedule__buttons">
      <Button
        class="button"
        label=""
        icon="pi pi-angle-left"
        @click="currentScheduleCardGroupNumber--"
      />
      <Button
        class="button"
        label=""
        icon="pi pi-angle-right"
        icon-pos="right"
        @click="currentScheduleCardGroupNumber++"
      />

      <SelectButton
        v-model="selectWeekTypeValue"
        class="select-week-type-button"
        :options="selectWeekTypeOptions"
        option-label="name"
        aria-labelledby="basic"
      />
    </div>

    <div class="day-schedule__day-cards">
      <GroupProfileDayScheduleCards
        v-for="schedule in currentScheduleCardGroup"
        :key="schedule.weekdayTextName"
        :weekday-name="schedule.weekdayTextName"
        :lessons-for-the-day="schedule.schedule"
      />
    </div>

    <div class="day-schedule__navigation-buttons" />
  </div>
</template>

<script setup>
  import Button from 'primevue/button';
  import SelectButton from 'primevue/selectbutton';

  import GroupProfileDayScheduleCards from '@components/GroupProfile/GroupProfileDaySchedule.vue';
  import { computed, ref, watch } from 'vue';
  import { weekSchedules } from '@service';

  const selectWeekTypeOptions = [
    { name: 'Числитель', value: 'numerator' },
    { name: 'Знаменатель', value: 'denominator' },
  ];
  const selectWeekTypeValue = ref(selectWeekTypeOptions[0]);

  const screenWidth = ref(document.documentElement.clientWidth);

  const currentScheduleCardGroupNumber = ref(0);

  const currentWeekSchedules = computed(() => weekSchedules[selectWeekTypeValue.value.value]);

  const scheduleCardGroups = computed(groupSchedulesSorted);
  const currentScheduleCardGroup = computed(() => scheduleCardGroups.value[currentScheduleCardGroupNumber.value]);

  const quantityElementsInGroup = computed(() => {
    if (screenWidth.value > 1400) return 3;
    if (screenWidth.value > 1130) return 2;
    return 1;
  });

  watch(currentScheduleCardGroupNumber,(newCardGroupNumber) => {
    if (newCardGroupNumber >= scheduleCardGroups.value.length) {
      currentScheduleCardGroupNumber.value--;
    }

    if (newCardGroupNumber < 0) {
      currentScheduleCardGroupNumber.value++;
    }
  });

  watch(scheduleCardGroups,(newScheduleCardGroups,oldScheduleCardGroups) => {
    if (newScheduleCardGroups.length !== oldScheduleCardGroups.length) {
      currentScheduleCardGroupNumber.value = 0;
    }
  });

  function groupSchedulesSorted() {
    const numberOfGroups = Math.ceil(currentWeekSchedules.value.length / quantityElementsInGroup.value);
    const groups = Array.from({ length: numberOfGroups }, () => []);

    for (let index = 0; index < currentWeekSchedules.value.length; index++) {
      const groupNumber = Math.floor(index / quantityElementsInGroup.value);
      groups[groupNumber].push(currentWeekSchedules.value[index]);
    }

    return groups;
  }

  window.addEventListener('resize', () => {
    screenWidth.value = document.documentElement.clientWidth;
  });
</script>

<style scoped>
.day-schedule__day-cards {
	width: 100%;
	display: flex;
	overflow: auto;

	justify-content: space-between;
  align-items: center;

	margin-top: 10px;
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

.button{
  max-width: 100px;
}

.select-week-type-button{
  max-width: 300px;
  display: flex;
}

.day-schedule__buttons{
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.day-schedule__navigation-buttons{
  max-width: 200px;
  display: flex;
  gap: 10px;
}

.day-schedule {
  width: 100%;
}
</style>