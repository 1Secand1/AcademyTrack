<template>
  Группа
  {{ groupCode }}
  <router-link to="/userGroups">Назад</router-link>

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
          v-for="(value, key) in listLessonsByMonth"
          :key='key'
          :header="key"
          :colspan="value"
        />
      </Row>
      <Row>
        <Column :header="15" />
        <Column :header="22" />
        <Column :header="15" />
        <Column :header="22" />
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


const attendanceStatistics = [{
  groupCode: "ИСП-216",
  teachersFullName: "Бакина Светлана Ивановна ",
  studentAttendance: [
    {
      "fullName": "Боев Владислав Владимирович",
      "markedLessons": [
        {
          "month": "09",
          "day": "15",
          "attendanceStatus": true
        },
        {
          "month": "09",
          "day": "22",
          "attendanceStatus": true
        },
      ]
    },
    {
      "fullName": "Боев Владислав Владимирович",
      "markedLessons": [
        {
          "month": "09",
          "day": "15",
          "attendanceStatus": true
        },
        {
          "month": "09",
          "day": "22",
          "attendanceStatus": true
        },
      ]
    }
  ]
}]

function transformObjectForTable(obj) {
}

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

const lessonList = [
  {
    monthName: "ноябрь",
    lessons: 2
  },
]

const listLessonsByMonth = sortLessonsByMonth(lessonPlan.lessonsAttendance)

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