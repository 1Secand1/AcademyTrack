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
      v-model="groupData.groupCode"
      :disabled="disabled"
      class="settings__input-search"
      placeholder="Код группы"
      :class="{ 'p-invalid': !isGroupCodeValid }"
    />
    <small v-if="!isGroupCodeValid" class="p-error">Код группы обязателен</small>

    <InputNumber
      v-model="groupData.yearOfEntry"
      class="settings__input-search"
      placeholder="Год поступления"
      :disabled="disabled"
      :class="{ 'p-invalid': !isYearValid }"
      :min="2000"
      :max="2100"
    />
    <small v-if="!isYearValid" class="p-error">Год должен быть между 2000 и 2100</small>

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
  import InputNumber from 'primevue/inputnumber';
  import { dataChangeTypeNames } from '@constants/localization.js';
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();

  const emit = defineEmits(['formSubmission']);

  const dataChangeTypeNamesValue = defineModel('dataChangeType',{ type:String });

  const disabled = defineModel('disabled',{
    type:Boolean,
    default: false,
  });

  const groupData = defineModel({
    type:Object,
    default:() => ({
      groupCode: '',
      yearOfEntry: null
    }),
  });

  const isGroupCodeValid = computed(() => {
    return groupData.value.groupCode && groupData.value.groupCode.trim().length > 0;
  });

  const isYearValid = computed(() => {
    return !groupData.value.yearOfEntry || 
           (groupData.value.yearOfEntry >= 2000 && groupData.value.yearOfEntry <= 2100);
  });

  const isFormValid = computed(() => {
    return isGroupCodeValid.value && isYearValid.value;
  });

  const buttonName = computed(() => dataChangeTypeNamesValue.value === dataChangeTypeNames.create.name ? 'Добавить' : 'Изменить');

  function handleSubmit() {
    if (!isFormValid.value) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Пожалуйста, заполните все обязательные поля корректно',
        life: 3000
      });
      return;
    }

    const dataToSubmit = {
      groupCode: groupData.value.groupCode.trim(),
      yearOfEntry: groupData.value.yearOfEntry
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