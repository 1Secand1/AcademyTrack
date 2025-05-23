<template>
  <div class="dashboard">
    <h1>Дашборд</h1>
    
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
                @click="router.push({ name: 'userGroups' })"
              />
              <Button 
                v-if="isAdmin"
                label="Назначение нагрузки" 
                icon="pi pi-calendar" 
                @click="router.push({ name: 'teachingAssignments' })"
              />
              <Button 
                v-if="isAdmin"
                label="Настройки" 
                icon="pi pi-cog" 
                @click="router.push({ name: 'dataChange' })"
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@service/auth.js';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DashboardCharts from '@components/DashboardCharts.vue';

const router = useRouter();
const isAdmin = computed(() => authService.isAdmin());

const groupsCount = ref(0);
const studentsCount = ref(0);
const teachersCount = ref(0);
const assignmentsCount = ref(0);

onMounted(async () => {
  // Здесь будет загрузка статистики с сервера
  // Пока используем заглушки
  groupsCount.value = 10;
  studentsCount.value = 150;
  teachersCount.value = 20;
  assignmentsCount.value = 45;
});
</script>

<style scoped>
.dashboard {
  padding: 1rem;
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
</style> 