<template>
	<div class="wrapper">
		<section class="settings">
			<component
				v-if='typeDataModificationMethod === "manually"'
				:is='currentActiveForm'
			/>

			<section
				v-if='typeDataModificationMethod === "export"'
				class='fileUploadBox'
			>
				<h2>Загрузить файл</h2>

				<FileUpload
					chooseLabel='Загрузить'
					pt:root:class='fileUploadBox__button'
					mode="basic"
					name="demo[]"
					url="/api/upload"
					accept="image/*"
					:maxFileSize="1000000"
					@upload=""
				/>
			</section>

			<DataChangePageOptionSwitch
				@changeDataCategory='changeDataCategory'
				@changeTypeDataModification='changeTypeDataModificationMethod'
				@changeMethodAddingData='changeMethodAddingData'
			/>
		</section>

		<component :is='currentActiveTable'></component>
	</div>
</template>

<script setup>
import FileUpload from 'primevue/fileupload'

import DataChangePageGroupForm from '@components/DataChangePage/DataChangePageGroupForm.vue'
import DataChangePageGroupTable from '@components/DataChangePage/DataChangePageGroupTable.vue'
import DataChangePageOptionSwitch from '@components/DataChangePage/DataChangePageOptionSwitch.vue'
import DataChangePageStudentForm from "@components/DataChangePage/DataChangePageStudentForm.vue"
import DataChangePageStudentTable from '@components/DataChangePage/DataChangePageStudentTable.vue'
import DataChangePageTeachersForm from '@components/DataChangePage/DataChangePageTeachersForm.vue'

import { ref, shallowRef } from 'vue'

const typeOfDataModification = ref('change')
const typeDataModificationMethod = ref('manually')
const currentActiveForm = shallowRef(DataChangePageStudentForm)
const currentActiveTable = shallowRef(DataChangePageStudentTable)

function changeDataCategory(value) {
	const dataChangePageStudentTableAndFormComponents = {
		"Студенты": {
			form: DataChangePageStudentForm,
			table: DataChangePageStudentTable
		},
		"Учителя": {
			form: DataChangePageTeachersForm,
			table: DataChangePageStudentTable
		},
		"Группы": {
			form: DataChangePageGroupForm,
			table: DataChangePageGroupTable
		}
	}

	const componentType = dataChangePageStudentTableAndFormComponents[value]

	currentActiveForm.value = componentType.form
	currentActiveTable.value = componentType.table
}

function changeTypeDataModificationMethod(value) {
	const typesOfDataModification = {
		'Изменение': 'change',
		'Добавление': 'addition',
	}

	if (typesOfDataModification[value] === 'change') {
		changeMethodAddingData('В ручную')
	}

	typeOfDataModification.value = typesOfDataModification[value]
}

function changeMethodAddingData(value) {
	const methodsAddingData = {
		'В ручную': 'manually',
		'Excel файл': 'export',
	}
	typeDataModificationMethod.value = methodsAddingData[value]
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

.fileUploadBox {}

.fileUploadBox__button {
	display: flex;
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
