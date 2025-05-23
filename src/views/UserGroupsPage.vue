<template>
  <div class="group-search">
    <h2>Ваши группы</h2>
    <IconField icon-position="left">
      <InputIcon class="pi pi-search" />
      <InputText
        v-model="search"
        class="group-search__input-search"
        placeholder="Поиск по коду группы"
      />
    </IconField>
  </div>
  <DataTable
    v-model:selection="selectedGroup"
    :value="filteredGroups"
    striped-rows
    sort-field="groupCode"
    :sort-order="1"
    selection-mode="single"
    @row-select="onRowSelect"
  >
    <Column
      field="groupCode"
      header="Код группы"
      sortable
    />
    <Column
      field="name"
      header="Название группы"
      sortable
    />
    <Column
      field="course"
      header="Курс"
      sortable
    />
    <Column
      field="specialty"
      header="Специальность"
      sortable
    />
  </DataTable>
</template>

<script setup>
import router from '@router/index.js';
import { groupsService } from '@service/api-endpoints/groups.js';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { computed, onMounted, ref } from 'vue';

const groups = ref([]);
const search = ref('');
const selectedGroup = ref({});

const filteredGroups = computed(() => {
  if (!search.value) {
    return groups.value;
  }

  return groups.value.filter(group =>
    group.groupCode.toLowerCase().includes(search.value.toLowerCase()) ||
    group.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

function onRowSelect(event) {
  if (event.data) {
    router.push({
      name: 'groupProfile',
      params: { groupId: event.data.groupId }
    });
  }
}

onMounted(async () => {
  try {
    groups.value = await groupsService.getAll();
  } catch (error) {
    console.error('Ошибка при загрузке групп:', error);
  }
});
</script>

<style>
.group-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.group-search__input-search {
  height: max-content;
}
</style>
