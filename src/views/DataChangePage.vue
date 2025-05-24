<template>
  <div class="wrapper">
    <div class="content-layout">
      <section class="settings">
        <component
          :is="currentActiveForm"
          v-model="selectedRow"
          v-model:data-change-type="dataChangeTypeNamesValue"
          :groups="groupedComponentCatalog[userRoleNames.groups.name].data"
          :disabled="dataChangeTypeNames.update.name === dataChangeTypeNamesValue && Object.keys(selectedRow).length === 0"
          @form-submission="sendRequest"
        />

        <DataChangeOptionSwitch
          v-model:category="categoryNameValue"
          v-model:data-change-type="dataChangeTypeNamesValue"
          v-model:addition-method="namesOfDataAdditionMethodsValue"
        />
      </section>

      <!-- Десктопная версия -->
      <section class="table-section">
        <DataTable
          v-if="!isMobile"
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

        <!-- Мобильная версия -->
        <div
          v-else
          class="data-list"
        >
          <div
            v-if="currentDateTable.length === 0"
            class="no-data"
          >
            <p>Нет данных для отображения</p>
          </div>
          <div
            v-for="item in currentDateTable"
            v-else
            :key="item.id"
            class="data-card"
            :class="{ 'is-selected': selectedRow.id === item.id }"
            @click="onRowSelect({ data: item })"
          >
            <div class="data-card__content">
              <div class="data-card__header">
                <h3 class="data-card__title">
                  {{ getCardTitle(item) }}
                </h3>
                <div
                  class="data-card__status"
                  :class="{ 'is-selected': selectedRow.id === item.id }"
                >
                  <i
                    v-if="selectedRow.id === item.id"
                    class="pi pi-check"
                  />
                </div>
              </div>
              <div class="data-card__fields">
                <template
                  v-for="row in currentActiveTable"
                  :key="row.valueKey"
                >
                  <div
                    v-if="item[row.valueKey]"
                    class="data-card__field"
                  >
                    <span class="label">{{ row.text }}</span>
                    <span class="value">{{ item[row.valueKey] }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
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
      { text:'Отчество',valueKey:'patronymic' },
    ],
    [userRoleNames.groups.name]: [
      { text:'Код группы',valueKey:'groupCode' },
      { text:'Год поступления',valueKey:'yearOfEntry' },
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
          const response = await teachersService.update(teacherId, body);
          return response;
        } catch (error) {
          throw error;
        }
      },
      [dataChangeTypeNames.create.name]: async (body) => {
        try {
          const response = await teachersService.create(body);
          return response;
        } catch (error) {
          console.error('Error creating teacher:', error);
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data,
          });
          throw error;
        }
      },
      [dataChangeTypeNames.get.name]: async () => {
        try {
          const response = await teachersService.get();
          return response;
        } catch (error) {
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data,
          });
          throw error;
        }
      },
    },
    [userRoleNames.groups.name]: {
      [dataChangeTypeNames.update.name]: async ({ groupId, groupCode, yearOfEntry }) => {
        try {
          const response = await groupsService.update(groupId, { groupCode, yearOfEntry });
          return response;
        } catch (error) {
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data,
          });
          throw error;
        }
      },
      [dataChangeTypeNames.create.name]: async (body) => {
        try {
          const response = await groupsService.create(body);
          return response;
        } catch (error) {
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data,
          });
          throw error;
        }
      },
      [dataChangeTypeNames.get.name]: async () => {
        try {
          const response = await groupsService.getAll();
          return response;
        } catch (error) {
          console.error('Error details:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data,
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

  // Добавляем кэш для данных групп
  const groupsDataCache = {
    data: null,
    timestamp: null,
    maxAge: 5 * 60 * 1000, // 5 минут
  };

  const currentActiveForm = shallowRef(DataChangeStudentForm);
  const currentActiveTable = ref([]);
  const currentDateTable = ref([]);

  const categoryNameValue = ref(userRoleNames.students.name);
  const namesOfDataAdditionMethodsValue = ref(namesOfDataAdditionMethods.manually);
  const dataChangeTypeNamesValue = ref(dataChangeTypeNames.create.name);

  const selectedRow = ref({});

  // Добавляем определение мобильного устройства
  const isMobile = ref(window.innerWidth <= 768);

  // Добавляем слушатель изменения размера окна
  onMounted(() => {
    updateComponents();
    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 768;
    });
  });

  watch([categoryNameValue, namesOfDataAdditionMethodsValue], () => {
    updateComponents();
  });

  function onRowSelect(event) {
    const selectedData = event.data;
    dataChangeTypeNamesValue.value = dataChangeTypeNames.update.name;

    // Преобразуем данные в формат, ожидаемый формой
    if (categoryNameValue.value === userRoleNames.students.name) {
      selectedRow.value = {
        id: selectedData.id,
        studentId: selectedData.id,
        groupCode: selectedData.groupCode,
        surname: selectedData.surname,
        name: selectedData.name,
        patronymic: selectedData.patronymic,
      };
    } else if (categoryNameValue.value === userRoleNames.teachers.name) {
      selectedRow.value = {
        id: selectedData.id,
        teacherId: selectedData.id,
        surname: selectedData.surname,
        name: selectedData.name,
        patronymic: selectedData.patronymic,
      };
    } else if (categoryNameValue.value === userRoleNames.groups.name) {
      selectedRow.value = {
        id: selectedData.id,
        groupId: selectedData.id,
        groupCode: selectedData.groupCode,
        yearOfEntry: selectedData.yearOfEntry,
      };
    }
  }

  // Функция для получения данных групп с кэшированием
  async function getGroupsData() {
    const now = Date.now();
    if (groupsDataCache.data && groupsDataCache.timestamp && (now - groupsDataCache.timestamp < groupsDataCache.maxAge)) {
      return groupsDataCache.data;
    }

    try {
      const data = await serverRequests[userRoleNames.groups.name].get();
      groupsDataCache.data = data;
      groupsDataCache.timestamp = now;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function updateComponents() {
    const component = groupedComponentCatalog[categoryNameValue.value];

    if (!component) {
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
      component.data = await serverRequests[categoryNameValue.value].get();

      // Загружаем данные групп только если мы в разделе студентов
      if (categoryNameValue.value === userRoleNames.students.name) {
        const groupsData = await getGroupsData();
        groupedComponentCatalog[userRoleNames.groups.name].data = groupsData;
      }

      currentDateTable.value = component.data;
      currentActiveTable.value = component.table;
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось загрузить данные',
        life: 3000,
      });
    }
  }

  // Добавляем функцию для принудительного обновления кэша групп
  async function refreshGroupsCache() {
    groupsDataCache.data = null;
    groupsDataCache.timestamp = null;
    await getGroupsData();
  }

  // Обновляем функцию sendRequest для обновления кэша после изменений
  async function sendRequest(data) {
    try {
      // Проверяем наличие необходимых данных
      if (dataChangeTypeNamesValue.value === dataChangeTypeNames.update.name) {
        if (!data.id) {
          throw new Error('ID не указан для обновления');
        }
      }

      // Добавляем дополнительные проверки в зависимости от категории
      if (categoryNameValue.value === userRoleNames.students.name) {
        if (!data.surname || !data.name) {
          throw new Error('Фамилия и имя обязательны для заполнения');
        }
      } else if (categoryNameValue.value === userRoleNames.teachers.name) {
        if (!data.surname || !data.name) {
          throw new Error('Фамилия и имя обязательны для заполнения');
        }
      } else if (categoryNameValue.value === userRoleNames.groups.name) {
        if (!data.groupCode) {
          throw new Error('Код группы обязателен для заполнения');
        }
      }

      await serverRequests[categoryNameValue.value][dataChangeTypeNamesValue.value](data);

      // Обновляем кэш групп если мы работаем с группами или студентами
      if (categoryNameValue.value === userRoleNames.groups.name ||
        categoryNameValue.value === userRoleNames.students.name) {
        await refreshGroupsCache();
      }

      await updateComponents();

      // Очищаем выбранную строку после успешного обновления
      if (dataChangeTypeNamesValue.value === dataChangeTypeNames.update.name) {
        selectedRow.value = {};
      }

      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Операция выполнена успешно',
        life: 3000,
      });
    } catch (error) {
      console.error('Error sending request:', eror);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: error.response?.data?.message || error.message || 'Не удалось выполнить операцию',
        life: 3000,
      });
    }
  }

  // Добавляем функцию для получения заголовка карточки
  function getCardTitle(item) {
    if (categoryNameValue.value === userRoleNames.students.name) {
      return `${item.surname} ${item.name} ${item.patronymic || ''}`;
    } else if (categoryNameValue.value === userRoleNames.teachers.name) {
      return `${item.surname} ${item.name} ${item.patronymic || ''}`;
    } else if (categoryNameValue.value === userRoleNames.groups.name) {
      return item.groupCode;
    }
    return '';
  }

