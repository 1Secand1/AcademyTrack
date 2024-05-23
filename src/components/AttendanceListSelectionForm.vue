<template>
  <div class="heder">
    <h4>
      Дата проведения занятия
    </h4>

    <div class="">
      <Dropdown
        v-model="selectedMonths"
        :options="optionsMonths"
        option-label="month"
        placeholder="Месяц"
      />
      <Dropdown
        v-model="selectedDay"
        :options="optionsDays"
        option-label="day"
        placeholder="День"
      />
    </div>
  </div>

  <hr />

  <section>
    <label
      v-for="student in list "
      :key="student.id"
      class="studentSelectionBox"
      :for="student"
    >
      <p>{{ student }}</p>
      <Checkbox
        v-model="attendanceList"
        :input-id="student"
        name="attendanceList"
        :value="student"
      />
    </label>
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

  import { monthNameDateFormatter } from '@utils/monthNameDateFormatter'
  import { computed, defineProps, ref, toRaw } from 'vue';

  const emit = defineEmits(['change']);
  const props = defineProps({
    list: Array,
    reportableDates: Array,
  });

  const groupDaysByMonth = getGroupDaysByMonth(props.reportableDates);

  const optionsMonths = ref(getOptionsMonthsList(props.reportableDates));
  const selectedMonths = ref(currentMonthSearch(optionsMonths.value));

  const optionsDays = computed(() => {
    return groupDaysByMonth[selectedMonths.value.month];
  });
  const selectedDay = ref(currentDaySearch(optionsDays.value));

  const attendanceList = ref([]);


  function currentMonthSearch(optionsMonths) {
    const nameMonth = monthNameDateFormatter.format(new Date());
    return optionsMonths.find(monthObj => monthObj.month === nameMonth) || {};
  }

  function currentDaySearch(optionsDays) {
    const currentDay = new Date().getDate();
    return optionsDays.find(optionsDay => optionsDay.day === currentDay) || {};
  }

  function getOptionsMonthsList(reportableDates) {
    const uniqueDates = new Set(reportableDates.map(date => monthNameDateFormatter.format( new Date(date))));
    return Array.from(uniqueDates).map(nameMonth => ({ month: nameMonth }));
  }

  function getGroupDaysByMonth(dataArr) {
    if (!Array.isArray(dataArr)) {
      throw new Error('dataArr is not Array');
    }

    return dataArr.reduce((acc, reportableDates) => {
      const currentDate = new Date(reportableDates);
      const nameMonth = monthNameDateFormatter.format(currentDate);
      const day = currentDate.getDate();

      acc[nameMonth] = acc[nameMonth] || [];
      acc[nameMonth].push({ day,reportableDates });
      return acc;
    }, {});
  }

  function change() {
    if (!selectedDay.value.reportableDates) {
      console.warn('reportableDates undefined');
      return;
    }

    emit('change', {
      date: selectedDay.value.reportableDates,
      attendanceList: toRaw(attendanceList.value),
    });
  }
</script>

<style>
.studentSelectionBox {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.heder {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.button {
	display: flex;
	width: 100%;
}
</style>