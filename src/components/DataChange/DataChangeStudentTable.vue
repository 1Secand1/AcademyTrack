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
      field="surname"
      header="Фамилия"
    />
    <Column
      field="name"
      header="Имя"
    />
    <Column
      field="patronymic"
      header="Отчество"
    />
  </DataTable>
</template>

<script setup>
  import { studentsService } from '@service/index';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import { onMounted, ref, toRaw } from 'vue';

  const emit = defineEmits(['onRowSelect']);

  // TODO добавить тип и значения по умолчанию
  const selectedRow = defineModel('selectedRow');
  const valued = ref([]);

  onMounted(async () => {
    valued.value = await studentsService.get();
  });

  function onRowSelect({ data }) {
    emit('onRowSelect', toRaw(data));
  }

</script>
