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
			label="Изменить"
			@click="add"
		/>
	</form>
</template>
<script setup>
import { reactive, toRaw, watch } from 'vue'

import { useFetch } from '@service/useFetch'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const formData = defineModel()

const groupData = reactive({
	groupCode: '',
	yearOfEntry: '',
	yearOfIssue: '',
})

watch(formData, (newFormData) => {
	groupData.groupCode = newFormData?.groupCode
	groupData.yearOfEntry = newFormData?.yearOfEntry
	groupData.yearOfIssue = newFormData?.yearOfIssue
})

function add() {
	useFetch("http://localhost:80/group", "POST", toRaw(groupData))
}

</script>

<style></style>