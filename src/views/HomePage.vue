<template>
  <div class="dashboard">
    <h1>Дашборд</h1>
    
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>
    
    <template v-else>
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
          <Card>
            <template #title>Группы</template>
            <template #content>
              <div class="stat-value">{{ groupsCount }}</div>
              <div class="stat-label">Всего групп</div>
            </template>
          </Card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <Card>
            <template #title>Студенты</template>
            <template #content>
              <div class="stat-value">{{ studentsCount }}</div>
              <div class="stat-label">Всего студентов</div>
            </template>
          </Card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <Card>
            <template #title>Преподаватели</template>
            <template #content>
              <div class="stat-value">{{ teachersCount }}</div>
              <div class="stat-label">Всего преподавателей</div>
            </template>
          </Card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <Card>
            <template #title>Нагрузка</template>
            <template #content>
              <div class="stat-value">{{ assignmentsCount }}</div>
              <div class="stat-label">Всего назначений</div>
            </template>
          </Card>
        </div>
      </div>
      
      <div class="grid mt-4">
        <div class="col-12">
          <Card>
            <template #title>Быстрые действия</template>
            <template #content>
              <div class="quick-actions">
                <Button 
                  label="Управление группами" 
                  icon="pi pi-users" 
                  @click="handleNavigation('userGroups')"
                />
                <Button 
                  v-if="isAdmin"
                  label="Назначение нагрузки" 
                  icon="pi pi-calendar" 
                  @click="handleNavigation('teachingAssignments')"
                />
                <Button 
                  v-if="isAdmin"
                  label="Настройки" 
                  icon="pi pi-cog" 
                  @click="handleNavigation('dataChange')"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>

      <div class="grid mt-4">
        <div class="col-12">
          <DashboardCharts />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@service/auth.js';
import { groupsService } from '@service/api-endpoints/groups.js';
import { teachingAssignmentsService } from '@service/api-endpoints/teaching-assignments.js';
import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import DashboardCharts from '@components/DashboardCharts.vue';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const isAdmin = computed(() => authService.isAdmin());

const loading = ref(true);
const groupsCount = ref(0);
const studentsCount = ref(0);
const teachersCount = ref(0);
const assignmentsCount = ref(0);

let loadingTimeout;

const handleNavigation = async (routeName) => {
  try {
    await router.push({ name: routeName });
  } catch (error) {
    console.error('Navigation error:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось перейти на страницу',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const loadDashboardData = async () => {
  try {
    loading.value = true;
    const [groupsData, assignmentsData] = await Promise.all([
      groupsService.getAll(),
      teachingAssignmentsService.get()
    ]);
    
    groupsCount.value = groupsData.length;
    assignmentsCount.value = assignmentsData.length;
    
    // Подсчет студентов и преподавателей
    const uniqueStudents = new Set();
    const uniqueTeachers = new Set();
    
    groupsData.forEach(group => {
      if (group.students) {
        group.students.forEach(student => uniqueStudents.add(student.id));
      }
    });
    
    assignmentsData.forEach(assignment => {
      if (assignment.teacher) {
        uniqueTeachers.add(assignment.teacher.id);
      }
    });
    
    studentsCount.value = uniqueStudents.size;
    teachersCount.value = uniqueTeachers.size;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить данные',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
});

onBeforeUnmount(() => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
  }
});
</script>

<style scoped>
.dashboard {
  padding: 1rem;
  min-height: 100vh;
  position: relative;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  color: var(--text-color-secondary);
  margin-top: 0.5rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.quick-actions .p-button {
  min-width: 200px;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 0.5rem;
  }
  .stat-value {
    font-size: 1.5rem;
  }
  .quick-actions {
    flex-direction: column;
  }
  .quick-actions .p-button {
    min-width: 100%;
  }
}
</style> 