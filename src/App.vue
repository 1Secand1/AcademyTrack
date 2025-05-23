<template>
  <div class="app">
    <Toast />
    <ConfirmDialog />
    <div class="app-container">
      <Sidebar v-if="isAuthenticated && !isMobile" />
      <main class="main-content" :class="{ 'mobile': isMobile, 'with-sidebar': isAuthenticated && !isMobile }">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="$route.name" />
          </transition>
        </router-view>
      </main>
    </div>
    <BottomNavigation v-if="isAuthenticated && isMobile" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authService } from '@service/auth.js';
import Sidebar from '@components/Sidebar.vue';
import BottomNavigation from '@components/BottomNavigation.vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const confirm = useConfirm();

const isAuthenticated = computed(() => authService.isAuthenticated());
const isMobile = ref(window.innerWidth <= 768);

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

// Добавляем обработчик для события pageshow
const handlePageShow = (event) => {
  console.log('[App] Page show event:', event);
  if (event.persisted) {
    console.log('[App] Page was restored from cache');
    // Only reload if we're on a page that needs fresh data
    if (route.meta.requiresAuth) {
      router.replace(route.fullPath);
    }
  }
};

onMounted(async () => {
  try {
    console.log('[App] Component mounted');
    // Проверка авторизации при загрузке приложения
    const isAuth = await authService.checkAuth();
    console.log('[App] Auth check result:', isAuth);
    
    if (!isAuth) {
      console.log('[App] User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('pageshow', handlePageShow);
  } catch (error) {
    console.error('[App] Auth check error:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось проверить авторизацию',
      life: 3000
    });
    router.push('/login');
  }
});

onBeforeUnmount(() => {
  console.log('[App] Component unmounting');
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('pageshow', handlePageShow);
});

// Следим за изменениями маршрута
watch(() => route.fullPath, (newPath, oldPath) => {
  console.log('[App] Route changed:', { from: oldPath, to: newPath });
}, { immediate: true });
</script>

<style>
@import 'primevue/resources/themes/lara-light-blue/theme.css';
@import 'primevue/resources/primevue.min.css';
@import 'primeicons/primeicons.css';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  flex: 1;
  display: flex;
  position: relative;
}

.main-content {
  flex: 1;
  padding: 1rem;
  transition: margin-left 0.3s;
  min-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.main-content.with-sidebar {
  margin-left: 250px;
}

.main-content.mobile {
  margin-left: 0;
  padding-bottom: 4rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Стили для Toast */
.p-toast {
  z-index: 1000;
}

/* Стили для ConfirmDialog */
.p-dialog {
  z-index: 1000;
}
</style>