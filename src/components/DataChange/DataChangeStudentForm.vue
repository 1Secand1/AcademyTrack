<template>
  <form
    class="addition-form"
    action=""
  >
    <h2 class="settings__title">
      Изменить данные
    </h2>
    <InputText
      v-model="studentData.surname"
      class="settings__input-search"
      placeholder="Фамилия"
    />
    <InputText
      v-model="studentData.name"
      class="settings__input-search"
      placeholder="Имя"
    />
    <InputText
      v-model="studentData.patronymic"
      class="settings__input-search"
      placeholder="Отчество"
    />
    <InputText
      v-model="studentData.groupCode"
      class="settings__input-search"
      placeholder="Код группы"
    />

    <Button
      label="Изменить"
      @click="studentsService.create(studentData)"
    />
  </form>
</template>

<script setup>
  import { studentsService } from '@service/index';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';

  const studentData = defineModel({
    type:Object,
    default:() => ({
      surname: '',
      name: '',
      patronymic: '',
      groupCode: '',
    }),
  });

</script>

<style></style>