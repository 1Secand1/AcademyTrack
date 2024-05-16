<template>

	<div class="row">
		<Dropdown
			class='dropdown'
			v-model="selectedCourses"
			:options="courses"
			showClear
			optionLabel="name"
			placeholder="Выберите курс"
		>
			<template #value="slotProps">
				<div v-if="slotProps.value">
					Курс {{ slotProps.value.name }}
				</div>
				<span v-else>
					{{ slotProps.placeholder }}
				</span>
			</template>
		</Dropdown>

		<Dropdown
			class='dropdown'
			v-model="selectedSpecialty"
			:options="specialty"
			showClear
			optionLabel="name"
			placeholder="Выберите специальность"
		/>
	</div>

	<section class="group-cards">
		<GroupCard
			v-for=" i in 25"
			:key='i'
		/>
	</section>

</template>

<script setup>
import GroupCard from '@components/GroupCard.vue'
import Dropdown from 'primevue/dropdown'
import { ref } from 'vue'

const selectedCourses = ref()
const courses = ref([
	{ name: '1' },
	{ name: '2' },
	{ name: '3' },
	{ name: '4' },
])

const selectedSpecialty = ref()
const specialty = [
	{ name: 'ИСП' },
	{ name: 'ПКД' },
	{ name: 'КС' },
]

</script>

<style scoped>
.dropdown {
	min-width: 200px;
}

.row {
	display: flex;
	gap: 20px;
	margin-top: 20px;
}


.group-cards {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;

	gap: 20px;
	margin-top: 25px;
}
</style>