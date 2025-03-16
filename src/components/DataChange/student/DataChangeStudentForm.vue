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
    <InputText
      v-model.number="studentData.groupId"
      :disabled="disabled"
      class="settings__input-search"
      placeholder="Код группы"
    />

    <Select
      v-model="selectedCity"
      :options="cities"
      option-label="name"
      placeholder="Select a City"
      class="w-full md:w-56"
    />

    <script setup>
      import { ref } from "vue";

      const selectedCity = ref();
      const cities = ref([
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
      ]);
    </script>

    <Button
      :label="buttonName"
      :disabled="disabled"
      @click="$emit('formSubmission',{...studentData})"
    />
  </form>
</template>

<script setup>
  import Button from 'primevue/button';
  import Select from 'primevue/';
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