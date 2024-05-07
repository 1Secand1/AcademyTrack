<template>
	<DataTable
		class="table"
		@row-select="onRowSelect"
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
import { studentsService } from '@service/apiFunctions'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { onMounted, ref } from 'vue'

const selectedProduct = ref(null)
const valued = ref([])

onMounted(async () => {
	valued.value = await studentsService.get()
})

function onRowSelect(event) {
	console.log(event.data)
}

</script>
