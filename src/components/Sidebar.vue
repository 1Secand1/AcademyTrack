<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>AcademyTrack</h2>
    </div>
    <nav class="sidebar-nav">
      <button class="nav-item" :class="{ active: $route.path === '/' }" @click="handleNavigation('/')">
        <i class="pi pi-home"></i>
        <span>Главная</span>
      </button>
      <button class="nav-item" :class="{ active: $route.path === '/user-groups' }" @click="handleNavigation('/user-groups')">
        <i class="pi pi-users"></i>
        <span>Группы</span>
      </button>
      <template v-if="isAdmin">
        <button class="nav-item" :class="{ active: $route.path === '/teaching-assignments' }" @click="handleNavigation('/teaching-assignments')">
          <i class="pi pi-calendar"></i>
          <span>Нагрузка</span>
        </button>
        <button class="nav-item" :class="{ active: $route.path === '/schedule-planning' }" @click="handleNavigation('/schedule-planning')">
          <i class="pi pi-calendar-plus"></i>
          <span>Формирование расписания</span>
        </button>
        <button class="nav-item" :class="{ active: $route.path === '/schedule-management' }" @click="handleNavigation('/schedule-management')">
          <i class="pi pi-calendar-edit"></i>
          <span>Управление расписанием</span>
        </button>
        <button class="nav-item" :class="{ active: $route.path === '/subjects' }" @click="handleNavigation('/subjects')">
          <i class="pi pi-list"></i>
          <span>Предметы</span>
        </button>
        <button class="nav-item" :class="{ active: $route.path === '/data-change' }" @click="handleNavigation('/data-change')">
          <i class="pi pi-cog"></i>
          <span>Управление данными</span>
        </button>
      </template>
      <button class="nav-item logout" @click="handleLogout">
        <i class="pi pi-sign-out"></i>
        <span>Выйти</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@service/auth.js';
import { useToast } from 'primevue/usetoast';
import { deleteCookie } from '@utils/cookie.js';

const router = useRouter();
const toast = useToast();
const isAdmin = computed(() => authService.isAdmin());

const handleNavigation = async (path) => {
  try {
    console.log('[Sidebar] Starting navigation to:', path);
    
    if (router.currentRoute.value.path === path) {
      console.log('[Sidebar] Already on the target page');
      return;
    }
    
    await router.replace(path);
    console.log('[Sidebar] Navigation completed successfully');
  } catch (error) {
    console.error('[Sidebar] Navigation error:', {
      path,
      error: error.message,
      stack: error.stack
    });
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось перейти на страницу',
      life: 3000
    });
  }
};

const handleLogout = async () => {
  try {
    console.log('[Sidebar] Starting logout process');
    deleteCookie('token');
    await router.replace('/login');
    console.log('[Sidebar] Logout completed successfully');
  } catch (error) {
    console.error('[Sidebar] Logout error:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось выйти из системы',
      life: 3000
    });
  }
};

onMounted(() => {
  console.log('[Sidebar] Component mounted');
  console.log('[Sidebar] Is user admin?', isAdmin.value);
  console.log('[Sidebar] Current user:', authService.getCurrentUser());
});
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 250px;
  background: var(--surface-card);
  border-right: 1px solid var(--surface-border);
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.sidebar-header h2 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
  width: 100%;
}

.nav-item i {
  font-size: 1.25rem;
  color: var(--text-color-secondary);
}

.nav-item:hover {
  background-color: var(--surface-hover);
}

.nav-item.active {
  background-color: var(--primary-50);
  color: var(--primary-color);
}

.nav-item.active i {
  color: var(--primary-color);
}

.nav-item.logout {
  margin-top: auto;
  color: var(--red-500);
}

.nav-item.logout i {
  color: var(--red-500);
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style> 