</script>

<style scoped>
.wrapper {
  padding: 2rem;
  height: 100%;
}

.content-layout {
  display: flex;
  gap: 2rem;
  height: 100%;
}

.settings {
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

/* Стили для форм и инпутов */
:deep(.p-form) {
  width: 100%;
}

:deep(.p-form-field) {
  width: 100%;
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-calendar),
:deep(.p-inputnumber),
:deep(.p-inputtextarea) {
  width: 100% !important;
}

:deep(.p-dropdown-panel) {
  width: 100% !important;
  max-width: 100vw;
}

:deep(.p-button) {
  width: 100%;
}

/* Стили для переключателей */
:deep(.p-radiobutton),
:deep(.p-checkbox) {
  margin-right: 0.5rem;
  transition: all 0.2s ease;
}

:deep(.p-radiobutton-label),
:deep(.p-checkbox-label) {
  margin-left: 0.5rem;
  transition: color 0.2s ease;
}

:deep(.p-radiobutton-box),
:deep(.p-checkbox-box) {
  margin-right: 0.5rem;
  transition: all 0.2s ease;
}

:deep(.p-radiobutton-box.p-highlight),
:deep(.p-checkbox-box.p-highlight) {
  transition: all 0.2s ease;
}

:deep(.p-radiobutton-box.p-highlight .p-radiobutton-icon),
:deep(.p-checkbox-box.p-highlight .p-checkbox-icon) {
  transition: all 0.2s ease;
}

:deep(.p-radiobutton:not(.p-disabled):hover .p-radiobutton-box),
:deep(.p-checkbox:not(.p-disabled):hover .p-checkbox-box) {
  transition: all 0.2s ease;
}

:deep(.p-radiobutton:not(.p-disabled):hover .p-radiobutton-label),
:deep(.p-checkbox:not(.p-disabled):hover .p-checkbox-label) {
  transition: color 0.2s ease;
}

/* Добавляем плавные переходы для карточек */
.data-card {
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.data-card.is-selected {
  transition: all 0.3s ease;
}

/* Добавляем плавные переходы для статуса */
.data-card__status {
  transition: all 0.3s ease;
}

.data-card__status.is-selected {
  transition: all 0.3s ease;
}

/* Добавляем плавные переходы для полей */
.data-card__field {
  transition: all 0.2s ease;
}

/* Добавляем плавные переходы для кнопок */
:deep(.p-button) {
  transition: all 0.2s ease;
}

:deep(.p-button:hover) {
  transition: all 0.2s ease;
}

/* Добавляем плавные переходы для инпутов */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-calendar),
:deep(.p-inputnumber),
:deep(.p-inputtextarea) {
  transition: all 0.2s ease;
}

:deep(.p-inputtext:focus),
:deep(.p-dropdown:focus),
:deep(.p-calendar:focus),
:deep(.p-inputnumber:focus),
:deep(.p-inputtextarea:focus) {
  transition: all 0.2s ease;
}

.table-section {
  flex: 1;
  min-width: 0; /* Для корректной работы flex-shrink */
}

.table {
  width: 100%;
  height: 100%;
}

/* Стили для мобильной версии */
.data-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.data-card {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.data-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-border);
}

