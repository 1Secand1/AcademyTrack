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
      v-for='value in columnFields'
      :field="value"
    />
  </DataTable>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import DataTable from 'primevue/datatable'
import Row from 'primevue/row'

const serverResponse = {
  "dateOfTheLastLesson": "2024-10-22",
  "teacherFullName": "Иванова Тамара Ивановна",
  "groupCode": "ИСП-216",
  "totalStudents": 2,
  "students": [
    {
      "fullName": "Боев Владислав Владимирович",
      "attendance": {
        "2024-09-15": "attended",
        "2024-09-22": "attended",
        "2024-10-15": "attended",
        "2024-10-22": "sick"
      }
    },

    {
      "fullName": "Иванов Иван Иваныч",
      "attendance": {
        "2024-09-15": "attended",
        "2024-09-22": "attended",
        "2024-10-15": "attended",
        "2024-10-22": "attended"
      }
    }
  ]
}
const lessonPlan = {
  "groupCode": "ИСП-216",
  "teacherFullName": "Иванова Тамара Ивановна",
  "subject": "Математика",
  "lessonsAttendance": [
    {
      "lessonNumber": 1,
      "date": "2024-09-15",
      "status": "completed",
      "attended": 25,
      "absent": 3
    },
    {
      "lessonNumber": 1,
      "date": "2024-09-22",
      "status": "completed",
      "attended": 23,
      "absent": 5
    },
    {
      "lessonNumber": 1,
      "date": "2024-10-15",
      "status": "planned",
    },
    {
      "lessonNumber": 1,
      "date": "2024-10-22",
      "status": "planned",
    },
    {
      "lessonNumber": 1,
      "date": "2024-12-22",
      "status": "planned",
    },
  ]
}

const route = useRoute()
const groupCode = ref(route.query.codeGroup)

const lessonsByMonth = sortLessonsByMonth(lessonPlan.lessonsAttendance)
const allLesson = srtAllClasses(lessonPlan.lessonsAttendance)
const studentList = mergeStudentAndAttendance(serverResponse.students)
const columnFields = getColumnFields(lessonPlan.lessonsAttendance)

function onCellEditComplete(event) {
  console.log(event)
}


function sortLessonsByMonth(lessons) {
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

onMounted(async () => {

})
</script>

<style></style>