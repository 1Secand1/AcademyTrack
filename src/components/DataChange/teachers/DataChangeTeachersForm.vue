<template>
  <form
    class="addition-form"
    action=""
    @submit.prevent="handleSubmit"
  >
    <h2 class="settings__title">
      Изменить данные
    </h2>
    <InputText
      v-model="teachersData.surname"
      :disabled="disabled"
      class="settings__input-search"
      placeholder="Фамилия"
      :class="{ 'p-invalid': !isSurnameValid }"
    />
    <small
      v-if="!isSurnameValid"
      class="p-error"
    >Фамилия обязательна</small>

    <InputText
      v-model="teachersData.name"
      :disabled="disabled"
      class="settings__input-search"
      placeholder="Имя"
      :class="{ 'p-invalid': !isNameValid }"
    />
    <small
      v-if="!isNameValid"
      class="p-error"
    >Имя обязательно</small>

    <InputText
      v-model="teachersData.patronymic"
      :disabled="disabled"
      class="settings__input-search"
      placeholder="Отчество"
    />

    <Button
      :label="buttonName"
      :disabled="disabled || !isFormValid"
      @click="handleSubmit"
    />
  </form>
</template>

<script setup>
  import { computed } from 'vue';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import { dataChangeTypeNames } from '@constants/localization.js';
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();

  const emit = defineEmits(['formSubmission']);

  const dataChangeTypeNamesValue = defineModel('dataChangeType',{ type:String });

  const disabled = defineModel('disabled',{
    type:Boolean,
    default: false,
  });

  const teachersData = defineModel({
    type:Object,
    default:() => ({
      surname: '',
      name: '',
      patronymic: '',
    }),
  });

  const isSurnameValid = computed(() => {
    return teachersData.value.surname && teachersData.value.surname.trim().length > 0;
  });

  const isNameValid = computed(() => {
    return teachersData.value.name && teachersData.value.name.trim().length > 0;
  });

  const isFormValid = computed(() => {
    return isSurnameValid.value && isNameValid.value;
  });

  const buttonName = computed(() => dataChangeTypeNamesValue.value === dataChangeTypeNames.create.name ? 'Добавить' : 'Изменить');

  function handleSubmit() {
    if (!isFormValid.value) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Пожалуйста, заполните все обязательные поля',
        life: 3000,
      });
      return;
    }

    const dataToSubmit = {
      teacherId: teachersData.value.teacherId,
      surname: teachersData.value.surname.trim(),
      name: teachersData.value.name.trim(),
      patronymic: teachersData.value.patronymic.trim(),
    };

    emit('formSubmission', dataToSubmit);
  }
</script>

<style scoped>
.addition-form {
  display: grid;
  gap: 10px;
}

.settings__title {
  margin: 0 0 16px 0;
}

.settings__input-search {
  width: 100%;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
  margin-top: -8px;
}
</style>