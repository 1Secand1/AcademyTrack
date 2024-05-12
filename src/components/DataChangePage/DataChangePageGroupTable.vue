<template>
	<DataTable
		class='table'
		@rowSelect="onRowSelect"
		v-model:selection="selectedRow"
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
			field="yearOfEntry"
			header="Год начала обучения"
		/>
		<Column
			field="yearOfIssue"
			header="Год окончания обучения"
		/>
	</DataTable>

</template>

<script setup>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

import { getStudentGroups } from '@service/apiFunctions'
import { onMounted, ref, toRaw } from 'vue'

const emit = defineEmits(["onRowSelect"])

const selectedRow = defineModel("selectedRow")
const valued = ref([])

onMounted(async () => {
	valued.value = await getStudentGroups.get()
})

function onRowSelect({ data }) {
	emit('onRowSelect', toRaw(data))
}
</script>