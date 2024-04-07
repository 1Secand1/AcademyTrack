<template>
	<div class="wrapper">
		<section class="settings">
			<form
				v-if="typeOfAdditionValue === 'В ручную'"
				class='addition-form'
				action=''
			>
				<h2 class='settings__title'>
					Изменить данные
				</h2>

				<InputText
					v-if="
						selectButtonOptionsValue === 'Студенты' || selectButtonOptionsValue === 'Учителя'"
					class="settings__input-search"
					v-model="search"
					placeholder="Имя"
				/>

				<InputText
					v-if="
						selectButtonOptionsValue === 'Студенты' || selectButtonOptionsValue === 'Учителя'"
					class="settings__input-search"
					v-model="search"
					placeholder="Фамилия"
				/>

				<InputText
					v-if="
						selectButtonOptionsValue === 'Студенты' || selectButtonOptionsValue === 'Учителя'"
					class="settings__input-search"
					v-model="search"
					placeholder="Отчество"
				/>

				<InputText
					v-if="selectButtonOptionsValue === 'Группы' || selectButtonOptionsValue === 'Студенты'"
					class="settings__input-search"
					v-model="search"
					placeholder="Код группы"
				/>

				<InputText
					v-if="selectButtonOptionsValue === 'Группы'"
					class="settings__input-search"
					v-model="search"
					placeholder="Год начала обучения"
				/>
				<InputText
					v-if="selectButtonOptionsValue === 'Группы'"
					class="settings__input-search"
					v-model="search"
					placeholder="Год окончания обучения"
				/>

				<Button
					class=""
					label="Изменить"
					@click=""
				/>
			</form>

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
					v-model="selectButtonOptionsValue"
					:options="selectButtonOptions"
					aria-labelledby="basic"
				/>

				<SelectButton
					pt:root:class='settings__select-button'
					v-model="selectButtonTypeOperationValue"
					:options="selectButtonTypeOperation"
					aria-labelledby="basic"
				/>

				<SelectButton
					v-if='selectButtonTypeOperationValue === "Добавление"'
					pt:root:class='settings__select-button'
					v-model="typeOfAdditionValue"
					:options="typeOfAddition"
					aria-labelledby="basic"
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
				field="name"
				header="Имя"
			/>
			<Column
				field="surname"
				header="Фамилия"
			/>
			<Column
				field="patronymic"
				header="Отчество"
			/>
			<Column
				field="groupCode"
				header="Код группы"
			/>
		</DataTable>
	</div>
</template>

<script setup>
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import FileUpload from 'primevue/fileupload'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'

import { onMounted, ref, watch } from 'vue'
import { getStudents } from '../service/getStudents.js'

const selectButtonOptions = ['Студенты', 'Учителя', 'Группы']
const selectButtonOptionsValue = ref('Студенты')

const selectButtonTypeOperation = ['Изменение', 'Добавление']
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
