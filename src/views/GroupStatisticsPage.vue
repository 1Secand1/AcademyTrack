<template>
  Группа
  {{ groupCode }}
  <router-link to="/userGroups"></router-link>

  <DataTable
    editMode="cell"
    @cell-edit-complete="onCellEditComplete"
    :value="studentList"
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
          :header="lesson"
        />
      </Row>
    </ColumnGroup>
    <Column field="fullName" />
    <Column
      #body="slotProps"
      v-for='value in columnFields'
      :field="value"
    >
      {{ slotProps.data[value] || "" }}
    </Column>
  </DataTable>
</template>

<script setup>
import { getLessonAttendanceReport, getLessonPlan } from "@service/apiFunctions"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import DataTable from 'primevue/datatable'
import Row from 'primevue/row'

const route = useRoute()
const groupCode = ref("")

const lessonAttendanceReport = ref({})
const lessonPlan = ref([])

const lessonsByMonth = ref([])
const allLesson = ref([])
const studentList = ref([])
const columnFields = ref([])

function onCellEditComplete(event) {
  console.log(event)
}

function sortLessonsByMonth(lessons) {
  if (!Array.isArray(lessons)) {
    console.warn(1)
    return
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
    return
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
    return
  }

  return arr.map(({ fullName, attendance }) => {
    return { fullName, ...attendance }
  })
}

function log(e) {
  console.log(e)
}

function getColumnFields(lessons) {
  return lessons.map(({ date }) => date)
}

onMounted(async () => {
  groupCode.value = ref(route.query.codeGroup || "Неопределенно")
  lessonPlan.value = await getLessonPlan()
  lessonAttendanceReport.value = await getLessonAttendanceReport()
  lessonsByMonth.value = sortLessonsByMonth(lessonPlan.value.lessonsAttendance)
  allLesson.value = srtAllClasses(lessonPlan.value.lessonsAttendance)
  studentList.value = mergeStudentAndAttendance(lessonAttendanceReport.value.students)
  columnFields.value = getColumnFields(lessonPlan.value.lessonsAttendance)
})
</script>

<style>
.your-style-here {
  justify-content: center;
}
</style>