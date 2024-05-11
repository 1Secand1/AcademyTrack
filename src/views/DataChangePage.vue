<template>
	<div class="wrapper">
		<section class="settings">
			<keep-alive>
				<component
					:is='currentActiveForm'
					v-model='selectedRow'
				/>
			</keep-alive>

			<DataChangePageOptionSwitch
				v-model:category="categoryNameValue"
				v-model:dataChangeType='dataChangeTypeNamesValue'
				v-model:additionMethod='namesOfDataAdditionMethodsValue'
			/>
		</section>

		<component
			:is='currentActiveTable'
			v-model:selectedRow='selectedRow'
			@onRowSelect='onRowSelect'
		/>
	</div>
</template>

<script setup>

import DataChangePageGroupForm from '@components/DataChangePage/DataChangePageGroupForm.vue'
import DataChangePageGroupTable from '@components/DataChangePage/DataChangePageGroupTable.vue'
import DataChangePageImportForm from '@components/DataChangePage/DataChangePageImportForm.vue'
import DataChangePageOptionSwitch from '@components/DataChangePage/DataChangePageOptionSwitch.vue'
import DataChangePageStudentForm from "@components/DataChangePage/DataChangePageStudentForm.vue"
import DataChangePageStudentTable from '@components/DataChangePage/DataChangePageStudentTable.vue'
import DataChangePageTeachersForm from '@components/DataChangePage/DataChangePageTeachersForm.vue'

import { ref, shallowRef, watch } from 'vue'

import { dataChangeTypeNames, namesOfDataAdditionMethods, userRoleNames } from '@constants/localization'

const currentActiveForm = shallowRef(DataChangePageStudentForm)
const currentActiveTable = shallowRef(DataChangePageStudentTable)

const categoryNameValue = ref(userRoleNames.students)
const dataChangeTypeNamesValue = ref(dataChangeTypeNames.adding)
const namesOfDataAdditionMethodsValue = ref(namesOfDataAdditionMethods.manually)

const selectedRow = ref()

const groupedComponentCatalog = {
	[userRoleNames.students]: {
		form: DataChangePageStudentForm,
		table: DataChangePageStudentTable
	},
	[userRoleNames.teachers]: {
		form: DataChangePageTeachersForm,
		table: DataChangePageStudentTable
	},
	[userRoleNames.groups]: {
		form: DataChangePageGroupForm,
		table: DataChangePageGroupTable
	},
}

function updateComponents() {
	const component = groupedComponentCatalog[categoryNameValue.value]

	if (!component) return

	const currentForm = namesOfDataAdditionMethodsValue.value === namesOfDataAdditionMethods.excel
		? DataChangePageImportForm
		: component.form

	currentActiveForm.value = currentForm
	currentActiveTable.value = component.table
}

watch([categoryNameValue, namesOfDataAdditionMethodsValue], updateComponents)

watch(dataChangeTypeNamesValue, (newDataChangeTypeNamesValue) => {
	if (newDataChangeTypeNamesValue == dataChangeTypeNames.adding) {
		selectedRow.value = {}
	}
})

function onRowSelect() {
	dataChangeTypeNamesValue.value = dataChangeTypeNames.modify
}
</script>

<style scoped>
.wrapper {
	display: flex;
	gap: 20px;
}

.settings {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	max-width: 350px;

	gap: 10px;

	padding: 10px;

	height: 100svh;
	border-radius: 5px;
	background: white;
}

.settings__title {}


.addition-form {
	display: grid;
	gap: 10px;
}

.addition-form__title {
	margin: 0;
}

.settings__input-search {
	width: 100%;
}



.table {
	width: 100%;

	padding: 10px;
	padding-top: 20px;

	height: 100svh;
	border-radius: 5px;
	background: white;
}
</style>
