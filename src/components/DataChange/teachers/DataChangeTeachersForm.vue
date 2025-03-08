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
      :label="buttonName"
      @click="$emit('formSubmission',{...teachersData})"
    />
  </form>
</template>

<script setup>
  import { computed } from 'vue';

  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import { dataChangeTypeNames } from '@constants/localization.js';

  defineEmits(['formSubmission']);

  const dataChangeTypeNamesValue = defineModel('dataChangeType');

  const teachersData = defineModel({
    type:Object,
    default:() => ({
      surname: '',
      name: '',
      patronymic: '',
    }),
  });

  const buttonName = computed(() => dataChangeTypeNamesValue.value === dataChangeTypeNames.create.name ? 'Добавить' : 'Изменить');

</script>

<style></style>