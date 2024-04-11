<template>
	<div class="group-search">
		<h2>Ваши группы</h2>
		<IconField iconPosition="left">
			<InputIcon class="pi pi-search"> </InputIcon>
			<InputText
				class="group-search__input-search"
				v-model="search"
				placeholder="Поиск коду группы"
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
		<Column
			field="groupCode"
			header="Код группы"
		></Column>
		<Column
			field="subjectName"
			header="Предмет"
		></Column>
		<!-- <Column field="" header="Староста"></Column> -->
		<!-- <Column field="" header="Кол.Студентов" sortable></Column> -->
		<!-- <Column field="" header="Посещаемость %" sortable></Column> -->
	</DataTable>
</template>

<script setup>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { computed, onMounted, ref } from 'vue'
import router from '../router/index.js'
import { getTeachersGroups } from '../service/getTeachersGroups.js'

const students = ref([
	{
		codeGroup: 'Исп-211',
		lessonName: 'Математика',
		groupLeader: 'Когтев Д.А',
		numberStudents: '24',
		attendance: '57',
	},
	{
		codeGroup: 'Исп-212',
		lessonName: 'Математика',
		groupLeader: 'Когтев Д.А',
		numberStudents: '12',
		attendance: '13',
	},
	{
		codeGroup: 'Пкд-210',
		lessonName: 'Математика',
		groupLeader: 'Когтев Д.А',
		numberStudents: '46',
		attendance: '43',
	},
])
const userGroup = ref()
const search = ref('')
const selectedProduct = ref({})

const filteredStudents = computed(() => {
	if (!search.value) {
		return userGroup.value
	}

	return userGroup.value.filter(student =>
		student.codeGroup.toLowerCase().includes(search.value.toLowerCase())
	)
})

function onRowSelect() {
	router.push({
		name: 'groupStatistics',
		query: { codeGroup: selectedProduct.value['groupCode'] },
	})
}

onMounted(async () => {
	userGroup.value = await getTeachersGroups()
})
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
