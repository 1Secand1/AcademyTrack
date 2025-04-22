<template>
  <div class="header">
    <div class="header-row-wrapper">
      <h4>
        Дата проведения занятия
      </h4>

      <div class="header__dropdown-row">
        <Dropdown
          v-model="selectedMonths"
          :options="optionsMonths"
          option-label="monthName"
          placeholder="Месяц"
        />
        <Dropdown
          v-model="selectedDay"
          :options="optionsDays"
          option-label="dayNumber"
          placeholder="День"
          @change="setDay"
        />
        <Dropdown
          v-model="selectedLessons"
          :options="optionsLessons"
          option-label="lessonNumber"
          placeholder="Пара"
        />
      </div>
    </div>

    <SelectButton
      v-model="classAttendanceStatus"
      class="class-attendance-status-select"
      :pt="{
        root: { class: 'settings__select-button' },
        button: { style: 'width:50% !important' }
      }"
      :options="fooOptions"
      option-value="value"
      option-label="name"
      aria-labelledby="basic"
      :allow-empty="false"
      :unselectable="false"
    />
  </div>

  <hr />

  <section>
    <div class="studentSelectionWrapper">
      <label
        v-for="student in list"
        :key="student.studentId"
        class="studentSelectionBox"
        :for="student"
      >
        <p>{{ student.fullName }}</p>
        <Checkbox
          v-model="attendanceList"
          :input-id="`${student.studentId}`"
          name="attendanceList"
          :value="student"
        />
      </label>
    </div>
  </section>

  <Button
    label="Отправить"
    class="button"
    @click="change"
  />
</template>

<script setup>
  import Button from 'primevue/button';
  import Checkbox from 'primevue/checkbox';
  import Dropdown from 'primevue/dropdown';

  import { computed, defineProps, ref, toRaw } from 'vue';
  import SelectButton from 'primevue/selectbutton';

  const emit = defineEmits(['change']);
  const props = defineProps({
    list: Array,
    reportableDates: Array,
  });

  const optionsMonths = ref(getOptionsMonthsList());
  const selectedMonths = ref(currentMonthSearch(optionsMonths.value));

  const optionsDays = computed(() => {
    const month = props.reportableDates.months[selectedMonths.value.monthNumber];
    const daysArray = Object.values(month.days);
    const dayNumbers =  daysArray.map(({ dayNumber }) => ({ dayNumber }));

    return dayNumbers;
  });
  const selectedDay = ref(currentDaySearch());

  const optionsLessons = computed(() => {
    const month = props.reportableDates.months[selectedMonths.value.monthNumber];
    const day = month.days[selectedDay.value.dayNumber];
    const lessonsArray = Object.values(day.lessons);

    return lessonsArray;
  });
  const selectedLessons = ref(currentLessonSearch());

  const attendanceList = ref([]);

  const fooOptions = [
    { name: 'Отметить присутствующих', value: true },
    { name: 'Отметить отсутствующих', value: false },
  ];

  const classAttendanceStatus = ref(true);

  function currentMonthSearch(optionsMonths) {
    return optionsMonths[0];
  }

  function currentDaySearch() {
    return optionsDays.value[0];
  }

  function currentLessonSearch() {
    return optionsLessons.value[0];
  }

  function getOptionsMonthsList() {
    const monthsArray = Object.values(props.reportableDates.months);
    return monthsArray.map(({ monthName,monthNumber }) => ({ monthName,monthNumber }));
  }

  function setDay() {
    selectedLessons.value = currentLessonSearch();
  }

  function change() {
    emit('change', {
      date: selectedLessons.value.date,
      scheduleId: selectedLessons.value.scheduleId,
      attendanceList: toRaw(attendanceList.value),
      classAttendanceStatus: classAttendanceStatus.value,
    });
  }
</script>

<style scoped>
.header__dropdown-row{
  display: flex;
  gap: 10px;
}
.studentSelectionBox {
	display: flex;
  min-height: 35px;
	justify-content: space-between;
	align-items: center;
  padding: 5px 10px;
}

.studentSelectionWrapper .studentSelectionBox:nth-child(2n) {
  background-color: #f0f0f0;
}

.class-attendance-status-select{
  margin-top: 10px;
}

.header-row-wrapper{
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.button {
	display: flex;
	width: 100%;
  margin-top: 10px;
}
</style>