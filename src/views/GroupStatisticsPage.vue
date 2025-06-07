<template>
  <div class="heder">
    <div class="row">
      Группа {{ lessonPlan?.groupCode || 'Название группы не определннно' }}
      <Button
        label="Вернуться"
        @click="goBack"
      />
    </div>

    <div class="row">
      <Dropdown
        v-if="months.length"
        v-model="selectedMonth"
        :options="months"
        option-label="label"
        option-value="value"
        class="month-dropdown"
      />
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
    :lesson-plan="filteredLessonPlan"
    :lesson-attendance-report="filteredLessonAttendanceReport"
    @cell-edit-complete="onCellEditComplete"
  />
</template>

<script setup>
  import attendanceListSelectionForm from '@components/AttendanceListSelectionForm.vue';
  import AttendanceDataTable from '@components/GroupStatisticsPage/GroupStatisticsPageAttendanceTable.vue';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import Dropdown from 'primevue/dropdown';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { scheduleService } from '@service/api-endpoints/schedule.js';
  import { attendanceService } from '@service/api-endpoints/attendance.js';
  import { monthNameDateFormatter } from '@utils/monthNameDateFormatter.js';

  const route = useRoute();
  const router = useRouter();

  const reportWindowVisible = ref(false);

  const lessonAttendanceReport = ref({});
  const lessonPlan = ref([]);

  const months = ref([]);
  const selectedMonth = ref(null);

  const props = defineProps({
    teachingAssignmentId: { type: String, required: true },
    groupId: { type: String, required: true },
  });

  const { teachingAssignmentId, groupId } = props;

  onMounted(async () => {
    try {
      if (!teachingAssignmentId) {
        console.error('teachingAssignmentId is required');
        return;
      }

      const [scheduleResponse, attendanceResponse] = await Promise.all([
        scheduleService.get('', { teachingAssignmentId: teachingAssignmentId }),
        attendanceService.getGroupSummary(groupId),
      ]);

      lessonPlan.value = scheduleResponse[0] ?? [];

      lessonAttendanceReport.value = attendanceResponse[0] ?? [];

      // Получаем список месяцев с занятиями
      const lessons = lessonPlan.value.lessonsAttendance || [];
      const monthSet = new Set(lessons.map(l => {
        const d = new Date(l.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`;
      }));
      months.value = Array.from(monthSet).sort().map(m => {
        const [year, month] = m.split('-');
        return {
          value: m,
          label: `${monthNameDateFormatter.format(new Date(year, month - 1, 1))} ${year}`,
        };
      });
      // По умолчанию — текущий месяц, если его нет — последний
      const now = new Date();
      const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}`;
      selectedMonth.value = months.value.find(m => m.value === current)?.value || (months.value.at(-1)?.value ?? null);
    } catch (error) {
      console.error('Error loading data:', error);
      // Здесь можно добавить отображение ошибки пользователю
    }
  });

  // Фильтрация занятий по выбранному месяцу
  const filteredLessonPlan = computed(() => {
    if (!selectedMonth.value) return lessonPlan.value;
    const lessonsAttendance = (lessonPlan.value.lessonsAttendance || []).filter(l => {
      const d = new Date(l.date);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}`;
      return m === selectedMonth.value;
    });
    return { ...lessonPlan.value, lessonsAttendance };
  });

  const filteredLessonAttendanceReport = computed(() => {
    if (!selectedMonth.value) return lessonAttendanceReport.value;
    // Можно добавить фильтрацию по датам, если нужно
    return lessonAttendanceReport.value;
  });

  const studentList = computed(() => {
    const { students } = lessonAttendanceReport.value || {};
    console.log(lessonAttendanceReport.value);

    console.log(students);

    if (!Array.isArray(students) || students.length === 0) { return []; }

    return students.map(({ student }) => ({ ...student }));
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
      teachingAssignmentId: teachingAssignmentId,
      students: getStudentsAttendanceReport(studentIds, classAttendanceStatus),
    };

    attendanceService.create(updateRequestBody);

    updateStudentsAttendanceReport(studentIds, classAttendanceStatus, date);

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

  function goBack() {
    router.push({ name: 'group-attendance' });
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

.month-dropdown {
  min-width: 200px;
  margin-right: 20px;
}
</style>
