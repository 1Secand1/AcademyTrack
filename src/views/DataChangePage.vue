<template>
  <div class="wrapper">
    <section class="settings">
      <component
        :is="currentActiveForm"
        v-model="selectedRow"
        v-model:dataChangeType="dataChangeTypeNamesValue"
        :groups="groupedComponentCatalog[userRoleNames.groups.name].data"
        :disabled="dataChangeTypeNames.update.name === dataChangeTypeNamesValue && Object.keys(selectedRow).length === 0"
        @form-submission="sendRequest"
      />

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
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();

  const tableRows = {
    [userRoleNames.students.name]: [
      { text:'Код группы',valueKey:'groupCode' },
      { text:'Фамилия',valueKey:'surname' },
      { text:'Имя',valueKey:'name' },
      { text:'Отчество',valueKey:'patronymic' },
    ],
    [userRoleNames.teachers.name]: [
      { text:'Фамилия',valueKey:'surname' },
      { text:'Имя',valueKey:'name' },
      { text:'Отчество',valueKey:'patronymic' }
    ],
    [userRoleNames.groups.name]: [
      { text:'Код группы',valueKey:'groupCode' },
      { text:'Год поступления',valueKey:'yearOfEntry' }
    ],
  };

  const serverRequests = {
    [userRoleNames.students.name]: {
      [dataChangeTypeNames.update.name]: ({ studentId,groupCode,...body }) => studentsService.update(studentId,body),
      [dataChangeTypeNames.create.name]: (body) => studentsService.create(body),
      [dataChangeTypeNames.get.name]: () => studentsService.get(),
    },
    [userRoleNames.teachers.name]: {
      [dataChangeTypeNames.update.name]: async ({ teacherId, ...body }) => {
        try {
          console.log('Updating teacher:', { teacherId, ...body });
          const response = await teachersService.update(teacherId, body);
          console.log('Teacher updated successfully:', response);
          return response;
        } catch (error) {
          console.error('Error updating teacher:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data
          });
          throw error;
        }
      },
      [dataChangeTypeNames.create.name]: async (body) => {
        try {
          console.log('Creating teacher:', body);
          const response = await teachersService.create(body);
          console.log('Teacher created successfully:', response);
          return response;
        } catch (error) {
          console.error('Error creating teacher:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data
          });
          throw error;
        }
      },
      [dataChangeTypeNames.get.name]: async () => {
        try {
          console.log('Fetching teachers');
          const response = await teachersService.get();
          console.log('Teachers fetched successfully:', response);
          return response;
        } catch (error) {
          console.error('Error fetching teachers:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data
          });
          throw error;
        }
      },
    },
    [userRoleNames.groups.name]: {
      [dataChangeTypeNames.update.name]: async ({ groupId, groupCode, yearOfEntry }) => {
        try {
          console.log('Updating group:', { groupId, groupCode, yearOfEntry });
          const response = await groupsService.update(groupId, { groupCode, yearOfEntry });
          console.log('Group updated successfully:', response);
          return response;
        } catch (error) {
          console.error('Error updating group:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data
          });
          throw error;
        }
      },
      [dataChangeTypeNames.create.name]: async (body) => {
        try {
          console.log('Creating group with data:', body);
          const response = await groupsService.create(body);
          console.log('Group created successfully:', response);
          return response;
        } catch (error) {
          console.error('Error creating group:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data
          });
          throw error;
        }
      },
      [dataChangeTypeNames.get.name]: async () => {
        try {
          console.log('Fetching groups');
          const response = await groupsService.getAll();
          console.log('Groups fetched successfully:', response);
          return response;
        } catch (error) {
          console.error('Error fetching groups:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data
          });
          throw error;
        }
      },
    },
  };

  const groupedComponentCatalog = {
    [userRoleNames.students.name]: {
      form: markRaw(DataChangeStudentForm),
      table: tableRows[userRoleNames.students.name],
      data: [],
    },
    [userRoleNames.teachers.name]: {
      form: markRaw(DataChangeTeachersForm),
      table: tableRows[userRoleNames.teachers.name],
      data: [],
    },
    [userRoleNames.groups.name]: {
      form: markRaw(DataChangeGroupForm),
      table: tableRows[userRoleNames.groups.name],
      data: [],
    },
  };

  const currentActiveForm = shallowRef(DataChangeStudentForm);
  const currentActiveTable = ref([]);
  const currentDateTable = ref([]);

  const categoryNameValue = ref(userRoleNames.students.name);
  const namesOfDataAdditionMethodsValue = ref(namesOfDataAdditionMethods.manually);
  const dataChangeTypeNamesValue = ref(dataChangeTypeNames.create.name);

  const selectedRow = ref({});

  onMounted(() => {
    console.log('Component mounted, calling updateComponents');
    updateComponents();
  });

  watch([categoryNameValue, namesOfDataAdditionMethodsValue], () => {
    console.log('Category or method changed, calling updateComponents');
    updateComponents();
  });

  function onRowSelect() {
    dataChangeTypeNamesValue.value = dataChangeTypeNames.update.name;
  }

  async function updateComponents() {
    console.log('updateComponents called with category:', categoryNameValue.value);
    const component = groupedComponentCatalog[categoryNameValue.value];

    if (!component) {
      console.error('No component found for category:', categoryNameValue.value);
      return;
    }
    selectedRow.value = {};

    const currentForm = namesOfDataAdditionMethodsValue.value === namesOfDataAdditionMethods.excel
      ? DataChangeImportForm
      : component.form;

    if (currentActiveForm.value !== currentForm) {
      currentActiveForm.value = currentForm;
    }

    try {
      console.log('Fetching data for current category:', categoryNameValue.value);
      component.data = await serverRequests[categoryNameValue.value].get();
      
      console.log('Fetching groups data');
      const groupsData = await serverRequests[userRoleNames.groups.name].get();
      console.log('Groups data received:', groupsData);
      groupedComponentCatalog[userRoleNames.groups.name].data = groupsData;

      currentDateTable.value = component.data;
      currentActiveTable.value = component.table;
    } catch (error) {
      console.error('Error updating components:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось загрузить данные',
        life: 3000
      });
    }
  }

  async function sendRequest(data) {
    try {
      console.log('Sending request with data:', {
        category: categoryNameValue.value,
        type: dataChangeTypeNamesValue.value,
        data
      });
      
      await serverRequests[categoryNameValue.value][dataChangeTypeNamesValue.value](data);
      await updateComponents();
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Операция выполнена успешно',
        life: 3000
      });
    } catch (error) {
      console.error('Error sending request:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: error.response?.data?.message || 'Не удалось выполнить операцию',
        life: 3000
      });
    }
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
