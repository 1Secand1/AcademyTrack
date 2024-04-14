<template>
	<div class="wrapper">
		<section class="settings">
			<component
				v-if='typeOfAdditionValue === "В ручную"'
				:is='currentActiveForm'
			/>

			<section
				class='fileUploadBox'
				v-if="typeOfAdditionValue === 'Excel файл'"
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

			<section class='settings__options'>
				<SelectButton
					pt:root:class='settings__select-button'
					@change='changeTableContent'
					v-model="selectButtonOptionsValue"
					:options="selectButtonOptions"
					aria-labelledby="basic"
					:allowEmpty="false"
					:unselectable="false"
				/>

				<SelectButton
					pt:root:class='settings__select-button'
					v-model="selectButtonTypeOperationValue"
					:options="selectButtonTypeOperation"
					aria-labelledby="basic"
					:allowEmpty="false"
					:unselectable="false"
				/>

				<SelectButton
					v-if='selectButtonTypeOperationValue === "Добавление "'
					pt:root:class='settings__select-button'
					v-model="typeOfAdditionValue"
					:options="typeOfAddition"
					aria-labelledby="basic"
					:allowEmpty="false"
					:unselectable="false"
				/>
			</section>
		</section>

		<component :is='currentActiveTable'></component>
	</div>
</template>

<script setup>
import FileUpload from 'primevue/fileupload'
import SelectButton from 'primevue/selectbutton'

import DataChangePageGroupForm from '../components/DataChangePage/DataChangePageGroupForm.vue'
import DataChangePageGroupTable from '../components/DataChangePage/DataChangePageGroupTable.vue'
import DataChangePageStudentForm from "../components/DataChangePage/DataChangePageStudentForm.vue"
import DataChangePageStudentTable from '../components/DataChangePage/DataChangePageStudentTable.vue'
import DataChangePageTeachersForm from '../components/DataChangePage/DataChangePageTeachersForm.vue'

import { ref, shallowRef, watch } from 'vue'

const currentActiveForm = shallowRef(DataChangePageStudentForm)
const currentActiveTable = shallowRef(DataChangePageStudentTable)

const selectButtonOptions = ['Студенты', 'Учителя', 'Группы']
const selectButtonOptionsValue = ref('Студенты')

const selectButtonTypeOperation = ['Изменение', 'Добавление ']
const selectButtonTypeOperationValue = ref('Изменение')

const typeOfAddition = ['Excel файл', 'В ручную']
const typeOfAdditionValue = ref('В ручную')


watch(selectButtonTypeOperationValue, (value) => {
	if (value == 'Изменение') {
		typeOfAdditionValue.value = 'В ручную'
	}
})

async function changeTableContent(event) {
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

	const componentType = dataChangePageStudentTableAndFormComponents[event.value]

	currentActiveForm.value = componentType.form
	currentActiveTable.value = componentType.table
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

:deep(.p-button) {
	flex: 1 1 auto;
}

.settings__select-button {
	display: flex;
}

.settings__title {}

.settings__options {
	display: grid;
	gap: 10px;
	margin-bottom: 20px;
	margin-top: auto;
}

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
