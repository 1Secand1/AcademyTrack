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
      v-for="group in filteredGroups"
      :key="group.groupId"
      :group-code="group.groupCode"
      :group-title="group.name"
      :number-of-students="group.students ? group.students.length : 0"
      @click="select(group)"
    />
  </section>
</template>

<script setup>
import GroupCard from '@components/GroupCard.vue';
import router from '@router/index';
import Dropdown from 'primevue/dropdown';
import { ref, computed, onMounted } from 'vue';
import { groupsService } from '@service/api-endpoints/groups.js';

const selectedCourses = ref();
const courses = [
  { name: '1' },
  { name: '2' },
  { name: '3' },
  { name: '4' },
];

const selectedSpecialty = ref();
const specialty = [
  { name: 'ИСП' },
  { name: 'ПКД' },
  { name: 'КС' },
];

const groups = ref([]);

const filteredGroups = computed(() => {
  let arr = groups.value;
  if (selectedCourses.value) {
    arr = arr.filter(g => String(g.course) === String(selectedCourses.value.name));
  }
  if (selectedSpecialty.value) {
    arr = arr.filter(g => g.specialty === selectedSpecialty.value.name);
  }
  return arr;
});

function select(group) {
  router.push({
    name: 'groupProfile',
    params: { groupId: group.groupId }
  });
}

onMounted(async () => {
  const response = await groupsService.get();
  groups.value = response;
});
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