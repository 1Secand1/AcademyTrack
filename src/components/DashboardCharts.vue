<template>
  <div class="dashboard-charts">
    <Card class="chart-card">
      <template #title>Распределение нагрузки по преподавателям</template>
      <template #content>
        <Bar
          :data="workloadData"
          :options="barOptions"
        />
      </template>
    </Card>

    <Card class="chart-card">
      <template #title>Распределение предметов по группам</template>
      <template #content>
        <Pie
          :data="subjectsData"
          :options="pieOptions"
        />
      </template>
    </Card>

    <Card class="chart-card">
      <template #title>Статистика по группам</template>
      <template #content>
        <Line
          :data="groupsData"
          :options="lineOptions"
        />
      </template>
    </Card>

    <Card class="chart-card">
      <template #title>Распределение студентов по курсам</template>
      <template #content>
        <Doughnut
          :data="studentsData"
          :options="doughnutOptions"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Bar, Pie, Line, Doughnut } from 'vue-chartjs';
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

// Данные для графика нагрузки преподавателей
const workloadData = ref({
  labels: [],
  datasets: [{
    label: 'Количество часов',
    backgroundColor: '#42A5F5',
    data: []
  }]
});

// Данные для графика распределения предметов
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

// Данные для графика статистики по группам
const groupsData = ref({
  labels: [],
  datasets: [{
    label: 'Количество студентов',
    borderColor: '#42A5F5',
    backgroundColor: 'rgba(66, 165, 245, 0.1)',
    data: []
  }]
});

// Данные для графика распределения студентов
const studentsData = ref({
  labels: [],
  datasets: [{
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0'
    ],
    data: []
  }]
});

// Настройки для разных типов графиков
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Нагрузка преподавателей'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Количество часов'
      }
    }
  }
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    }
  }
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Количество студентов'
      }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
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

    // Подготовка данных для графика нагрузки преподавателей
    const teacherWorkload = {};
    assignments.forEach(assignment => {
      const teacherName = `${assignment.teacher.surname} ${assignment.teacher.name}`;
      teacherWorkload[teacherName] = (teacherWorkload[teacherName] || 0) + 1;
    });

    workloadData.value.labels = Object.keys(teacherWorkload);
    workloadData.value.datasets[0].data = Object.values(teacherWorkload);

    // Подготовка данных для графика распределения предметов
    const subjectDistribution = {};
    assignments.forEach(assignment => {
      const subjectName = assignment.subject.name;
      subjectDistribution[subjectName] = (subjectDistribution[subjectName] || 0) + 1;
    });

    subjectsData.value.labels = Object.keys(subjectDistribution);
    subjectsData.value.datasets[0].data = Object.values(subjectDistribution);

    // Подготовка данных для графика статистики по группам
    const groupStats = groups.map(group => ({
      name: group.groupCode,
      students: group.students?.length || 0
    })).sort((a, b) => b.students - a.students);

    groupsData.value.labels = groupStats.map(g => g.name);
    groupsData.value.datasets[0].data = groupStats.map(g => g.students);

    // Подготовка данных для графика распределения студентов по курсам
    const courseDistribution = {};
    groups.forEach(group => {
      const course = group.yearOfEntry;
      courseDistribution[course] = (courseDistribution[course] || 0) + (group.students?.length || 0);
    });

    studentsData.value.labels = Object.keys(courseDistribution).map(year => `${year} курс`);
    studentsData.value.datasets[0].data = Object.values(courseDistribution);

  } catch (error) {
    console.error('Error loading chart data:', error);
  }
});
</script>

<style scoped>
.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  padding: 20px;
}

.chart-card {
  height: 400px;
  background: var(--surface-card);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-card :deep(.p-card-content) {
  height: calc(100% - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.chart-card :deep(.p-card-title) {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

@media (max-width: 768px) {
  .dashboard-charts {
    grid-template-columns: 1fr;
    padding: 10px;
  }

  .chart-card {
    height: 300px;
  }
}
</style> 