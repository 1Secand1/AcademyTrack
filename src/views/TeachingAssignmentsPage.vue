<template>
  <div class="teaching-assignments-page">
    <h1>Назначение преподавателей</h1>
    
    <div class="content">
      <div class="form-section">
        <h2>Новое назначение</h2>
        <TeachingAssignmentsForm @assignmentCreated="fetchAssignments" />
      </div>

      <div class="assignments-section">
        <h2>Текущие назначения</h2>
        <DataTable
          :value="assignments"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          class="p-datatable-sm"
        >
          <Column field="teacher.fullName" header="Преподаватель" />
          <Column field="group.groupCode" header="Группа" />
          <Column field="subject.name" header="Предмет" />
          <Column field="semester" header="Семестр">
            <template #body="{ data }">
              {{ data.semester }} семестр
            </template>
          </Column>
          <Column header="Действия">
            <template #body="{ data }">
              <Button
                icon="pi pi-trash"
                class="p-button-danger p-button-sm"
                @click="deleteAssignment(data.teachingAssignmentId)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { teachingAssignmentsService } from '@service/api-endpoints/teaching-assignments.js';
import TeachingAssignmentsForm from '@components/TeachingAssignments/TeachingAssignmentsForm.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

const toast = useToast();
const assignments = ref([]);

const fetchAssignments = async () => {
  try {
    const response = await teachingAssignmentsService.get();
    assignments.value = response.map(assignment => ({
      ...assignment,
      teacher: {
        ...assignment.teacher,
        fullName: `${assignment.teacher.surname} ${assignment.teacher.name} ${assignment.teacher.patronymic || ''}`
      }
    }));
  } catch (error) {
    console.error('Error fetching assignments:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить список назначений',
      life: 3000
    });
  }
};

const deleteAssignment = async (assignmentId) => {
  try {
    await teachingAssignmentsService.delete(assignmentId);
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Назначение удалено',
      life: 3000
    });
    await fetchAssignments();
  } catch (error) {
    console.error('Error deleting assignment:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось удалить назначение',
      life: 3000
    });
  }
};

onMounted(() => {
  fetchAssignments();
});
</script>

<style scoped>
.teaching-assignments-page {
  padding: 2rem;
}

.content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-top: 2rem;
}

.form-section,
.assignments-section {
  background: var(--surface-card);
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: var(--text-color);
}
</style> 