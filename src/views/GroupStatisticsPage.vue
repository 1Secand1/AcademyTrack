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
      :list='studentsList'
      :reportableDates='allLessonDates'
      @change='updateLessonAttendanceReport'
    />
  </Dialog>

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
      v-for='value in allLessonDates'
      :field="value"
    >
      {{ slotProps.data[value] || "" }}
    </Column>
  </DataTable>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

import Button from 'primevue/button'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Row from 'primevue/row'


import { getLessonAttendanceReport, getLessonPlan } from "@service/apiFunctions"

import attendanceListSelectionForm from '@components/attendanceListSelectionForm.vue'

const visible = ref(false)

const route = useRoute()
const groupCode = ref("")

const lessonAttendanceReport = ref({})
const lessonPlan = ref([])
const studentsList = ref()
const lessonsByMonth = ref([])
const allLesson = ref([])
const studentList = ref([])
const allLessonDates = ref([])

onMounted(async () => {
  groupCode.value = ref(route.query.codeGroup || "Неопределенно")
  lessonPlan.value = await getLessonPlan()
  lessonAttendanceReport.value = await getLessonAttendanceReport()
  studentsList.value = getListOfStudents(lessonAttendanceReport.value.students)
  lessonsByMonth.value = sortLessonsByMonth(lessonPlan.value.lessonsAttendance)
  allLesson.value = srtAllClasses(lessonPlan.value.lessonsAttendance)
  studentList.value = mergeStudentAndAttendance(lessonAttendanceReport.value.students)
  allLessonDates.value = getColumnFields(lessonPlan.value.lessonsAttendance)
})

function onCellEditComplete(event) {
  console.log(event)
}

function sortLessonsByMonth(lessons) {
  if (!Array.isArray(lessons)) {
    console.warn("lessons in not Array")
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

function getColumnFields(lessons) {
  return lessons.map(({ date }) => date)
}

function getListOfStudents(studentsArr) {
  return studentsArr.map(({ fullName }) => fullName)
}

function updateLessonAttendanceReport(report) {
  visible.value = false
  console.log(report)
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