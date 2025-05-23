<template>
  <div class="subjects-container">
    <div class="page-header">
      <h2 class="title">Управление предметами</h2>
      <Button 
        icon="pi pi-plus" 
        label="Добавить предмет" 
        @click="showSubjectDialog = true"
        v-if="isAdmin"
      />
    </div>

    <DataTable
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

    <!-- Диалог добавления/редактирования предмета -->
    <Dialog
      v-model:visible="showSubjectDialog"
      :header="selectedSubject ? 'Редактирование предмета' : 'Добавление предмета'"
      :modal="true"
      class="subject-dialog"
    >
      <div class="p-fluid">
        <div class="p-field">
          <label for="subjectName">Название предмета</label>
          <InputText
            id="subjectName"
            v-model="subjectForm.name"
            :class="{ 'p-invalid': subjectFormErrors.name }"
          />
          <small class="p-error" v-if="subjectFormErrors.name">
            {{ subjectFormErrors.name }}
          </small>
        </div>
      </div>
      <template #footer>
        <Button
          label="Отмена"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeDialog"
        />
        <Button
          :label="selectedSubject ? 'Сохранить' : 'Добавить'"
          icon="pi pi-check"
          @click="saveSubject"
        />
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
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  margin: 0;
  color: var(--text-color);
}

.teachers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.teacher-chip {
  background: var(--primary-50);
  color: var(--primary-700);
}

.actions {
  display: flex;
  gap: 8px;
}

.subject-dialog {
  min-width: 450px;
}

.p-field {
  margin-bottom: 1rem;
}

.p-field label {
  display: block;
  margin-bottom: 0.5rem;
}
</style> 