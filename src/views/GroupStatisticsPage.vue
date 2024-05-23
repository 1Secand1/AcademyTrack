<template>
  <div class="heder">
    <div class="row">
      Группа {{ groupCode }}
      <router-link to="/userGroups">
        Вернуться
      </router-link>
    </div>

    <div class="row">
      <Button
        label="добавить отчёт"
        @click="reportWindowVisible = true"
      />
    </div>
  </div>

  <Dialog
    v-model:visible="reportWindowVisible"
    modal
    header="Отчёт о посещаемости"
    :style="{ width: '30rem' }"
  >
    <attendanceListSelectionForm
      :list="studentNames"
      :reportable-dates="allLessonDates"
      @change="updateLessonAttendanceReport"
    />
  </Dialog>

  <AttendanceDataTable
    :lesson-plan="lessonPlan"
    :lesson-attendance-report="lessonAttendanceReport"
    @cell-edit-complete="onCellEditComplete"
  />
</template>

<script setup>
  import attendanceListSelectionForm from '@components/AttendanceListSelectionForm.vue';
  import AttendanceDataTable from '@components/GroupStatisticsPage/GroupStatisticsPageAttendanceTable.vue';
  import { getLessonAttendanceReport, getLessonPlan } from '@service/apiFunctions';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const groupCode = ref(route.query.codeGroup ?? 'Неопределенно');

  const reportWindowVisible = ref(false);

  const lessonAttendanceReport = ref({});
  const lessonPlan = ref([]);

  onMounted(async () => {
    lessonPlan.value = await getLessonPlan();
    lessonAttendanceReport.value = await getLessonAttendanceReport();
  });

  const studentNames = computed(() => {
    const { students } = lessonAttendanceReport.value;

    if (!Array.isArray(students) && !students.length === 0) {
      console.error('The value passed must be an Array');
      return [];
    }

    return students.map(({ fullName }) => fullName);
  });

  const allLessonDates = computed(() => {
    const { lessonsAttendance } = lessonPlan.value;

    if (!Array.isArray(lessonsAttendance) && !lessonsAttendance.length === 0) {
      return [];
    }

    return lessonPlan.value.lessonsAttendance.map(({ date }) => date);
  });

  function onCellEditComplete(event) {
    console.log('Cell edit completed:', event);
  }

  function updateLessonAttendanceReport({ attendanceList, date }) {
    reportWindowVisible.value = false;

    const attendanceSet = new Set(attendanceList);

    lessonAttendanceReport.value.students.forEach((student) => {
      const attendanceStatus = attendanceSet.has(student.fullName) ? 'attended' : 'absent';

      student.attendance[date] = attendanceStatus;
    });
  }
</script>

<style scoped>
.row {
  display: flex;
}

.heder {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  align-items: center;
}
</style>
