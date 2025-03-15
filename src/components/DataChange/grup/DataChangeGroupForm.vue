<template>
  <form
    class="addition-form"
    action=""
  >
    <h2 class="settings__title">
      Изменить данные
    </h2>
    <InputText
      v-model="groupData.groupCode"
      :disabled="disabled"
      class="settings__input-search"
      placeholder="Код группы"
    />
    <InputNumber
      v-model="groupData.yearOfEntry"
      class="settings__input-search"
      placeholder="Год начала обучения"
      :disabled="disabled"
    />

    <Button
      :label="buttonName"
      :disabled="disabled"
      @click="$emit('formSubmission',{...groupData})"
    />
  </form>
</template>

<script setup>
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import InputNumber from 'primevue/inputnumber';
  import { dataChangeTypeNames } from '@constants/localization.js';
  import { computed } from 'vue';

  defineEmits(['formSubmission']);

  const dataChangeTypeNamesValue = defineModel('dataChangeType', {
    type:String,
    default:'',
  });

  const disabled = defineModel('disabled',{
    type:Boolean,
    default: false,
  });

  const groupData = defineModel({
    type: Object,
    default: () => ({
      groupCode: '',
      yearOfEntry: '',
      yearOfIssue: '',
    }),
  });

  const buttonName = computed(() => dataChangeTypeNamesValue.value === dataChangeTypeNames.create.name ? 'Добавить' : 'Изменить');

</script>

<style></style>