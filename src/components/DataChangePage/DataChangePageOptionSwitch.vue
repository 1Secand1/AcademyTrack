<template>
	<section class='settings__options'>
		<SelectButton
			pt:root:class='settings__select-button'
			@change="event => handleChange('changeDataCategory', event)"
			v-model="buttonsSelectDataCategoryValue"
			:options="buttonsSelectDataCategory"
			aria-labelledby="basic"
			:allowEmpty="false"
			:unselectable="false"
		/>

		<SelectButton
			pt:root:class='settings__select-button'
			@change="event => handleChange('changeTypeDataModification', event)"
			v-model="buttonsSelectingTypeDataModificationValue"
			:options="buttonsSelectingTypeDataModification"
			aria-labelledby="basic"
			:allowEmpty="false"
			:unselectable="false"
		/>

		<SelectButton
			v-if='buttonsSelectingTypeDataModificationValue === "Добавление "'
			@change="event => handleChange('changeMethodAddingData', event)"
			pt:root:class='settings__select-button'
			v-model="buttonsSelectingMethodAddingDataValue"
			:options="buttonsSelectingMethodAddingData"
			aria-labelledby="basic"
			:allowEmpty="false"
			:unselectable="false"
		/>
	</section>
</template>

<script setup>
import SelectButton from 'primevue/selectbutton'
import { defineEmits, ref } from 'vue'

const emit = defineEmits([
	'changeDataCategory',
	'changeTypeDataModification',
	'changeMethodAddingData'
])

const buttonsSelectDataCategory = ['Студенты', 'Учителя', 'Группы']
const buttonsSelectDataCategoryValue = ref('Студенты')
const buttonsSelectingTypeDataModification = ['Изменение', 'Добавление ']
const buttonsSelectingTypeDataModificationValue = ref('Изменение')
const buttonsSelectingMethodAddingData = ['Excel файл', 'В ручную']
const buttonsSelectingMethodAddingDataValue = ref('В ручную')

function handleChange(emitEvent, event) {
	emit(emitEvent, event.value)
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