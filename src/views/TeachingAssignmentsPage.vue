<template>
  <div class="teaching-assignments-page">
    <h1>Назначение преподавателей</h1>

    <div class="content">
      <div class="form-section">
        <h2>Новое назначение</h2>
        <TeachingAssignmentsForm @assignment-created="fetchAssignments" />
      </div>

      <div class="assignments-section">
        <h2>Текущие назначения</h2>
        <div class="assignments-list">
          <div
            v-for="assignment in assignments"
            :key="assignment.teachingAssignmentId"
            class="assignment-card"
          >
            <div class="assignment-card__teacher">
              {{ assignment.teacher.fullName }}
            </div>
            <div class="assignment-card__group">
              {{ assignment.group.groupCode }}
            </div>
            <div class="assignment-card__subject">
              {{ assignment.subject.name }}
            </div>
            <Button
              icon="pi pi-trash"
              class="p-button-danger p-button-sm"
              @click="deleteAssignment(assignment.teachingAssignmentId)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useToast } from 'primevue/usetoast';
  import { teachingAssignmentsService } from '@service/api-endpoints/teaching-assignments.js';
  import TeachingAssignmentsForm from '@components/TeachingAssignments/TeachingAssignmentsForm.vue';
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
          fullName: `${assignment.teacher.surname} ${assignment.teacher.name} ${assignment.teacher.patronymic || ''}`,
        },
      }));
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось загрузить список назначений',
        life: 3000,
      });
    }
  };

  const deleteAssignment = async (assignmentId) => {
    console.log(assignmentId,'!!!');
    try {
      await teachingAssignmentsService.delete(assignmentId);
      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Назначение удалено',
        life: 3000,
      });
      await fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось удалить назначение',
        life: 3000,
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

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assignment-card {
  background: var(--surface-card);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.assignment-card__teacher {
  font-weight: 600;
  color: var(--primary-color);
}

.assignment-card__group,
.assignment-card__subject,
.assignment-card__semester {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

@media (max-width: 768px) {
  .teaching-assignments-page {
    padding: 1rem;
  }
  .content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .form-section,
  .assignments-section {
    padding: 1rem;
  }
}
</style>