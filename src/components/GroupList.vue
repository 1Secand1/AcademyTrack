<template>
  <div class="user-groups-page">
    <div class="group-search">
      <h2> {{ titles[typeGroupList] }}</h2>
      <div class="search-container">
        <IconField icon-position="left">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="search"
            class="group-search__input-search"
            placeholder="Поиск по коду группы"
          />
        </IconField>
        <Button
          v-if="isMobile"
          icon="pi pi-filter"
          @click="toggleFilters"
        />
      </div>
      <div
        v-if="isMobile && showFilters"
        class="filters"
      >
        <Dropdown
          v-model="selectedFilter"
          :options="filterOptions"
          placeholder="Фильтр"
        />
      </div>
    </div>
    <div
      v-if="isMobile"
      class="group-list"
    >
      <div
        v-for="group in filteredGroups"
        :key="group.groupId"
        class="group-item"
        @click="onRowSelect({ data: group })"
      >
        <div class="group-item__code">
          {{ group.groupCode }}
        </div>
        <div class="group-item__name">
          {{ group.name }}
        </div>
        <div class="group-item__course">
          {{ group.course }}
        </div>
        <div class="group-item__specialty">
          {{ group.specialty }}
        </div>
      </div>
    </div>
    <DataTable
      v-else
      v-model:selection="selectedGroup"
      :value="filteredGroups"
      striped-rows
      sort-field="groupCode"
      :sort-order="1"
      selection-mode="single"
      @row-select="onRowSelect"
    >
      <Column
        :header-style="{
          'text-align': 'center',
          'vertical-align': 'middle'
        }"
        body-style="text-align: center; vertical-align: middle"
      >
        <template #header>
          <div class="w-full">
            <span>Профиль</span>
          </div>
        </template>

        <template #body="{ data }">
          <Button
            icon="pi pi-user"
            class="p-button-rounded p-button-text"
          />
        </template>
      </Column>

      <Column
        field="groupCode"
        header="Название группы"
        sortable
      />
      <Column
        v-if="typeGroupList === 'teaching-assignments'"
        field="subject"
        header="Предмет"
        sortable
      />
      <Column
        field="course"
        header="Год обучения"
        sortable
      />
      <Column
        v-if="type === 'teaching-assignments'"
        body-style="text-align:center"
        :header-style="{
          'text-align': 'center',
          'vertical-align': 'middle',
        }"
      >
        <template #header>
          <div class="w-full">
            <span>Посещаемость</span>
          </div>
        </template>

        <template #body="{ data }">
          <Button
            v-tooltip="'Перейти к учёту посещаемости'"
            icon="pi pi-calendar"
            class="p-button-rounded p-button-text "
            @click=" router.push({
              name: 'group-statistics',
              params: data
            });"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
  import router from '@router/index.js';
  import { groupsService } from '@service/api-endpoints/groups.js';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import IconField from 'primevue/iconfield';
  import InputIcon from 'primevue/inputicon';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Dropdown from 'primevue/dropdown';
  import { computed, onMounted, ref } from 'vue';
  import { teachingAssignmentsService } from '@service/api-endpoints/teaching-assignments.js';

  const props = defineProps({
    type: {
      type: String,
      default: 'all',
    },
  });

  const typeGroupList = props.type;

  const titles = {
    'all': 'Группы',
    'teaching-assignments':'Выши группы',
  };

  const groups = ref([]);
  const search = ref('');
  const selectedGroup = ref({});
  const isMobile = ref(window.innerWidth <= 768);
  const showFilters = ref(false);
  const selectedFilter = ref(null);
  const filterOptions = [
    { label: 'Все группы', value: 'all' },
    { label: 'Курс 1', value: '1' },
    { label: 'Курс 2', value: '2' },
    { label: 'Курс 3', value: '3' },
  ];

  const filteredGroups = computed(() => {
    let result = groups.value;
    if (search.value) {
      result = result.filter(group =>
        group.groupCode.toLowerCase().includes(search.value.toLowerCase()) ||
        group.name.toLowerCase().includes(search.value.toLowerCase()),
      );
    }
    if (selectedFilter.value && selectedFilter.value !== 'all') {
      result = result.filter(group => group.course === selectedFilter.value);
    }
    return result;
  });

  function onRowSelect(event) {
    if (event.data) {
      router.push({
        name: 'groupProfile',
        params: { groupId: event.data.groupId },
      });
    }
  }

  function toggleFilters() {
    showFilters.value = !showFilters.value;
  }

  onMounted(async () => {
    try {
      if (typeGroupList === 'all') {
        groups.value = await groupsService.getAll();
      }

      if (typeGroupList === 'teaching-assignments') {
        const  teachingAssignments = await teachingAssignmentsService.get(3);
        groups.value = teachingAssignments.map(({ group ,subject,teachingAssignmentId }) => ({
          ...group,
          subject: subject.name,
          teachingAssignmentId,
        }));
      }

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

.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filters {
  margin-top: 10px;
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-item {
  background: var(--surface-card);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.group-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.group-item__code {
  font-weight: 600;
  color: var(--primary-color);
}

.group-item__name {
  font-size: 1.1rem;
  margin-top: 4px;
}

.group-item__course,
.group-item__specialty {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .group-search {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .group-search__input-search {
    width: 100%;
  }
}
</style>
