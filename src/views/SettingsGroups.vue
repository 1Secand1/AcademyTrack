<template>
	<div class="wrapper">
		<section class="settings">
			<SelectButton
				pt:root:class='settings__select-button'
				v-model="selectButtonValue"
				:options="selectButtonOptions"
				aria-labelledby="basic"
			/>

			<IconField iconPosition="left">
				<InputIcon class="pi pi-search"> </InputIcon>
				<InputText
					class="settings__input-search"
					v-model="search"
					placeholder="Поиск"
				/>
			</IconField>


			<form
				class='addition-form'
				action=''
			>
				<InputText
					class="settings__input-search"
					v-model="search"
					placeholder="Имя"
				/>

				<InputText
					class="settings__input-search"
					v-model="search"
					placeholder="Фамилия"
				/>

				<InputText
					class="settings__input-search"
					v-model="search"
					placeholder="Отчество"
				/>

				<InputText
					class="settings__input-search"
					v-model="search"
					placeholder="Группа"
				/>

				<Button
					class=""
					label="Создать"
					@click=""
				/>
			</form>
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
				field="firstName"
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
				field="codeGroup"
				header="Код группы"
			/>
		</DataTable>
	</div>
</template>

<script setup>
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'

import { ref } from 'vue'

const selectButtonOptions = ['Студенты', 'Учителя', 'Группы']
const selectButtonValue = ref('Студенты')

const valued = ref([
	{
		firstName: "Владислав",
		surname: "Владимирович",
		patronymic: "Боев",
		codeGroup: 'Исп-211'
	},
	{
		firstName: "Владислав",
		surname: "Владимирович",
		patronymic: "Боев",
		codeGroup: 'Исп-211'
	},
	{
		firstName: "Владислав",
		surname: "Владимирович",
		patronymic: "Боев",
		codeGroup: 'Исп-211'
	},
	{
		firstName: "Владислав",
		surname: "Владимирович",
		patronymic: "Боев",
		codeGroup: 'Исп-211'
	},
	{
		firstName: "Владислав",
		surname: "Владимирович",
		patronymic: "Боев",
		codeGroup: 'Исп-211'
	},
	{
		firstName: "Владислав",
		surname: "Владимирович",
		patronymic: "Боев",
		codeGroup: 'Исп-211'
	},
	{
		firstName: "Владислав",
		surname: "Владимирович",
		patronymic: "Боев",
		codeGroup: 'Исп-211'
	},
	{
		firstName: "Владислав",
		surname: "Владимирович",
		patronymic: "Боев",
		codeGroup: 'Исп-211'
	},
])

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
	max-width: 350px;

	gap: 10px;

	padding: 10px;
	padding-top: 20px;

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

.addition-form {
	display: grid;

	gap: 10px;
	margin-top: 15px;
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
