<template>
	<input type="text">
	<section class="group-cards">
		<GroupCard
			v-for=" i in 25"
			:key='i'
		/>
	</section>
</template>

<script setup>
import GroupCard from '@components/GroupCard.vue'
</script>

<style scoped>
.group-cards {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;

	gap: 20px;
	margin-top: 25px;
}
</style>