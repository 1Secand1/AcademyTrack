<template>
	<form
		class='addition-form'
		action=''
	>
		<h2 class='settings__title'>
			Изменить данные
		</h2>
		<InputText
			class="settings__input-search"
			v-model="studentData.surname"
			placeholder="Фамилия"
		/>
		<InputText
			class="settings__input-search"
			v-model="studentData.name"
			placeholder="Имя"
		/>
		<InputText
			class="settings__input-search"
			v-model="studentData.patronymic"
			placeholder="Отчество"
		/>
		<InputText
			class="settings__input-search"
			v-model="studentData.groupCode"
			placeholder="Код группы"
		/>

		<Button
			class=""
			label="Изменить"
			@click=""
		/>
	</form>
</template>
<script setup>
import { reactive } from 'vue'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const studentData = reactive({
	surname: "",
	name: "",
	patronymic: "",
	groupCode: '',
})

</script>

<style></style>