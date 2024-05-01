<template>
	<DataTable
		class='table'
		@rowSelect="onRowSelect"
		v-model:selection="selectedProduct"
		:value="valued"
		:sortOrder="-1"
		sortField="attendance"
		selectionMode="single"
		stripedRows
	>
		<Column
			field="groupCode"
			header="Код группы"
		/>

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
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

import { studentsService } from '@service/apiFunctions'
import { onMounted, ref } from 'vue'

const selectedProduct = ref([])
const onRowSelect = ref([])

const valued = ref([])
onMounted(async () => {
	valued.value = await studentsService.get()
})

</script>