<template>
  <div class="group-search">
    <h2>Ваши группы</h2>
    <IconField iconPosition="left">
      <InputIcon class="pi pi-search"> </InputIcon>
      <InputText
        class="group-search__input-search"
        v-model="search"
        placeholder="Поиск по коду группы"
      />
    </IconField>
  </div>
  <DataTable
    @rowSelect="onRowSelect"
    :value="filteredStudents"
    stripedRows
    sortField="attendance"
    :sortOrder="-1"
    selectionMode="single"
    v-model:selection="selectedProduct"
  >
    <Column field="codeGroup" header="Код группы"></Column>
    <Column field="lessonName" header="Предмет"></Column>
    <Column field="groupLeader" header="Стараста"></Column>
    <Column field="numberStudents" header="Кол.Студентов" sortable></Column>
    <Column field="attendance" header="Посещаймость %" :sortable="true"></Column>
  </DataTable>
</template>

<script setup>
import { ref, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
// import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import router from '../router'

const selectedProduct = ref({})

const students = ref([
  {
    codeGroup: 'Исп-211',
    lessonName: 'Математика',
    groupLeader: 'Когтев Д.А',
    numberStudents: '24',
    attendance: '57'
  },
  {
    codeGroup: 'Исп-212',
    lessonName: 'Математика',
    groupLeader: 'Когтев Д.А',
    numberStudents: '12',
    attendance: '13'
  },
  {
    codeGroup: 'Пкд-210',
    lessonName: 'Математика',
    groupLeader: 'Когтев Д.А',
    numberStudents: '46',
    attendance: '43'
  }
])

const search = ref('')

const filteredStudents = computed(() => {
  if (!search.value) {
    return students.value
  }

  return students.value.filter((student) =>
    student.codeGroup.toLowerCase().includes(search.value.toLowerCase())
  )
})

function onRowSelect() {
  router.push({ name: 'groupStatistics',  query: { codeGroup: selectedProduct.value.codeGroup }})
}
</script>

<style>
.group-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.group-search__input-search {
  height: max-content;
}
</style>
