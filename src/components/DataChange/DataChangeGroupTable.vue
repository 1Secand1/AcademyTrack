<template>
  <DataTable
    v-model:selection="selectedRow"
    class="table"
    :value="valued"
    :sort-order="-1"
    sort-field="attendance"
    selection-mode="single"
    striped-rows
    @row-select="onRowSelect"
  >
    <Column
      field="groupCode"
      header="Код группы"
    />
    <Column
      field="yearOfEntry"
      header="Год начала обучения"
    />
    <Column
      field="yearOfIssue"
      header="Год окончания обучения"
    />
  </DataTable>
</template>

<script setup>
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';

  import { getStudentGroups } from '@service/index';
  import { onMounted, ref, toRaw } from 'vue';

  const emit = defineEmits(['onRowSelect']);

  const selectedRow = defineModel('selectedRow');
  const valued = ref([]);

  onMounted(async () => {
    valued.value = await getStudentGroups.get();
  });

  function onRowSelect({ data }) {
    emit('onRowSelect', toRaw(data));
  }
</script>