.data-card__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.data-card__status {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--surface-ground);
  color: var(--primary-color);
}

.data-card__status.is-selected {
  background: var(--primary-color);
  color: white;
}

.data-card__fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.data-card__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  background: var(--surface-ground);
  border-radius: 6px;
}

.label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary);
}

@media (max-width: 768px) {
  .wrapper {
    padding: 1rem;
  }

  .content-layout {
    flex-direction: column;
    gap: 1rem;
  }

  .settings {
    flex: none;
    width: 100%;
  }

  .table-section {
    width: 100%;
  }

  .data-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .data-card {
    background: var(--surface-card);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
  }

  .data-card.is-selected {
    border-color: var(--primary-color);
    background: var(--primary-50);
  }

  .data-card__content {
    width: 100%;
  }

  .data-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--surface-border);
  }

  .data-card__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
    flex: 1;
    padding-right: 1rem;
  }

  .data-card__status {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--surface-ground);
    color: var(--primary-color);
    flex-shrink: 0;
  }

  .data-card__status.is-selected {
    background: var(--primary-color);
    color: white;
  }

  .data-card__fields {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .data-card__field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.375rem;
    background: var(--surface-ground);
    border-radius: 6px;
  }

  /* Стили для форм на мобильных устройствах */
  :deep(.p-inputtext),
  :deep(.p-dropdown),
  :deep(.p-calendar) {
    width: 100%;
  }

  :deep(.p-dropdown-panel) {
    width: 100% !important;
    max-width: 100vw;
  }

  :deep(.p-button) {
    width: 100%;
  }

  :deep(.p-form) {
    width: 100%;
  }

  :deep(.p-form-field) {
    width: 100%;
  }
}
</style>
