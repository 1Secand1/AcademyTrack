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
import { defineEmits, onMounted, ref, toRaw } from 'vue'

const emit = defineEmits(["onRowSelect"])

const selectedProduct = ref(null)
const valued = ref([])

onMounted(async () => {
	valued.value = await studentsService.get()
})

function onRowSelect({ data }) {
	emit('onRowSelect', toRaw(data))
}

</script>
