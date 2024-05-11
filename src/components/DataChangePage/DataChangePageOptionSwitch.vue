<template>
	<section class='settings__options'>
		<SelectButton
			pt:root:class='settings__select-button'
			v-model="categoryNameValue"
			:options="Object.values(userRoleNames)"
			aria-labelledby="basic"
			:allowEmpty="false"
			:unselectable="false"
		/>

		<SelectButton
			pt:root:class='settings__select-button'
			v-model="dataChangeTypeNamesValue"
			:options="Object.values(dataChangeTypeNames)"
			aria-labelledby="basic"
			:allowEmpty="false"
			:unselectable="false"
		/>

		<SelectButton
			v-if='dataChangeTypeNamesValue === dataChangeTypeNames.adding'
			pt:root:class='settings__select-button'
			v-model="additionMethodNameValue"
			:options="Object.values(namesOfDataAdditionMethods)"
			aria-labelledby="basic"
			:allowEmpty="false"
			:unselectable="false"
		/>
	</section>
</template>

<script setup>
import SelectButton from 'primevue/selectbutton'
import { watch } from 'vue'

import { dataChangeTypeNames, namesOfDataAdditionMethods, userRoleNames } from '@constants/localization'

const categoryNameValue = defineModel("category")
const additionMethodNameValue = defineModel("additionMethod")
const dataChangeTypeNamesValue = defineModel("dataChangeType")

watch(dataChangeTypeNamesValue, (additionMethod) => {
	if (additionMethod === dataChangeTypeNames.modify) {
		additionMethodNameValue.value = namesOfDataAdditionMethods.manually
	}
})


function changeMethodAddingData(event) {
	console.log(event)
	emit('changeMethodAddingData', event.value)
	if (event.value === namesOfDataAdditionMethods.manually) {
		emit('changeDataCategory', categoryNameValue.value)
	}
}


</script>

<style scoped>
.settings__select-button {
	display: flex;
}

.settings__options {
	display: grid;
	gap: 10px;
	margin-bottom: 20px;
	margin-top: auto;
}

:deep(.p-button) {
	flex: 1 1 auto;
}
</style>