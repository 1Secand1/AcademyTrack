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
    :style="{ width: '40rem' }"
  >
    <attendanceListSelectionForm
      :list="studentList"
      :reportable-dates="allLessonDates"
      @change="changeLessonAttendanceReport"
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
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { scheduleService } from '@service/api-endpoints/schedule.js';
  import { attendanceService } from '@service/api-endpoints/attendance.js';
  import { monthNameDateFormatter } from '@utils/monthNameDateFormatter.js';

  const route = useRoute();
  const groupCode = ref(route.query.codeGroup ?? 'Неопределенно');

  const reportWindowVisible = ref(false);

  const lessonAttendanceReport = ref({});
  const lessonPlan = ref([]);

  onMounted(async () => {
    lessonPlan.value = (await scheduleService.get())[0] ?? [];
    lessonAttendanceReport.value = (await attendanceService.get())[0] ?? [];
  });

  const studentList = computed(() => {
    const { students } = lessonAttendanceReport.value;

    if (!Array.isArray(students) && !students.length === 0) {
      console.error('The value passed must be an Array');
      return [];
    }

    return students.map(({ fullName, studentId }) => ({ fullName, studentId }));
  });

  const allLessonDates = computed(() => {
    const { lessonsAttendance } = lessonPlan.value;

    const foo =  lessonsAttendance.reduce((acc, scheduledSession) => {
      const { date,lessonNumber } = scheduledSession;

      const dateObj = new Date(date);
      const month = dateObj.getMonth();
      const monthName = monthNameDateFormatter.format(dateObj);
      const day = dateObj.getDate();

      if (!(month in acc.months)) {
        acc.months[month] = {
          monthName,
          monthNumber: month,
          days:{},
        };
      }
      if (!(day in acc.months[month].days)) {
        acc.months[month].days[day] = {
          dayNumber: day,
          lessons:{},
        };
      }

      acc.months[month].days[day].lessons[lessonNumber] = { ...scheduledSession };

      return acc;
    },{ months:{} });

    return foo;
  });

  function onCellEditComplete(event) {
    console.log('Cell edit completed:', event);
  }

  function changeLessonAttendanceReport({ attendanceList, scheduleId, date, classAttendanceStatus }) {
    const studentIds = attendanceList.map(({ studentId }) => studentId);

    const updateRequestBody = {
      scheduleId,
      students: getStudentsAttendanceReport(studentIds, classAttendanceStatus),
    };

    attendanceService.create(updateRequestBody);

    updateStudentsAttendanceReport(studentIds,classAttendanceStatus, date);

    reportWindowVisible.value = false;
  }

  function updateStudentsAttendanceReport(studentIds, classAttendanceStatus, date) {
    const attendanceSet = new Set(studentIds);

    lessonAttendanceReport.value.students.forEach((student) => {
      if (classAttendanceStatus) {
        student.attendance[date] = attendanceSet.has(student.studentId) ? 'attended' : 'absent';
      } else {
        student.attendance[date] = attendanceSet.has(student.studentId) ? 'absent' : 'attended';
      }
    });
  }

  function getStudentsAttendanceReport(studentIds, classAttendanceStatus) {
    const mapStudentIds = new Set(studentIds);

    return studentList.value.map(({ studentId }) => {
      let status;
      if (classAttendanceStatus) {
        status = mapStudentIds.has(studentId) ? 'PRESENT' : 'ABSENT' ;
      } else {
        status = mapStudentIds.has(studentId) ? 'ABSENT' : 'PRESENT' ;
      }
      return { studentId, status };
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
