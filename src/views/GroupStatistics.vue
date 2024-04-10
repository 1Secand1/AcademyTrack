<template>
  Группа
  {{ groupCode }}
  <router-link to="/userGroups">Назад</router-link>

  <DataTable
    :value="studentList"
    stripedRows
  >
    <Column
      field="surname"
      header="Фамилия"
    />
    <Column
      field="name"
      header="Имя"
    />
    <Column
      field="patronymic"
      header="Отчество"
    />

  </DataTable>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { getStudents } from '../service/getStudents'

import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

const route = useRoute()
const groupCode = ref(route.query.codeGroup)
const studentList = ref([])

onMounted(async () => {
  studentList.value = await getStudents(groupCode.value)
  console.log(studentList.value)
})
</script>

<style></style>