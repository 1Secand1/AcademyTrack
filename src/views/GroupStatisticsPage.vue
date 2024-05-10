<template>
  <div class="heder">
    <div class="row">
      Группа {{ groupCode }}
      <router-link to="/userGroups">Вернутся</router-link>
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
      :list='studentNames'
      :reportableDates='allLessonDates'
      @change='updateLessonAttendanceReport'
    />
  </Dialog>

  <DataTable
    editMode="cell"
    @cell-edit-complete="onCellEditComplete"
    :value="studentAttendanceDetails"
    stripedRows
    showGridlines
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
          :key='key'
          :header="key"
          :colspan="value"
        />
      </Row>
      <Row>
        <Column
          v-for='lesson in allLesson'
          :key='lesson'
          :header="lesson"
        />
      </Row>
    </ColumnGroup>
    <Column field="fullName" />
    <Column
      #body="slotProps"
      v-for='value in allLessonDates'
      :key='value'
      :field="value"
    >
      {{ slotProps.data[value] || "" }}
    </Column>
  </DataTable>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"

import Button from 'primevue/button'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Row from 'primevue/row'


import { getLessonAttendanceReport, getLessonPlan } from "@service/apiFunctions"

import attendanceListSelectionForm from '@components/attendanceListSelectionForm.vue'

const route = useRoute()
const groupCode = ref(route.query.codeGroup ?? "Неопределенно")

const visible = ref(false)

const lessonAttendanceReport = ref({})
const lessonPlan = ref([])

const studentNames = ref([])

const lessonsByMonth = computed(() => sortLessonsByMonth(lessonPlan.value.lessonsAttendance ?? []))
const allLesson = computed(() => srtAllClasses(lessonPlan.value.lessonsAttendance ?? []))
const studentAttendanceDetails = computed(() => mergeStudentAndAttendance(lessonAttendanceReport.value.students ?? []))
const allLessonDates = computed(() => getColumnFields(lessonPlan.value.lessonsAttendance ?? []))

onMounted(async () => {
  lessonPlan.value = await getLessonPlan()
  lessonAttendanceReport.value = await getLessonAttendanceReport()
  studentNames.value = getListOfStudents(lessonAttendanceReport.value.students)
})


function onCellEditComplete(event) {
  console.log(event)
}

function sortLessonsByMonth(lessons) {
  if (!Array.isArray(lessons)) {
    console.warn("lessons in not Array")
    return []
  }

  return lessons.reduce((acc, { date }) => {
    const month = new Date(date).toLocaleString('ru', { month: 'long' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})
}

function srtAllClasses(arr) {
  if (!Array.isArray(arr)) {
    console.error("The value passed must be an Array")
    return []
  }

  return arr.map((lesson) => {
    const { date } = lesson
    const dayLesson = date.split('-')[2]
    return dayLesson
  })
}

function mergeStudentAndAttendance(arr) {
  if (!Array.isArray(arr)) {
    console.error("The value passed must be an Array")
    return []
  }

  return arr.map(({ fullName, attendance }) => {
    return { fullName, ...attendance }
  })
}

function getColumnFields(lessons) {
  if (!Array.isArray(lessons)) {
    console.error("The value passed must be an Array")
    return []
  }
  return lessons.map(({ date }) => date)
}

function getListOfStudents(studentsArr) {
  if (!Array.isArray(studentsArr)) {
    console.error("The value passed must be an Array")
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
.your-style-here {
  justify-content: center;
}

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