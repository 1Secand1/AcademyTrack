<template>
  <nav class="bottom-nav">
    <button class="nav-item" :class="{ active: $route.path === '/' }" @click="handleNavigation('/')">
      <i class="pi pi-home"></i>
      <span>Главная</span>
    </button>
    <button class="nav-item" :class="{ active: $route.path === '/user-groups' }" @click="handleNavigation('/user-groups')">
      <i class="pi pi-users"></i>
      <span>Группы</span>
    </button>
    <button v-if="isAdmin" class="nav-item" :class="{ active: $route.path === '/schedule-planning' }" @click="handleNavigation('/schedule-planning')">
      <i class="pi pi-calendar-plus"></i>
      <span>Расписание</span>
    </button>
    <button class="nav-item" @click="handleLogout">
      <i class="pi pi-sign-out"></i>
      <span>Выход</span>
    </button>
  </nav>

  <Dialog v-model:visible="showMenu" :modal="true" :style="{ width: '90vw' }" :closable="true">
    <template #header>
      <h3>Меню</h3>
    </template>
    <div class="menu-content">
      <button class="menu-item" @click="handleNavigation('/')">
        <i class="pi pi-home"></i>
        <span>Главная</span>
      </button>
      <button class="menu-item" @click="handleNavigation('/user-groups')">
        <i class="pi pi-users"></i>
        <span>Группы</span>
      </button>
      <button v-if="isAdmin" class="menu-item" @click="handleNavigation('/teaching-assignments')">
        <i class="pi pi-calendar"></i>
        <span>Нагрузка</span>
      </button>
      <button v-if="isAdmin" class="menu-item" @click="handleNavigation('/schedule-planning')">
        <i class="pi pi-calendar-plus"></i>
        <span>Формирование расписания</span>
      </button>
      <button v-if="isAdmin" class="menu-item" @click="handleNavigation('/schedule-management')">
        <i class="pi pi-calendar-edit"></i>
        <span>Управление расписанием</span>
      </button>
      <button v-if="isAdmin" class="menu-item" @click="handleNavigation('/subjects')">
        <i class="pi pi-list"></i>
        <span>Предметы</span>
      </button>
      <button v-if="isAdmin" class="menu-item" @click="handleNavigation('/data-change')">
        <i class="pi pi-cog"></i>
        <span>Управление данными</span>
      </button>
      <button class="menu-item logout" @click="handleLogout">
        <i class="pi pi-sign-out"></i>
        <span>Выйти</span>
      </button>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@service/auth.js';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import { deleteCookie } from '@utils/cookie.js';

const router = useRouter();
const toast = useToast();
const showMenu = ref(false);
const isAdmin = computed(() => authService.isAdmin());

const handleNavigation = async (path) => {
  try {
    console.log('[BottomNav] Starting navigation to:', path);
    showMenu.value = false;
    
    if (router.currentRoute.value.path === path) {
      console.log('[BottomNav] Already on the target page');
      return;
    }
    
    await router.replace(path);
    console.log('[BottomNav] Navigation completed successfully');
  } catch (error) {
    console.error('[BottomNav] Navigation error:', {
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
    console.log('[BottomNav] Starting logout process');
    showMenu.value = false;
    deleteCookie('token');
    await router.replace('/login');
    console.log('[BottomNav] Logout completed successfully');
  } catch (error) {
    console.error('[BottomNav] Logout error:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось выйти из системы',
      life: 3000
    });
  }
};
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface-card);
  display: flex;
  justify-content: space-around;
  padding: 0.5rem;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  color: var(--text-color);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-item i {
  font-size: 1.25rem;
}

.nav-item span {
  font-size: 0.75rem;
}

.nav-item.active {
  color: var(--primary-color);
}

.nav-item:last-child {
  color: var(--red-500);
}

.menu-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: var(--border-radius);
}

.menu-item:hover {
  background-color: var(--surface-hover);
}

.menu-item i {
  font-size: 1.25rem;
}

.menu-item.logout {
  color: var(--red-500);
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .bottom-nav {
    padding-bottom: env(safe-area-inset-bottom, 0.5rem);
  }
}
</style> 