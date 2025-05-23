<template>
  <div class="app">
    <Toast />
    <ConfirmDialog />
    <Sidebar v-if="isAuthenticated" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@service/auth.js';
import Sidebar from '@components/Sidebar.vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const isAuthenticated = computed(() => authService.isAuthenticated());

onMounted(() => {
  // Проверка авторизации при загрузке приложения
  if (!authService.isAuthenticated()) {
    router.push('/login');
  }
});
</script>

<style>
@import 'primevue/resources/themes/lara-light-blue/theme.css';
@import 'primevue/resources/primevue.min.css';
@import 'primeicons/primeicons.css';

.app {
  min-height: 100vh;
  display: flex;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background: var(--surface-ground);
}
</style>