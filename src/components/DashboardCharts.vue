<template>
  <div class="dashboard-charts">
    <Card class="chart-card">
      <template #title>Посещаемость по группам</template>
      <template #content>
        <Bar
          :data="attendanceData"
          :options="chartOptions"
        />
      </template>
    </Card>

    <Card class="chart-card">
      <template #title>Распределение предметов</template>
      <template #content>
        <Pie
          :data="subjectsData"
          :options="chartOptions"
        />
      </template>
    </Card>

    <Card class="chart-card">
      <template #title>Нагрузка преподавателей</template>
      <template #content>
        <Line
          :data="workloadData"
          :options="chartOptions"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Bar, Pie, Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import Card from 'primevue/card';
import { groupsService } from '@service/api-endpoints/groups.js';
import { subjectsService } from '@service/api-endpoints/subjects.js';
import { teachingAssignmentsService } from '@service/api-endpoints/teaching-assignments.js';

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const attendanceData = ref({
  labels: [],
  datasets: [{
    label: 'Процент посещаемости',
    backgroundColor: '#42A5F5',
    data: []
  }]
});

const subjectsData = ref({
  labels: [],
  datasets: [{
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40'
    ],
    data: []
  }]
});

const workloadData = ref({
  labels: [],
  datasets: [{
    label: 'Количество часов',
    borderColor: '#42A5F5',
    data: []
  }]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  }
};

onMounted(async () => {
  try {
    // Загрузка данных для графиков
    const [groups, subjects, assignments] = await Promise.all([
      groupsService.getAll(),
      subjectsService.getAll().then(response => response.json()),
      teachingAssignmentsService.get()
    ]);

    // Подготовка данных для графика посещаемости
    attendanceData.value.labels = groups.map(g => g.groupCode);
    attendanceData.value.datasets[0].data = groups.map(() => Math.floor(Math.random() * 100)); // Временные данные

    // Подготовка данных для графика предметов
    subjectsData.value.labels = subjects.map(s => s.name);
    subjectsData.value.datasets[0].data = subjects.map(() => Math.floor(Math.random() * 50)); // Временные данные

    // Подготовка данных для графика нагрузки
    const teachers = [...new Set(assignments.map(a => `${a.teacher.surname} ${a.teacher.name}`))];
    workloadData.value.labels = teachers;
    workloadData.value.datasets[0].data = teachers.map(() => Math.floor(Math.random() * 30)); // Временные данные

  } catch (error) {
    console.error('Error loading chart data:', error);
  }
});
</script>

<style scoped>
.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.chart-card {
  height: 300px;
}

.chart-card :deep(.p-card-content) {
  height: calc(100% - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 