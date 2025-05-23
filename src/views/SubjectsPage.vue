<template>
  <div class="subjects-container">
    <div class="page-header">
      <h2 class="title">Управление предметами</h2>
      <Button 
        icon="pi pi-plus" 
        label="Добавить предмет" 
        @click="showSubjectDialog = true"
        v-if="isAdmin"
        class="add-button"
      />
    </div>

    <!-- Десктопная версия -->
    <DataTable
      v-if="!isMobile"
      v-model:selection="selectedSubject"
      :value="subjects"
      :loading="isLoading"
      selection-mode="single"
      @row-select="onRowSelect"
      striped-rows
    >
      <Column field="name" header="Название предмета" sortable />
      <Column field="teachers" header="Преподаватели">
        <template #body="{ data }">
          <div class="teachers-list">
            <Chip 
              v-for="teacher in data.teachers" 
              :key="teacher.id"
              :label="teacher.fullName"
              class="teacher-chip"
            />
          </div>
        </template>
      </Column>
      <Column v-if="isAdmin" header="Действия">
        <template #body="{ data }">
          <div class="actions">
            <Button 
              icon="pi pi-pencil" 
              class="p-button-rounded p-button-text"
              @click="editSubject(data)"
            />
            <Button 
              icon="pi pi-trash" 
              class="p-button-rounded p-button-text p-button-danger"
              @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Мобильная версия -->
    <div v-else class="subjects-list">
      <div v-if="isLoading" class="loading">
        <ProgressSpinner />
      </div>
      <div v-else-if="subjects.length === 0" class="no-data">
        <p>Нет данных для отображения</p>
      </div>
      <div v-else v-for="subject in subjects" :key="subject.id" class="subject-card">
        <div class="subject-card__header">
          <h3 class="subject-card__title">{{ subject.name }}</h3>
          <div v-if="isAdmin" class="subject-card__actions">
            <Button 
              icon="pi pi-pencil" 
              class="p-button-rounded p-button-text"
              @click="editSubject(subject)"
            />
            <Button 
              icon="pi pi-trash" 
              class="p-button-rounded p-button-text p-button-danger"
              @click="confirmDelete(subject)"
            />
          </div>
        </div>
        <div class="subject-card__content">
          <div class="subject-card__teachers">
            <span class="label">Преподаватели:</span>
            <div class="teachers-list">
              <Chip 
                v-for="teacher in subject.teachers" 
                :key="teacher.id"
                :label="teacher.fullName"
                class="teacher-chip"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Диалог добавления/редактирования предмета -->
    <Dialog
      v-model:visible="showSubjectDialog"
      :header="selectedSubject ? 'Редактирование предмета' : 'Добавление предмета'"
      :modal="true"
      class="subject-dialog"
      :style="{ width: isMobile ? '90vw' : '450px' }"
    >
      <div class="p-fluid">
        <div class="p-field">
          <label class="form-label" for="subjectName">Название предмета</label>
          <InputText
            id="subjectName"
            v-model="subjectForm.name"
            :class="{ 'p-invalid': subjectFormErrors.name }"
            class="w-full"
          />
          <small class="p-error" v-if="subjectFormErrors.name">
            {{ subjectFormErrors.name }}
          </small>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <Button
            label="Отмена"
            icon="pi pi-times"
            class="p-button-text w-full"
            @click="closeDialog"
          />
          <Button
            :label="selectedSubject ? 'Сохранить' : 'Добавить'"
            icon="pi pi-check"
            class="w-full"
            @click="saveSubject"
          />
        </div>
      </template>
    </Dialog>

    <!-- Диалог подтверждения удаления -->
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ConfirmDialog from 'primevue/confirmdialog';
import Chip from 'primevue/chip';
import ProgressSpinner from 'primevue/progressspinner';
import { authService } from '@service/auth.js';
import { subjectsService } from '@service/api-endpoints/subjects.js';

const confirm = useConfirm();
const toast = useToast();
const isAdmin = ref(authService.isAdmin());
const isLoading = ref(false);
const subjects = ref([]);
const selectedSubject = ref(null);
const showSubjectDialog = ref(false);
const subjectForm = ref({
  name: ''
});
const subjectFormErrors = ref({
  name: ''
});

// Добавляем определение мобильного устройства
const isMobile = ref(window.innerWidth <= 768);

// Добавляем слушатель изменения размера окна
onMounted(() => {
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 768;
  });
});

onMounted(async () => {
  await loadSubjects();
});

async function loadSubjects() {
  isLoading.value = true;
  try {
    subjects.value = await subjectsService.getAll();
  } catch (error) {
    console.error('Error loading subjects:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить список предметов',
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
}

function onRowSelect(event) {
  selectedSubject.value = event.data;
}

function editSubject(subject) {
  selectedSubject.value = subject;
  subjectForm.value = {
    name: subject.name
  };
  showSubjectDialog.value = true;
}

function confirmDelete(subject) {
  confirm.require({
    message: 'Вы уверены, что хотите удалить этот предмет?',
    header: 'Подтверждение удаления',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteSubject(subject)
  });
}

async function deleteSubject(subject) {
  try {
    await subjectsService.delete(subject.id);
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Предмет успешно удален',
      life: 3000
    });
    await loadSubjects();
  } catch (error) {
    console.error('Error deleting subject:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось удалить предмет',
      life: 3000
    });
  }
}

function closeDialog() {
  showSubjectDialog.value = false;
  selectedSubject.value = null;
  subjectForm.value = {
    name: ''
  };
  subjectFormErrors.value = {
    name: ''
  };
}

async function saveSubject() {
  // Валидация
  subjectFormErrors.value = {
    name: !subjectForm.value.name ? 'Название предмета обязательно' : ''
  };

  if (subjectFormErrors.value.name) {
    return;
  }

  try {
    const subjectData = {
      name: String(subjectForm.value.name).trim()
    };

    if (selectedSubject.value) {
      await subjectsService.update(selectedSubject.value.id, subjectData);
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Предмет успешно обновлен',
        life: 3000
      });
    } else {
      await subjectsService.create(subjectData);
      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Предмет успешно добавлен',
        life: 3000
      });
    }
    closeDialog();
    await loadSubjects();
  } catch (error) {
    console.error('Error saving subject:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось сохранить предмет',
      life: 3000
    });
  }
}
</script>

<style scoped>
.subjects-container {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.teachers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.teacher-chip {
  background: var(--surface-hover);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.w-full {
  width: 100%;
}

.form-label {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  display: block;
}

.dialog-footer {
  display: flex;
  gap: 0.5rem;
}

/* Стили для мобильной версии */
.subjects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subject-card {
  background: var(--surface-card);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subject-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.subject-card__title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

.subject-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.subject-card__teachers {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary);
}

@media (max-width: 768px) {
  .subjects-container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .add-button {
    width: 100%;
  }

  .subject-card {
    padding: 0.75rem;
  }

  .dialog-footer {
    flex-direction: column;
  }

  /* Стили для инпутов на мобильных устройствах */
  :deep(.p-inputtext) {
    width: 100%;
    padding: 0.5rem;
  }
}
</style> 