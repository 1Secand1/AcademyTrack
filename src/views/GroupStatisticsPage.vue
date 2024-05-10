<template>
  <div class="heder">
    <div class="row">
      Группа {{ groupCode }}
      <router-link to="/userGroups">Вернуться</router-link>
    </div>

    <div class="row">
      <Button
        @click="visible = true"
        label="добавить отчёт"
      />
    </div>
  </div>

  <Dialog
    v-model:visible="visible"
    modal
    header="Отчёт о посещаемости"
    :style="{ width: '30rem' }"
  >
    <attendanceListSelectionForm
      :list="studentNames"
      :reportableDates="allLessonDates"
      @change="updateLessonAttendanceReport"
    />
  </Dialog>

  <AttendanceDataTable
    :lessonPlan="lessonPlan"
    :lessonAttendanceReport="lessonAttendanceReport"
    @cell-edit-complete="onCellEditComplete"
  />
</template>

<script setup>
import attendanceListSelectionForm from '@components/AttendanceListSelectionForm.vue'
import AttendanceDataTable from '@components/GroupStatisticsPage/GroupStatisticsPageAttendanceTable.vue'
import { getLessonAttendanceReport, getLessonPlan } from '@service/apiFunctions'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const groupCode = ref(route.query.codeGroup ?? 'Неопределенно')

const visible = ref(false)
const lessonAttendanceReport = ref({})
const lessonPlan = ref([])
const studentNames = ref([])

const allLessonDates = computed(() => {
  if (!Array.isArray(lessonPlan.value.lessonsAttendance)) {
    return []
  }
  return lessonPlan.value.lessonsAttendance.map(({ date }) => date)
})

onMounted(async () => {
  lessonPlan.value = await getLessonPlan()
  lessonAttendanceReport.value = await getLessonAttendanceReport()
  studentNames.value = getListOfStudents(lessonAttendanceReport.value.students)
})

function onCellEditComplete(event) {
  console.log('Cell edit completed:', event)
}

function getListOfStudents(studentsArr) {
  if (!Array.isArray(studentsArr)) {
    console.error('The value passed must be an Array')
    return []
  }

  if (studentsArr.length === 0) []

  return studentsArr.map(({ fullName }) => fullName)
}

function updateLessonAttendanceReport({ attendanceList, date }) {
  visible.value = false

  const attendanceSet = new Set(attendanceList)

  lessonAttendanceReport.value.students.forEach((student) => {
    const attendanceStatus = attendanceSet.has(student.fullName)
      ? "attended"
      : "absent"

    student.attendance[date] = attendanceStatus
  })
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
