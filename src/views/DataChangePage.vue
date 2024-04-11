<template>
	<div class="wrapper">
		<section class="settings">

			<component :is='currentActiveForm'></component>

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
				v-if="selectButtonOptionsValue === 'Студенты'"
				field="surname"
				header="Фамилия"
			/>

			<Column
				v-if="selectButtonOptionsValue === 'Студенты'"
				field="name"
				header="Имя"
			/>

			<Column
				v-if="selectButtonOptionsValue === 'Студенты'"
				field="patronymic"
				header="Отчество"
			/>
			<Column
				v-if="selectButtonOptionsValue === 'Студенты' ||
					selectButtonOptionsValue === 'Группы'
				"
				field="groupCode"
				header="Код группы"
			/>

			<Column
				v-if="selectButtonOptionsValue === 'Группы'"
				field="yearOfEntry"
				header="Год начала обучения"
			/>

			<Column
				v-if="selectButtonOptionsValue === 'Группы'"
				field="yearOfIssue"
				header="Год окончания обучения"
			/>

		</DataTable>
	</div>
</template>

<script setup>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import FileUpload from 'primevue/fileupload'
import SelectButton from 'primevue/selectbutton'

import DataChangePageStudentForm from "../components/DataChangePageStudentForm.vue"
import DataChangePageTeachersForm from "../components/DataChangePageTeachersForm.vue"

import { onMounted, ref, watch } from 'vue'
import { getStudentGroups } from '../service/getStudentGroups.js'
import { getStudents } from '../service/getStudents.js'

const currentActiveForm = ref(DataChangePageStudentForm)

const selectButtonOptions = ['Студенты', 'Учителя', 'Группы']
const selectButtonOptionsValue = ref('Студенты')

const selectButtonTypeOperation = ['Изменение', 'Добавление ']
const selectButtonTypeOperationValue = ref('Изменение')

const typeOfAddition = ['Excel файл', 'В ручную']
const typeOfAdditionValue = ref('В ручную')

const valued = ref([])
const selectedProduct = ref([])
const onRowSelect = ref([])
const search = ref()

watch(selectButtonTypeOperationValue, (value) => {
	if (value == 'Изменение') {
		typeOfAdditionValue.value = 'В ручную'
	}
})

async function changeTableContent(event) {
	const { value } = event

	if (value === "Студенты") {
		currentActiveForm.value = DataChangePageStudentForm
		valued.value = await getStudents()
	}

	if (value === "Группы") {
		currentActiveForm = DataChangePageTeachersForm
		valued.value = await getStudentGroups()
	}
}

onMounted(async () => {
	valued.value = await getStudents()
})

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
