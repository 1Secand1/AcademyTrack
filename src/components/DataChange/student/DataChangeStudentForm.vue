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
      :disabled="disabled"
      class="settings__input-search"
      placeholder="Фамилия"
    />
    <InputText
      v-model="studentData.name"
      :disabled="disabled"
      class="settings__input-search"
      placeholder="Имя"
    />
    <InputText
      v-model="studentData.patronymic"
      :disabled="disabled"
      class="settings__input-search"
      placeholder="Отчество"
    />

    <Dropdown
      v-model="studentData.groupId"
      :options="groups"
      option-label="groupCode"
      option-value="groupId"
      placeholder="Код группы"
      class="w-full"
      filter
    />

    <Button
      :label="buttonName"
      :disabled="disabled"
      @click="$emit('formSubmission',{...studentData})"
    />
  </form>
</template>

<script setup>
  import Dropdown from 'primevue/dropdown';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import { computed, defineProps } from 'vue';
  import { dataChangeTypeNames } from '@constants/localization.js';

  defineEmits(['formSubmission']);

  const props = defineProps({
    groups: {
      type: Array,
      required: true,
    },
  });

  const dataChangeTypeNamesValue = defineModel('dataChangeType',{ type:String });

  const disabled = defineModel('disabled',{
    type:Boolean,
    default: false,
  });

  const studentData = defineModel({
    type:Object,
    default:() => ({
      surname: '',
      name: '',
      patronymic: '',
      groupId: '',
    }),
  });

  const buttonName = computed(() => dataChangeTypeNamesValue.value === dataChangeTypeNames.create.name ? 'Добавить' : 'Изменить');

</script>

<style></style>