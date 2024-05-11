<template>
	<div class="wrapper">
		<section class="settings">
			<component :is='currentActiveForm' />

			<DataChangePageOptionSwitch
				:category="catagoriesNameValue"
				:dataChangeType="dataChangeTypeNamesValue"
				:additionMethod='namesOfDataAdditionMethodsValue'
				@changeDataCategory='changeDataCategory'
				@changeTypeDataModification='changeTypeDataModificationMethod'
				@changeMethodAddingData='changeMethodAddingData'
			/>
		</section>

		<component
			:is='currentActiveTable'
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

import { ref, shallowRef } from 'vue'

import { dataChangeTypeNames, namesOfDataAdditionMethods, userRoleNames } from '@constants/localization'

const currentActiveForm = shallowRef(DataChangePageStudentForm)
const currentActiveTable = shallowRef(DataChangePageStudentTable)

const currentNamesOfDataAdditionMethods = ref(namesOfDataAdditionMethods.manually)

const catagoriesNameValue = ref(userRoleNames.students)
const dataChangeTypeNamesValue = ref(dataChangeTypeNames.adding)
const namesOfDataAdditionMethodsValue = ref(namesOfDataAdditionMethods.manually)

function changeDataCategory(nameCategory) {
	const dataChangePageStudentTableAndFormComponents = {
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
		}
	}

	const componentType = dataChangePageStudentTableAndFormComponents[nameCategory]

	if (currentNamesOfDataAdditionMethods.value === namesOfDataAdditionMethods.manually) {
		currentActiveForm.value = componentType.form
	}

	currentActiveTable.value = componentType.table
}

function changeTypeDataModificationMethod(value) {
}

function changeMethodAddingData(value) {
	currentNamesOfDataAdditionMethods.value = value
	if (value = namesOfDataAdditionMethods.excel) {
		currentActiveForm.value = DataChangePageImportForm
	}
}

function onRowSelect(e) {
	dataChangeTypeNamesValue.value = dataChangeTypeNames.modify
	console.log(e)
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
