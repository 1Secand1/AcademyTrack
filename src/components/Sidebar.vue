<template>
  <div class="sidebar">
    <div class="logo">
      <img src="@assets/logo.svg" alt="Logo" />
    </div>
    <nav class="nav">
      <router-link to="/" class="nav-item">
        <i class="pi pi-home"></i>
        <span>Главная</span>
      </router-link>
      <router-link to="/user-groups" class="nav-item">
        <i class="pi pi-users"></i>
        <span>Группы</span>
      </router-link>
      <router-link v-if="isAdmin" to="/teaching-assignments" class="nav-item">
        <i class="pi pi-book"></i>
        <span>Нагрузка</span>
      </router-link>
      <router-link v-if="isAdmin" to="/schedule-planning" class="nav-item">
        <i class="pi pi-calendar-plus"></i>
        <span>Формирование расписания</span>
      </router-link>
      <router-link v-if="isAdmin" to="/schedule-management" class="nav-item">
        <i class="pi pi-calendar-edit"></i>
        <span>Управление расписанием</span>
      </router-link>
      <router-link v-if="isAdmin" to="/subjects" class="nav-item">
        <i class="pi pi-list"></i>
        <span>Предметы</span>
      </router-link>
      <router-link v-if="isAdmin" to="/data-change" class="nav-item">
        <i class="pi pi-cog"></i>
        <span>Управление данными</span>
      </router-link>
      <router-link v-if="isAdmin" to="/register" class="nav-item">
        <i class="pi pi-user-plus"></i>
        <span>Регистрация</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { authService } from '@service/auth.js';

const isAdmin = computed(() => {
  const admin = authService.isAdmin();
  console.log('Is user admin?', admin);
  console.log('Current user:', authService.getCurrentUser());
  return admin;
});

onMounted(() => {
  console.log('Sidebar mounted');
  console.log('Current user:', authService.getCurrentUser());
  console.log('Is admin:', authService.isAdmin());
});
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: var(--surface-card);
  border-right: 1px solid var(--surface-border);
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
}

.logo img {
  max-width: 100%;
  height: auto;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: var(--surface-hover);
}

.nav-item.router-link-active {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
}

.nav-item i {
  font-size: 1.25rem;
}
</style> 