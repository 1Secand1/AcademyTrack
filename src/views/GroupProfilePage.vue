<template>
	<h2 class='titlePage'>
		Профиль группы {{ groupCode }}
	</h2>

	<SelectButton
		class='row '
		v-model="currentCategory"
		@change='foo'
		:options="buttonsOptions"
		aria-labelledby="basic"
	/>

	<component :is='currentCategoryComponent' />
</template>

<script setup>
import SelectButton from 'primevue/selectbutton'

import GroupProfileSchedule from '@components/GroupProfile/GroupProfileSchedule.vue'

import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const groupCode = ref(route.query.codeGroup)

const mapCategoryComponent = {
	"Расписание": GroupProfileSchedule
}

const currentCategory = ref(route.query?.category ?? 'Студенты')
const currentCategoryComponent = computed(() => {
	return mapCategoryComponent[currentCategory.value]
})
const buttonsOptions = ref(['Студенты', 'Расписание', 'Учителя', 'Посещаемость'])

function foo({ value = undefined }) {
	if (!value) throw new Error("value not found")
	router.replace({ query: { ...route.query, category: value } })
	console.log(value)
}
</script>

<style scoped>
.titlePage {
	margin-top: 20px;
}


.row {
	display: flex;
	width: 100%;
	margin-top: 15px;
}

::v-deep .p-button-group,
::v-deep .p-button {
	width: 100%;
}
</style>