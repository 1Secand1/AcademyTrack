<template>
  Группа
  {{ groupCode }}
  <router-link to="/userGroups"></router-link>

  <DataTable
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
    <Column :field="'2024-9-15'" />
    <Column :field="'2024-9-22'" />
    <Column :field="'2024-10-15'" />
    <Column :field="'2024-10-22'" />


  </DataTable>

</template>

<script setup>
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import DataTable from 'primevue/datatable'
import Row from 'primevue/row'


const route = useRoute()
const groupCode = ref(route.query.codeGroup)
const studentList = ref([])


const serverResponse = {
  "teacherFullName": "Иванова Тамара Ивановна",
  "groupCode": "ИСП-216",
  "totalStudents": 2,
  "students": [
    {
      "fullName": "Боев Владислав Владимирович",
      "attendance": {
        "2024-9-15": "attended",
        "2024-9-22": "attended",
        "2024-10-15": "attended",
        "2024-10-22": "sick"
      }
    },
    {
      "fullName": "Иванов Иван Иваныч",
      "attendance": {
        "2024-9-15": "attended",
        "2024-9-22": "attended",
        "2024-10-15": "attended",
        "2024-10-22": "attended"
      }
    }
  ]
}

const lessonPlan = {
  "groupCode": "ИСП-216",
  "teacherFullName": "Иванова Тамара Ивановна",
  "academicYear": "2024-2025",
  "subject": "Математика",
  "lessonsAttendance": [
    {
      "lessonNumber": 1,
      "date": "2024-9-15",
      "status": "completed",
      "attended": 25,
      "absent": 3
    },
    {
      "lessonNumber": 1,
      "date": "2024-9-22",
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
  ]
}


const lessonsByMonth = sortLessonsByMonth(lessonPlan.lessonsAttendance)
const allLesson = srtAllClasses(lessonPlan.lessonsAttendance)

function sortLessonsByMonth(lessons) {
  const result = {}

  const monthNames = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь"
  ]

  lessons.forEach((obj) => {
    const monthNumber = Number(obj.date.split('-')[1])
    const monthName = monthNames[monthNumber + 1]
    const currentCount = result[monthName] || 0
    result[monthName] = currentCount + 1
  })

  return result
}

function srtAllClasses(arr) {
  return arr.map((lesson) => {
    const { date } = lesson
    const dayLesson = date.split('-')[2]
    return dayLesson
  })
}


onMounted(async () => {
  studentList.value = [
    {
      "fullName": "Боев Владислав Владимирович",
      "2024-9-15": "attended",
      "2024-9-22": "attended",
      "2024-10-15": "attended",
      "2024-10-22": "attended",
    },

  ]
})
</script>

<style></style>