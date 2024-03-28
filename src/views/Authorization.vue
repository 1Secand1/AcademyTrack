<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleSubmit">
      <h2 class="login-form__title">Вход в систему</h2>

      <div class="login-form__input-box">
        <div class="login-form__named-input">
          <label for="username">Логин</label>
          <InputText id="username" v-model="formData.login" aria-describedby="username-help" />
        </div>

        <div class="login-form__named-input">
          <label for="password">Пароль</label>
          <InputText
            type="password"
            id="password"
            v-model="formData.password"
            aria-describedby="username-help"
          />
        </div>
      </div>

      <Button
        class="login-form__button"
        label="Войти"
        @click="userAuthorization(formData.login, formData.password)"
      />
    </form>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
// import InputText from 'primevue/inputText';

import { reactive, ref } from 'vue'
import { getToken } from '../servises/auth.js'

import {setCookie,getCookie} from '../utils/cookie.js'
import router from '../router/index.js';

const value = ref(null)

const formData = reactive({
  login: '',
  password: ''
})


async function userAuthorization(login, password) {
    const token = await getToken(login, password)
    
    console.log(token);
    if (!token)return
    setCookie('token',60*60*24*365, token)
    router.push({ path: '/dashboard' })
} 


</script>

<style scoped>
.login-container {
  max-width: 400px;

  margin: auto;
  margin-top: 20dvh;
  padding: 20px;

  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-form {
  display: grid;
}
.login-form__title {
  margin: 0;
}

input {
  width: 100%;
}

.login-form__button {
  margin-top: 15px;
}

.login-form__named-input {
  display: grid;
  gap: 8px;
}

.qwe > .p-inputtext {
  display: none;
}

.login-form__input-box {
  display: grid;
  margin-top: 15px;
  gap: 10px;
}
</style>
