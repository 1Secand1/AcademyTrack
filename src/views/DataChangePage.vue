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

    <component
      :is="currentActiveTable"
      v-model:selectedRow="selectedRow"
      @on-row-select="onRowSelect"
    />
  </div>
</template>

<script setup>

  import DataChangeGroupForm from '@components/DataChange/DataChangeGroupForm.vue';
  import DataChangeGroupTable from '@components/DataChange/DataChangeGroupTable.vue';
  import DataChangeImportForm from '@components/DataChange/DataChangeImportForm.vue';
  import DataChangeOptionSwitch from '@components/DataChange/DataChangeOptionSwitch.vue';
  import DataChangeStudentForm from '@components/DataChange/DataChangeStudentForm.vue';
  import DataChangeStudentTable from '@components/DataChange/DataChangeStudentTable.vue';
  import DataChangeTeachersForm from '@components/DataChange/DataChangeTeachersForm.vue';

  import { ref, shallowRef, watch } from 'vue';

  import { dataChangeTypeNames, namesOfDataAdditionMethods, userRoleNames } from '@constants/localization';

  const currentActiveForm = shallowRef(DataChangeStudentForm);
  const currentActiveTable = shallowRef(DataChangeStudentTable);

  const categoryNameValue = ref(userRoleNames.students);
  const dataChangeTypeNamesValue = ref(dataChangeTypeNames.adding);
  const namesOfDataAdditionMethodsValue = ref(namesOfDataAdditionMethods.manually);

  const selectedRow = ref();

  const groupedComponentCatalog = {
    [userRoleNames.students]: {
      form: DataChangeStudentForm,
      table: DataChangeStudentTable,
    },
    [userRoleNames.teachers]: {
      form: DataChangeTeachersForm,
      table: DataChangeStudentTable,
    },
    [userRoleNames.groups]: {
      form: DataChangeGroupForm,
      table: DataChangeGroupTable,
    },
  };

  function updateComponents() {
    const component = groupedComponentCatalog[categoryNameValue.value];

    if (!component) return;

    const currentForm = namesOfDataAdditionMethodsValue.value === namesOfDataAdditionMethods.excel
      ? DataChangeImportForm
      : component.form;

    currentActiveForm.value = currentForm;
    currentActiveTable.value = component.table;
  }

  watch([categoryNameValue, namesOfDataAdditionMethodsValue], updateComponents);

  watch(dataChangeTypeNamesValue, (newDataChangeTypeNamesValue) => {
    if (newDataChangeTypeNamesValue == dataChangeTypeNames.adding) {
      selectedRow.value = {};
    }
  });

  function onRowSelect() {
    dataChangeTypeNamesValue.value = dataChangeTypeNames.modify;
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
