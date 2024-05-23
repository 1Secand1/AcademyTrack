<template>
  <div class="group-search">
    <h2>Ваши группы</h2>
    <IconField icon-position="left">
      <InputIcon class="pi pi-search" />
      <InputText
        v-model="search"
        class="group-search__input-search"
        placeholder="Поиск коду группы"
      />
    </IconField>
  </div>
  <DataTable
    v-model:selection="selectedProduct"
    :value="filteredStudents"
    striped-rows
    sort-field="attendance"
    :sort-order="-1"
    selection-mode="single"
    @row-select="onRowSelect"
  >
    <Column
      field="groupCode"
      header="Код группы"
    />
    <Column
      field="subjectName"
      header="Предмет"
    />
  </DataTable>
</template>

<script setup>
  import router from '@router/index.js';
  import { getTeachersGroupsService } from '@service/apiFunctions';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import IconField from 'primevue/iconfield';
  import InputIcon from 'primevue/inputicon';
  import InputText from 'primevue/inputtext';
  import { computed, onMounted, ref } from 'vue';

  const userGroup = ref([]);
  const search = ref('');
  const selectedProduct = ref({});

  const filteredStudents = computed(() => {
    if (!search.value) {
      return userGroup.value;
    }

    return userGroup.value.filter(student =>
      student.codeGroup.toLowerCase().includes(search.value.toLowerCase()),
    );
  });

  function onRowSelect() {
    router.push({
      name: 'groupStatistics',
      query: { codeGroup: selectedProduct.value.groupCode },
    });
  }

  onMounted(async () => {
    userGroup.value = await getTeachersGroupsService.get();
  });
</script>

<style>
.group-search {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.group-search__input-search {
	height: max-content;
}
</style>
