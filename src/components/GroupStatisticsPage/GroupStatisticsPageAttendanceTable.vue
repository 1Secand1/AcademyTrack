<template>
  <DataTable
    edit-mode="cell"
    :value="studentAttendanceDetails"
    striped-rows
    show-gridlines
    @cell-edit-complete="onCellEditComplete"
  >
    <ColumnGroup type="header">
      <Row>
        <Column
          header="Фио"
          :rowspan="2"
          :colspan="1"
        />
        <Column
          v-for="(value, key) in lessonsByMonth"
          :key="key"
          :header="key"
          :colspan="value"
        />
      </Row>
      <Row>
        <Column
          v-for="lesson in allLessons"
          :key="lesson"
          :header="lesson"
        />
      </Row>
    </ColumnGroup>
    <Column field="fullName" />
    <Column
      v-for="value in allLessonDates"
      #body="slotProps"
      :key="value"
      :field="value"
    >
      {{ slotProps.data[value] || "" }}
    </Column>
  </DataTable>
</template>

<script setup>
  import Column from 'primevue/column';
  import ColumnGroup from 'primevue/columngroup';
  import DataTable from 'primevue/datatable';
  import Row from 'primevue/row';

  import { monthNameDateFormatter } from '@utils/monthNameDateFormatter';
  import { computed, defineProps } from 'vue';

  const props = defineProps({
    lessonPlan: Object,
    lessonAttendanceReport: Object,
  });

  const emit = defineEmits(['cell-edit-complete']);

  const lessonsByMonth = computed(() => sortLessonsByMonth(props.lessonPlan.lessonsAttendance ?? []));
  const allLessons = computed(() => sortAllClasses(props.lessonPlan.lessonsAttendance ?? []));
  const studentAttendanceDetails = computed(() => mergeStudentAndAttendance(props.lessonAttendanceReport.students ?? []));
  const allLessonDates = computed(() => getColumnFields(props.lessonPlan.lessonsAttendance ?? []));

  function onCellEditComplete(event) {
    emit('cell-edit-complete', event);
  }

  function sortLessonsByMonth(lessons) {
    if (!Array.isArray(lessons)) {
      console.warn('lessons in not Array');
      return {};
    }

    return lessons.reduce((acc, { date }) => {
      const month = monthNameDateFormatter.format(new Date(date));
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
  }

  function sortAllClasses(arr) {
    if (!Array.isArray(arr)) {
      console.error('The value passed must be an Array');
      return [];
    }

    return arr.map((lesson) => {
      const { date } = lesson;
      const dayLesson = date.split('-')[2];
      return dayLesson;
    });
  }

  function mergeStudentAndAttendance(arr) {
    if (!Array.isArray(arr)) {
      console.error('The value passed must be an Array');
      return [];
    }

    return arr.map(({ fullName, attendance }) => {
      return { fullName, ...attendance };
    });
  }

  function getColumnFields(lessons) {
    if (!Array.isArray(lessons)) {
      console.error('The value passed must be an Array');
      return [];
    }
    return lessons.map(({ date }) => date);
  }
</script>