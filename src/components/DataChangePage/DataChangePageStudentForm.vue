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
			v-model="studentData.codeGroupe"
			placeholder="Код группы"
		/>

		<Button
			label="Изменить"
			@click="studentsService.add(studentData)"
		/>
	</form>
</template>
<script setup>
import { reactive } from 'vue'

import { studentsService } from '@service/apiFunctions'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const studentData = reactive({
	surname: "",
	name: "",
	patronymic: "",
	codeGroupe: "",
})

</script>

<style></style>