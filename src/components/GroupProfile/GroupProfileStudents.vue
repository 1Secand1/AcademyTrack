<template>
  <div class="students-container">
    <div class="students-header">
      <h3 class="students-title">Студенты группы</h3>
      <div class="students-actions">
        <div class="search-container">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              placeholder="Поиск студентов..."
              class="search-input"
            />
          </span>
        </div>
        <Button
          icon="pi pi-download"
          label="Экспорт"
          @click="exportData"
          class="export-button"
        />
      </div>
    </div>
    <div class="students-header-divider"></div>

    <div v-if="students.length === 0" class="no-data">
      <i class="pi pi-users" style="font-size: 2rem"></i>
      <p>В группе пока нет студентов</p>
    </div>

    <div v-else class="students-grid">
      <div
        v-for="student in filteredStudents"
        :key="student.id"
        class="student-card"
      >
        <div class="student-info">
          <div class="student-name">
            {{ student.fullName }}
          </div>
          <div class="student-stats">
            <div class="stat">
              <i class="pi pi-chart-line"></i>
              <span>Посещаемость: {{ student.percentage.toFixed(1) }}%</span>
            </div>
            <div class="stat">
              <i class="pi pi-calendar"></i>
              <span>Посещений: {{ Object.keys(student.attendance).length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredStudents.length === 0 && students.length > 0" class="no-results">
      <i class="pi pi-search" style="font-size: 2rem"></i>
      <p>Студенты не найдены</p>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { exportService } from '@service/exportService';
import Button from 'primevue/button';

const props = defineProps({
  groupDetails: { type: Object, required: true }
});

const emit = defineEmits(['update:stats']);

const toast = useToast();
const searchQuery = ref('');

const students = computed(() => {
  console.log('Students data structure:', props.groupDetails.students);
  if (!props.groupDetails.students) {
    console.warn('No students data available');
    return [];
  }
  
  return props.groupDetails.students.map(student => {
    if (!student) {
      console.warn('Invalid student data:', student);
      return null;
    }
    
    return {
      id: student.id,
      fullName: student.fullName,
      attendance: student.attendance || {},
      percentage: student.percentage || 0
    };
  }).filter(Boolean);
});

const filteredStudents = computed(() => {
  let filtered = students.value;
  
  // Поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(student => 
      student.fullName.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

async function exportData() {
  try {
    if (!filteredStudents.value.length) {
      toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Нет данных для экспорта',
        life: 3000
      });
      return;
    }
    const data = filteredStudents.value.map(student => ({
      'ФИО': student.fullName,
      'Посещаемость': student.percentage.toFixed(1) + '%',
      'Количество посещений': Object.keys(student.attendance).length
    }));
    const filename = exportService.generateFilename('students', props.groupDetails.id);
    await exportService.exportToExcel(data, filename, {
      sheetName: 'Студенты',
      headers: ['ФИО', 'Посещаемость', 'Количество посещений']
    });
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Данные экспортированы',
      life: 3000
    });
  } catch (error) {
    console.error('Ошибка при экспорте:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.message || 'Не удалось экспортировать данные',
      life: 3000
    });
  }
}

watch(() => props.groupDetails.students, (newVal) => {
  emit('update:stats', { studentsCount: newVal?.length || 0 });
}, { immediate: true });
</script>

<style scoped>
.students-container {
  padding: 20px 0;
}

.students-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 12px;
  min-height: 56px;
}

.students-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
}

.students-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-container {
  width: 260px;
}

.search-input {
  width: 100%;
}

.students-header-divider {
  width: 100%;
  height: 1px;
  background: var(--surface-border);
  margin-bottom: 18px;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.student-card {
  background: var(--surface-card);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid var(--surface-border);
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.student-info {
  flex: 1;
}

.student-name {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
}

.student-group {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  margin-bottom: 8px;
}

.student-stats {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: var(--text-color-secondary);
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat i {
  font-size: 0.9rem;
}

.student-actions {
  display: flex;
  gap: 8px;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: var(--text-color-secondary);
}

.no-data i {
  margin-bottom: 16px;
  color: var(--primary-color);
}

.no-data p {
  font-size: 1.1rem;
  margin: 0;
}

.export-button {
  margin-left: auto;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: var(--text-color-secondary);
}

.no-results i {
  margin-bottom: 16px;
}

.student-status {
  display: none;
}

@media (max-width: 900px) {
  .students-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    min-height: unset;
  }
  .students-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .search-container {
    width: 100%;
  }
}
</style> 