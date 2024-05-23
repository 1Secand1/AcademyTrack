<template>
  <div class="row">
    <Dropdown
      v-model="selectedCourses"
      class="dropdown"
      :options="courses"
      show-clear
      option-label="name"
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
      v-model="selectedSpecialty"
      class="dropdown"
      :options="specialty"
      show-clear
      option-label="name"
      placeholder="Выберите специальность"
    />
  </div>

  <section class="group-cards">
    <GroupCard
      v-for=" group in groups"
      :key="group.groupCode"
      :group-name="group.groupCode"
      :number-of-students="group.numberOfStudents"
      @click="select(group.groupCode)"
    />
  </section>
</template>

<script setup>
  import GroupCard from '@components/GroupCard.vue';
  import router from '@router/index';
  import Dropdown from 'primevue/dropdown';
  import { ref } from 'vue';

  const selectedCourses = ref();
  const courses = ref([
    { name: '1' },
    { name: '2' },
    { name: '3' },
    { name: '4' },
  ]);

  const selectedSpecialty = ref();
  const specialty = [
    { name: 'ИСП' },
    { name: 'ПКД' },
    { name: 'КС' },
  ];

  const groups = [
    {
      groupCode: 'ИСП-216',
      numberOfStudents: 20,
    },
    {
      groupCode: 'ИСП-216В',
      numberOfStudents: 25,
    },
    {
      groupCode: 'ИСП-216В',
      numberOfStudents: 20,
    },
    {
      groupCode: 'ИСП-215',
      numberOfStudents: 20,
    },
    {
      groupCode: 'ИСП-216',
      numberOfStudents: 20,
    },
    {
      groupCode: 'ИСП-216',
      numberOfStudents: 20,
    },
  ];

  function select(groupCode) {
    router.push({
      name: 'groupProfile',
      query: { codeGroup: groupCode },
    });
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