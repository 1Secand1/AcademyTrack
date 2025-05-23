<template>
  <div class="authorization-page">
    <div class="authorization-container">
      <h1>Авторизация</h1>
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="login">Логин</label>
            <InputText id="login" v-model="login" class="w-full" />
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <InputText id="password" v-model="password" type="password" class="w-full" />
          </div>
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          <Button type="submit" label="Войти" class="w-full" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@service/auth.js';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const router = useRouter();
const login = ref('');
const password = ref('');
const error = ref('');

const handleSubmit = async () => {
  try {
    error.value = '';
    const { user } = await authService.login({
      login: login.value,
      password: password.value
    });

    // Перенаправление в зависимости от роли
    if (user.roles.includes('admin')) {
      router.push('/data-change');
    } else if (user.roles.includes('teacher')) {
      router.push('/user-groups');
    } else {
      router.push('/');
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка авторизации';
  }
};
</script>

<style scoped>
.authorization-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--surface-ground);
}

.authorization-container {
  background-color: var(--surface-card);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.error-message {
  color: var(--red-500);
  margin-bottom: 1rem;
  text-align: center;
}
</style>
