<template>
  <div class="registration-page">
    <div class="registration-container">
      <h1>Регистрация нового пользователя</h1>
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="login">Логин</label>
            <InputText id="login" v-model="login" class="w-full" />
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <Password id="password" v-model="password" class="w-full" toggleMask />
          </div>
          <div class="form-group">
            <label for="role">Роль</label>
            <Dropdown
              id="role"
              v-model="role"
              :options="roles"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            />
          </div>
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          <div v-if="success" class="success-message">
            {{ success }}
          </div>
          <Button type="submit" label="Зарегистрировать" class="w-full" />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { authService } from '@service/auth.js';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

const login = ref('');
const password = ref('');
const role = ref('teacher');
const error = ref('');
const success = ref('');

const roles = [
  { label: 'Преподаватель', value: 'teacher' },
  { label: 'Администратор', value: 'admin' }
];

const handleSubmit = async () => {
  try {
    error.value = '';
    success.value = '';
    
    await authService.register({
      login: login.value,
      password: password.value,
      role: role.value
    });

    success.value = 'Пользователь успешно зарегистрирован';
    login.value = '';
    password.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка регистрации';
  }
};
</script>

<style scoped>
.registration-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--surface-ground);
}

.registration-container {
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

.success-message {
  color: var(--green-500);
  margin-bottom: 1rem;
  text-align: center;
}
</style> 