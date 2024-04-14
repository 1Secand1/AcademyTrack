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
			v-model="groupData.groupCode"
			placeholder="Код группы"
		/>
		<InputText
			class="settings__input-search"
			v-model="groupData.yearOfEntry"
			placeholder="Год начала обучения"
		/>
		<InputText
			class="settings__input-search"
			v-model="groupData.yearOfIssue"
			placeholder="Год окончания обучения"
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

const groupData = reactive({
	groupCode: '',
	yearOfEntry: '',
	yearOfIssue: '',
})

</script>

<style></style>