<template>
	<section class='settings__options'>
		<SelectButton
			pt:root:class='settings__select-button'
			@change="event => handleChange('changeDataCategory', event)"
			v-model="categoryNameValue"
			:options="Object.values(userRoleNames)"
			aria-labelledby="basic"
			:allowEmpty="false"
			:unselectable="false"
		/>

		<SelectButton
			pt:root:class='settings__select-button'
			@change="changeTypeDataModification"
			v-model="dataChangeTypeNamesValue"
			:options="Object.values(dataChangeTypeNames)"
			aria-labelledby="basic"
			:allowEmpty="false"
			:unselectable="false"
		/>

		<SelectButton
			v-if='dataChangeTypeNamesValue === dataChangeTypeNames.adding'
			@change="changeMethodAddingData"
			pt:root:class='settings__select-button'
			v-model="namesOfDataAdditionMethodsValue"
			:options="Object.values(namesOfDataAdditionMethods)"
			aria-labelledby="basic"
			:allowEmpty="false"
			:unselectable="false"
		/>
	</section>
</template>

<script setup>
import SelectButton from 'primevue/selectbutton'
import { defineEmits, ref } from 'vue'

import { dataChangeTypeNames, namesOfDataAdditionMethods, userRoleNames } from '@constants/localization'

const emit = defineEmits([
	'changeDataCategory',
	'changeTypeDataModification',
	'changeMethodAddingData'
])

const props = defineProps({
	category: {
		validator(value, props) {
			return Object.values(userRoleNames).includes(value)
		},
		default() {
			return userRoleNames.students
		}
	},
	dataChangeType: {
		validator(value, props) {
			return Object.values(dataChangeTypeNames).includes(value)
		},
		default() {
			return dataChangeTypeNames.modify
		}
	},
	additionMethod: {
		validator(value, props) {
			return Object.values(namesOfDataAdditionMethods).includes(value)
		},
		default() {
			return namesOfDataAdditionMethods.manually
		}
	}
})

const categoryNameValue = ref(props.category)

const dataChangeTypeNamesValue = ref(props.dataChangeType)

const namesOfDataAdditionMethodsValue = ref(props.additionMethod)

function handleChange(emitEvent, event) {
	emit(emitEvent, event.value)
}

function changeTypeDataModification(event) {
	emit('changeTypeDataModification', event.value)

	if (event.value === dataChangeTypeNames.modify) {
		changeMethodAddingData({ value: namesOfDataAdditionMethods.manually })
		emit('changeDataCategory', categoryNameValue.value)
	}
}

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