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
			v-model="teachersData.surname"
			placeholder="Фамилия"
		/>
		<InputText
			class="settings__input-search"
			v-model="teachersData.name"
			placeholder="Имя"
		/>
		<InputText
			class="settings__input-search"
			v-model="teachersData.patronymic"
			placeholder="Отчество"
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

const teachersData = reactive({
	surname: "",
	name: "",
	patronymic: "",
})

</script>

<style></style>