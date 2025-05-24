<template>
  <div class="app">
    <Toast />
    <ConfirmDialog />
    <div class="app-container">
      <Sidebar v-if="authState && !isMobile" />
      <main class="main-content" :class="{ 'mobile': isMobile, 'with-sidebar': authState && !isMobile }">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="$route.name" />
          </transition>
        </router-view>
      </main>
    </div>
    <BottomNavigation v-if="authState && isMobile" />
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

const authState = ref(false);
const isMobile = ref(window.innerWidth <= 768);

const isAuthenticated = computed(() => {
  const auth = authService.isAuthenticated();
  authState.value = auth;
  return auth;
});

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

// Добавляем обработчик для события pageshow
const handlePageShow = (event) => {
  if (event.persisted) {
    // Only reload if we're on a page that needs fresh data
    if (route.meta.requiresAuth) {
      router.replace(route.fullPath);
    }
  }
};

// Watch for route changes to handle authentication state
watch(() => route.path, async (newPath) => {
  if (newPath === '/login') {
    authState.value = false;
  } else {
    const isAuth = await authService.checkAuth();
    authState.value = isAuth;
  }
}, { immediate: true });

onMounted(async () => {
  try {
    // Проверка авторизации при загрузке приложения
    const isAuth = await authService.checkAuth();
    authState.value = isAuth;
    
    if (!isAuth && route.path !== '/login') {
      router.push('/login');
      return;
    }
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('pageshow', handlePageShow);
  } catch (error) {
    authState.value = false;
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось проверить авторизацию',
      life: 3000
    });
    if (route.path !== '/login') {
      router.push('/login');
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('pageshow', handlePageShow);
});

// Следим за изменениями маршрута
watch(() => route.fullPath, (newPath, oldPath) => {
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