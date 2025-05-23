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
    <button class="nav-item menu-button" @click="handleNavigation('/menu')">
      <i class="pi pi-bars"></i>
      <span>Меню</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@service/auth.js';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const isAdmin = computed(() => authService.isAdmin());

const handleNavigation = async (path) => {
  try {
    console.log('[BottomNav] Starting navigation to:', path);
    
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
  transition: all 0.2s ease;
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

.nav-item.menu-button {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .bottom-nav {
    padding-bottom: env(safe-area-inset-bottom, 0.5rem);
  }
}
</style> 