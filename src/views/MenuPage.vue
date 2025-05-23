<template>
  <div class="menu-page">
    <div class="menu-header">
      <h3>Меню</h3>
      <button class="close-button" @click="router.back()">
        <i class="pi pi-times"></i>
      </button>
    </div>
    <div class="menu-content">
      <div class="menu-section">
        <h4>Основные разделы</h4>
        <button class="menu-item" @click="handleNavigation('/')">
          <i class="pi pi-home"></i>
          <span>Главная</span>
        </button>
        <button class="menu-item" @click="handleNavigation('/user-groups')">
          <i class="pi pi-users"></i>
          <span>Группы</span>
        </button>
      </div>

      <div v-if="isAdmin" class="menu-section">
        <h4>Управление</h4>
        <button class="menu-item" @click="handleNavigation('/teaching-assignments')">
          <i class="pi pi-calendar"></i>
          <span>Нагрузка</span>
        </button>
        <button class="menu-item" @click="handleNavigation('/schedule-planning')">
          <i class="pi pi-calendar-plus"></i>
          <span>Формирование расписания</span>
        </button>
        <button class="menu-item" @click="handleNavigation('/schedule-management')">
          <i class="pi pi-calendar-clock"></i>
          <span>Управление расписанием</span>
        </button>
        <button class="menu-item" @click="handleNavigation('/subjects')">
          <i class="pi pi-list"></i>
          <span>Предметы</span>
        </button>
        <button class="menu-item" @click="handleNavigation('/data-change')">
          <i class="pi pi-cog"></i>
          <span>Управление данными</span>
        </button>
      </div>

      <div class="menu-section">
        <button class="menu-item logout" @click="handleLogout">
          <i class="pi pi-sign-out"></i>
          <span>Выйти</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@service/auth.js';
import { useToast } from 'primevue/usetoast';
import { deleteCookie } from '@utils/cookie.js';

const router = useRouter();
const toast = useToast();
const isAdmin = computed(() => authService.isAdmin());

const handleNavigation = async (path) => {
  try {
    await router.replace(path);
  } catch (error) {
    console.error('Navigation error:', error);
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
    deleteCookie('token');
    await router.replace('/login');
  } catch (error) {
    console.error('Logout error:', error);
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
.menu-page {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: var(--surface-ground) !important;
  z-index: 9999 !important;
  display: flex !important;
  flex-direction: column !important;
  height: 100vh !important;
  width: 100vw !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.menu-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 1rem !important;
  background: var(--surface-card) !important;
  border-bottom: 1px solid var(--surface-border) !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 1 !important;
}

.menu-header h3 {
  margin: 0 !important;
  font-size: 1.25rem !important;
  color: var(--text-color) !important;
}

.close-button {
  background: none !important;
  border: none !important;
  color: var(--text-color) !important;
  cursor: pointer !important;
  padding: 0.5rem !important;
  border-radius: 50% !important;
  transition: all 0.2s ease !important;
}

.close-button:hover {
  background-color: var(--surface-hover) !important;
}

.close-button i {
  font-size: 1.25rem !important;
}

.menu-content {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 2rem !important;
  padding: 1.5rem !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
}

.menu-section {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.75rem !important;
}

.menu-section h4 {
  color: var(--text-color-secondary) !important;
  font-size: 1rem !important;
  margin: 0 0 0.75rem 0 !important;
  padding: 0 0.75rem !important;
  font-weight: 600 !important;
}

.menu-item {
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
  padding: 1rem !important;
  background: var(--surface-card) !important;
  border: none !important;
  color: var(--text-color) !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  border-radius: var(--border-radius) !important;
  width: 100% !important;
  text-align: left !important;
  font-size: 1.1rem !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
}

.menu-item:hover {
  background-color: var(--surface-hover) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.menu-item:active {
  transform: translateY(0) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
}

.menu-item i {
  font-size: 1.5rem !important;
  width: 2rem !important;
  text-align: center !important;
  color: var(--primary-color) !important;
}

.menu-item.logout {
  color: var(--red-500) !important;
  margin-top: 1rem !important;
  font-weight: 500 !important;
}

.menu-item.logout i {
  color: var(--red-500) !important;
}

@media (max-width: 768px) {
  .menu-content {
    padding: 1rem !important;
  }

  .menu-item {
    padding: 0.875rem !important;
    font-size: 1rem !important;
  }

  .menu-item i {
    font-size: 1.25rem !important;
    width: 1.75rem !important;
  }
}
</style> 