<template>
  <div class="attendance-container">
    <div class="attendance-header">
      <h3 class="attendance-title">Посещаемость</h3>
      <div class="attendance-actions">
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
          class="p-button-outlined"
          @click="exportData"
        />
      </div>
    </div>
    <div class="attendance-header-divider"></div>

    <div class="attendance-stats">
      <div class="stat-card">
        <div class="stat-value">{{ attendanceSummary.totalStudents }}</div>
        <div class="stat-label">Всего студентов</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ attendanceSummary.averageAttendance.toFixed(1) }}%</div>
        <div class="stat-label">Средняя посещаемость</div>
      </div>
    </div>

    <DataTable
      :value="filteredStudents"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :loading="loading"
      class="attendance-table"
    >
      <Column field="fullName" header="ФИО" sortable>
        <template #body="{ data }">
          <div class="student-name">{{ data.fullName }}</div>
        </template>
      </Column>
      <Column field="percentage" header="Посещаемость" sortable>
        <template #body="{ data }">
          <div class="attendance-progress">
            <ProgressBar
              :value="data.percentage"
              :showValue="false"
              class="progress-bar"
            />
            <span class="percentage">{{ data.percentage.toFixed(1) }}%</span>
          </div>
        </template>
      </Column>
      <Column field="attendanceCount" header="Количество посещений" sortable>
        <template #body="{ data }">
          {{ Object.keys(data.attendance).length }}
        </template>
      </Column>
    </DataTable>

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import { exportService } from '@service/exportService';
import { attendanceService } from '@service/api-endpoints/attendance.js';

const props = defineProps({
  groupDetails: { type: Object, required: true }
});

const toast = useToast();
const router = useRouter();
const searchQuery = ref('');
const attendanceSummary = ref({
  students: [],
  totalStudents: 0,
  averageAttendance: 0
});
const loading = ref(false);

const loadAttendanceSummary = async () => {
  try {
    loading.value = true;
    const response = await attendanceService.getGroupAttendanceSummary(props.groupDetails.id);
    console.log('Attendance summary loaded:', response);
    
    // Обрабатываем данные в соответствии с новым форматом
    const processedResponse = {
      students: (response.students || []).map(student => ({
        ...student,
        fullName: student.fullName || '',
        attendance: student.attendance || {},
        percentage: student.percentage || 0
      })),
      totalStudents: response.totalStudents || 0,
      averageAttendance: response.averageAttendance || 0
    };
    
    attendanceSummary.value = processedResponse;
  } catch (error) {
    console.error('Error loading attendance summary:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить данные о посещаемости',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const filteredStudents = computed(() => {
  if (!attendanceSummary.value?.students) return [];
  
  let result = attendanceSummary.value.students;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(student => 
      student.fullName.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const viewStudentAttendance = (studentData) => {
  router.push({
    name: 'studentAttendance',
    params: { 
      groupId: props.groupDetails.id,
      studentId: studentData.student.id
    }
  });
};

const processedResponse = computed(() => {
  if (!attendanceSummary.value.students) return { students: [], totalStudents: 0, averageAttendance: 0 };
  
  return {
    students: attendanceSummary.value.students.map(student => ({
      ...student,
      fullName: student.fullName,
      attendance: student.attendance || {},
      percentage: student.percentage || 0
    })),
    totalStudents: attendanceSummary.value.totalStudents || 0,
    averageAttendance: attendanceSummary.value.averageAttendance || 0
  };
});

const exportData = async () => {
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
    const filename = exportService.generateFilename('attendance', props.groupDetails.id);
    await exportService.exportToExcel(data, filename, {
      sheetName: 'Посещаемость',
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
};

onMounted(loadAttendanceSummary);
</script>

<style scoped>
.attendance-container {
  padding: 20px 0;
}

.attendance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.attendance-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.attendance-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-container {
  width: 300px;
}

.search-input {
  width: 100%;
}

.attendance-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--surface-border);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary-50);
  color: var(--primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  margin-top: 4px;
}

.attendance-table {
  margin-top: 24px;
}

.student-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-name {
  font-weight: 500;
  color: var(--text-color);
}

.attendance-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.attendance-bar {
  flex: 1;
  height: 8px;
  background: var(--surface-ground);
  border-radius: 4px;
  overflow: hidden;
}

.attendance-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.high-attendance {
  background: var(--green-500);
}

.medium-attendance {
  background: var(--yellow-500);
}

.low-attendance {
  background: var(--red-500);
}

.attendance-value {
  min-width: 50px;
  text-align: right;
  font-weight: 500;
}

@media (max-width: 768px) {
  .attendance-header {
    flex-direction: column;
    gap: 12px;
  }

  .attendance-actions {
    flex-direction: column;
    width: 100%;
  }

  .search-container {
    width: 100%;
  }

  .export-button {
    width: 100%;
  }

  .attendance-stats {
    grid-template-columns: 1fr;
  }
}
</style> 