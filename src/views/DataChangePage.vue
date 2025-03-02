<template>
  <div class="wrapper">
    <section class="settings">
      <keep-alive>
        <component
          :is="currentActiveForm"
          v-model="selectedRow"
        />
      </keep-alive>

      <DataChangeOptionSwitch
        v-model:category="categoryNameValue"
        v-model:dataChangeType="dataChangeTypeNamesValue"
        v-model:additionMethod="namesOfDataAdditionMethodsValue"
      />
    </section>

    <DataTable
      v-model:selection="selectedRow"
      class="table"
      :value="currentDateTable"
      :sort-order="-1"
      sort-field="attendance"
      selection-mode="single"
      striped-rows
      @row-select="onRowSelect"
    >
      <Column
        v-for="row in currentActiveTable"
        :key="row.valueKey"
        :field="row.valueKey"
        :header="row.text"
      />
    </DataTable>
  </div>
</template>

<script setup>
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import DataChangeGroupForm from '@components/DataChange/grup/DataChangeGroupForm.vue';
  import DataChangeImportForm from '@components/DataChange/DataChangeImportForm.vue';
  import DataChangeOptionSwitch from '@components/DataChange/DataChangeOptionSwitch.vue';
  import DataChangeStudentForm from '@components/DataChange/student/DataChangeStudentForm.vue';
  import DataChangeTeachersForm from '@components/DataChange/teachers/DataChangeTeachersForm.vue';
  import { markRaw, onMounted, ref, shallowRef, watch } from 'vue';
  import { dataChangeTypeNames, namesOfDataAdditionMethods, userRoleNames } from '@constants/localization';
  import { studentsService } from '@service/api-endpoints/students.js';
  import { teachersService } from '@service/api-endpoints/teachers.js';
  import { groupsService } from '@service/api-endpoints/groups.js';

  const tableRows = {
    [userRoleNames.students]: [
      { text:'Код группы',valueKey:'groupCode' },
      { text:'Фамилия',valueKey:'surname' },
      { text:'Имя',valueKey:'name' },
      { text:'Отчество',valueKey:'patronymic' },
    ],
    [userRoleNames.teachers]: [
      { text:'Фамилия',valueKey:'surname' },
      { text:'Имя',valueKey:'name' },
      { text:'Отчество',valueKey:'patronymic' },
      { text:'Предметы',valueKey:'' },
    ],
    [userRoleNames.groups]: [
      { text:'Код группы',valueKey:'code' },
      { text:'Год начала обучения',valueKey:'yearOfEntry' },
    ],
  };

  const groupedComponentCatalog = {
    [userRoleNames.students]: {
      form: markRaw(DataChangeStudentForm),
      table:tableRows[userRoleNames.students],
      data: () =>  studentsService.get(),
    },
    [userRoleNames.teachers]: {
      form: markRaw(DataChangeTeachersForm),
      table:tableRows[userRoleNames.teachers],
      data: () =>  teachersService.get(),
    },
    [userRoleNames.groups]: {
      form: markRaw(DataChangeGroupForm),
      table:tableRows[userRoleNames.groups],
      data: () => groupsService.get(),
    },
  };

  const currentActiveForm = shallowRef(DataChangeStudentForm);
  const currentActiveTable = ref([]);
  const currentDateTable = ref([]);

  const categoryNameValue = ref(userRoleNames.students);
  const namesOfDataAdditionMethodsValue = ref(namesOfDataAdditionMethods.manually);
  const dataChangeTypeNamesValue = ref(dataChangeTypeNames.adding);

  const selectedRow = ref({});

  onMounted(() => {
    updateComponents();
  });

  watch([categoryNameValue, namesOfDataAdditionMethodsValue], updateComponents);

  watch(dataChangeTypeNamesValue, (newDataChangeTypeNamesValue) => {
    if (newDataChangeTypeNamesValue == dataChangeTypeNames.adding) {
      selectedRow.value = {};
    }
  });

  function onRowSelect() {
    dataChangeTypeNamesValue.value = dataChangeTypeNames.modify;
  }

  async function updateComponents() {
    const component = groupedComponentCatalog[categoryNameValue.value];

    if (!component) return;

    const currentForm = namesOfDataAdditionMethodsValue.value === namesOfDataAdditionMethods.excel
      ? DataChangeImportForm
      : component.form;

    if (currentActiveForm.value !== currentForm) {
      currentActiveForm.value = currentForm;
    }

    currentDateTable.value = await component.data();

    currentActiveTable.value = component.table;

    // if (currentActiveTable.value !== component.table) {}
  }

</script>

<style scoped>
.wrapper {
	display: flex;
	gap: 20px;
}

.settings {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	max-width: 350px;

	gap: 10px;

	padding: 10px;

	height: 100svh;
	border-radius: 5px;
	background: white;
}

.settings__title {}

.addition-form {
	display: grid;
	gap: 10px;
}

.addition-form__title {
	margin: 0;
}

.settings__input-search {
	width: 100%;
}

.table {
	width: 100%;

	padding: 10px;
	padding-top: 20px;

	height: 100svh;
	border-radius: 5px;
	background: white;
}
</style>
