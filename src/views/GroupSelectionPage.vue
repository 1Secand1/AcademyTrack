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
			v-for=" group in groups"
			:key="group.groupCode"
			@click='select(group.groupCode)'
			:group-name="group.groupCode"
			:numberOfStudents="group.numberOfStudents"
		/>
	</section>

</template>

<script setup>
import GroupCard from '@components/GroupCard.vue'
import router from '@router/index'
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

const groups = [
	{
		groupCode: "ИСП-216",
		numberOfStudents: 20
	},
	{
		groupCode: "ИСП-216В",
		numberOfStudents: 25
	},
	{
		groupCode: "ИСП-216В",
		numberOfStudents: 20
	},
	{
		groupCode: "ИСП-215",
		numberOfStudents: 20
	},
	{
		groupCode: "ИСП-216",
		numberOfStudents: 20
	},
	{
		groupCode: "ИСП-216",
		numberOfStudents: 20
	},
]

function select(groupCode) {
	router.push({
		name: 'groupProfile',
		query: { codeGroup: groupCode },
	})
}
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