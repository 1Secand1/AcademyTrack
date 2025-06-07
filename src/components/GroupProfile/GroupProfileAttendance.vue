<template>
  <div class="attendance-container">
    <div class="attendance-header">
      <h3 class="attendance-title">
        Посещаемость
      </h3>
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
    <div class="attendance-header-divider" />

    <!-- Статистика посещаемости -->
    <div class="attendance-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-users" />
        </div>
        <div class="stat-content">
          <div class="stat-value">
            {{ attendanceSummary.totalStudents }}
          </div>
          <div class="stat-label">
            Всего студентов
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-chart-line" />
        </div>
        <div class="stat-content">
          <div class="stat-value">
            {{ attendanceSummary.averageAttendance.toFixed(1) }}%
          </div>
          <div class="stat-label">
            Средняя посещаемость
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-calendar-times" />
        </div>
        <div class="stat-content">
          <div class="stat-value">
            {{ attendanceSummary.totalAbsences }}
          </div>
          <div class="stat-label">
            Всего пропусков
          </div>
        </div>
      </div>
    </div>

    <!-- График посещаемости -->
    <div class="attendance-chart">
      <h4>Динамика посещаемости</h4>
      <Chart
        type="line"
        :data="chartData"
        :options="chartOptions"
      />
    </div>

    <!-- Таблица студентов -->
    <DataTable
      :value="filteredStudents"
      :paginator="true"
      :rows="10"
      :rows-per-page-options="[5, 10, 20, 50]"
      :loading="loading"
      class="attendance-table"
    >
      <Column
        field="fullName"
        header="ФИО"
        sortable
      >
        <template #body="{ data }">
          <div class="student-name">
            {{ data.fullName }}
          </div>
        </template>
      </Column>
      <Column
        field="percentage"
        header="Посещаемость"
        sortable
      >
        <template #body="{ data }">
          <div class="attendance-progress">
            <ProgressBar
              :value="data.percentage"
              :show-value="false"
              :class="getAttendanceClass(data.percentage)"
            />
            <span class="percentage">{{ data.percentage.toFixed(1) }}%</span>
          </div>
        </template>
      </Column>
      <Column
        field="absences"
        header="Пропуски"
        sortable
      >
        <template #body="{ data }">
          <div class="absences-count">
            {{ data.absences }}
          </div>
        </template>
      </Column>
      <Column
        field="lastAttendance"
        header="Последнее посещение"
        sortable
      >
        <template #body="{ data }">
          <div class="last-attendance">
            {{ formatDate(data.lastAttendance) }}
          </div>
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
  import ProgressBar from 'primevue/progressbar';
  import Chart from 'primevue/chart';
  import { exportService } from '@service/exportService';
  import { attendanceService } from '@service/api-endpoints/attendance.js';

  const props = defineProps({
    groupDetails: { type: Object, required: true },
  });

  const toast = useToast();
  const router = useRouter();
  const searchQuery = ref('');
  const attendanceSummary = ref({
    students: [],
    totalStudents: 0,
    averageAttendance: 0,
    totalAbsences: 0,
    monthlyStats: [
      { month: 'Янв', attendance: 92 },
      { month: 'Фев', attendance: 88 },
      { month: 'Мар', attendance: 90 },
    ],
  });
  const loading = ref(false);

  const loadAttendanceSummary = async () => {
    try {
      loading.value = true;
      // Временные моковые данные для тестирования
      const mockData = {
        students: [
          {
            id: 1,
            fullName: 'Иванов Иван',
            percentage: 95,
            absences: 2,
            lastAttendance: '2024-03-15',
            attendance: {
              '2024-03-15': 'present',
              '2024-03-14': 'present',
              '2024-03-13': 'absent',
            },
          },
          {
            id: 2,
            fullName: 'Петров Петр',
            percentage: 85,
            absences: 4,
            lastAttendance: '2024-03-15',
            attendance: {
              '2024-03-15': 'present',
              '2024-03-14': 'absent',
              '2024-03-13': 'present',
            },
          },
        ],
        totalStudents: 2,
        averageAttendance: 90,
        totalAbsences: 6,
        monthlyStats: [
          { month: 'Янв', attendance: 92 },
          { month: 'Фев', attendance: 88 },
          { month: 'Мар', attendance: 90 },
        ],
      };

      // Используем моковые данные вместо API вызова
      attendanceSummary.value = mockData;

    // Закомментированный код для реального API
    /*
    const response = await attendanceService.getGroupAttendanceSummary(props.groupDetails.id);

    const processedResponse = {
      students: (response.students || []).map(student => ({
        ...student,
        fullName: student.fullName || '',
        attendance: student.attendance || {},
        percentage: student.percentage || 0,
        absences: student.absences || 0,
        lastAttendance: student.lastAttendance || null
      })),
      totalStudents: response.totalStudents || 0,
      averageAttendance: response.averageAttendance || 0,
      totalAbsences: response.totalAbsences || 0,
      monthlyStats: response.monthlyStats || []
    };

    attendanceSummary.value = processedResponse;
    */
    } catch (error) {
      console.error('Error loading attendance summary:', error);
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось загрузить данные о посещаемости',
        life: 3000,
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
        student.fullName.toLowerCase().includes(query),
      );
    }

    return result;
  });

  const viewStudentAttendance = (studentData) => {
    router.push({
      name: 'studentAttendance',
      params: {
        groupId: props.groupDetails.id,
        studentId: studentData.student.id,
      },
    });
  };

  const processedResponse = computed(() => {
    if (!attendanceSummary.value.students) return { students: [], totalStudents: 0, averageAttendance: 0, totalAbsences: 0 };

    return {
      students: attendanceSummary.value.students.map(student => ({
        ...student,
        fullName: student.fullName,
        attendance: student.attendance || {},
        percentage: student.percentage || 0,
        absences: student.absences || 0,
        lastAttendance: student.lastAttendance || null,
      })),
      totalStudents: attendanceSummary.value.totalStudents || 0,
      averageAttendance: attendanceSummary.value.averageAttendance || 0,
      totalAbsences: attendanceSummary.value.totalAbsences || 0,
    };
  });

  const exportData = async () => {
    try {
      if (!filteredStudents.value.length) {
        toast.add({
          severity: 'warn',
          summary: 'Предупреждение',
          detail: 'Нет данных для экспорта',
          life: 3000,
        });
        return;
      }
      const data = filteredStudents.value.map(student => ({
        'ФИО': student.fullName,
        'Посещаемость': student.percentage.toFixed(1) + '%',
        'Пропуски': student.absences,
        'Последнее посещение': formatDate(student.lastAttendance),
      }));
      const filename = exportService.generateFilename('attendance', props.groupDetails.id);
      await exportService.exportToExcel(data, filename, {
        sheetName: 'Посещаемость',
        headers: ['ФИО', 'Посещаемость', 'Пропуски', 'Последнее посещение'],
      });
      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Данные экспортированы',
        life: 3000,
      });
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: error.message || 'Не удалось экспортировать данные',
        life: 3000,
      });
    }
  };

  const chartData = computed(() => ({
    labels: attendanceSummary.value.monthlyStats.map(stat => stat.month),
    datasets: [
      {
        label: 'Посещаемость',
        data: attendanceSummary.value.monthlyStats.map(stat => stat.attendance),
        fill: false,
        borderColor: '#4CAF50',
        tension: 0.4,
      },
    ],
  }));

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: value => value + '%',
        },
      },
    },
  };

  const getAttendanceClass = (percentage) => {
    if (percentage >= 90) return 'high-attendance';
    if (percentage >= 70) return 'medium-attendance';
    return 'low-attendance';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Нет данных';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
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

.attendance-title {
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  font-size: 1.5rem;
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

.attendance-chart {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid var(--surface-border);
}

.attendance-chart h4 {
  margin: 0 0 16px 0;
  color: var(--text-color);
}

.attendance-table {
  margin-top: 24px;
}

.student-name {
  font-weight: 500;
  color: var(--text-color);
}

.attendance-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
}

.percentage {
  min-width: 60px;
  text-align: right;
  font-weight: 500;
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

.absences-count {
  font-weight: 500;
  color: var(--text-color);
}

.last-attendance {
  color: var(--text-color-secondary);
}

/* Адаптивные стили */
@media (max-width: 768px) {
  .attendance-container {
    padding: 12px 0;
  }

  .attendance-header {
    flex-direction: column;
    gap: 12px;
  }

  .attendance-title {
    font-size: 1.25rem;
  }

  .attendance-actions {
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }

  .search-container {
    width: 100%;
  }

  .attendance-stats {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .attendance-chart {
    padding: 16px;
  }

  .attendance-chart h4 {
    font-size: 1.1rem;
  }

  /* Стили для таблицы на мобильных устройствах */
  :deep(.p-datatable) {
    font-size: 14px;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th) {
    padding: 0.5rem;
    white-space: nowrap;
  }

  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.5rem;
  }

  .attendance-progress {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .percentage {
    text-align: left;
  }
}

/* Дополнительные стили для очень маленьких экранов */
@media (max-width: 480px) {
  .attendance-container {
    padding: 8px 0;
  }

  .attendance-title {
    font-size: 1.1rem;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }

  .stat-value {
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .attendance-chart {
    padding: 12px;
  }

  .attendance-chart h4 {
    font-size: 1rem;
  }

  :deep(.p-datatable) {
    font-size: 12px;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.4rem;
  }
}
</style>