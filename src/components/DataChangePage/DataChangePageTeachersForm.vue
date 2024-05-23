<template>
  <form
    class="addition-form"
    action=""
  >
    <h2 class="settings__title">
      Изменить данные
    </h2>
    <InputText
      v-model="teachersData.surname"
      class="settings__input-search"
      placeholder="Фамилия"
    />
    <InputText
      v-model="teachersData.name"
      class="settings__input-search"
      placeholder="Имя"
    />
    <InputText
      v-model="teachersData.patronymic"
      class="settings__input-search"
      placeholder="Отчество"
    />

    <Button
      class=""
      label="Изменить"
      @click=""
    />
  </form>
</template>

<script setup>
  import { reactive } from 'vue';

  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';

  const teachersData = reactive({
    surname: '',
    name: '',
    patronymic: '',
  });

</script>

<style></style>