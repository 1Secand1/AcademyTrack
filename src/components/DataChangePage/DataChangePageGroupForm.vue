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
      class="settings__input-search"
      placeholder="Код группы"
    />
    <InputText
      v-model="groupData.yearOfEntry"
      class="settings__input-search"
      placeholder="Год начала обучения"
    />
    <InputText
      v-model="groupData.yearOfIssue"
      class="settings__input-search"
      placeholder="Год окончания обучения"
    />

    <Button
      label="Изменить"
      @click="add"
    />
  </form>
</template>

<script setup>
  import { reactive, toRaw, watch } from 'vue';

  import { useFetch } from '@service/useFetch';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';

  const formData = defineModel();

  const groupData = reactive({
    groupCode: '',
    yearOfEntry: '',
    yearOfIssue: '',
  });

  watch(formData, (newFormData) => {
    groupData.groupCode = newFormData?.groupCode;
    groupData.yearOfEntry = newFormData?.yearOfEntry;
    groupData.yearOfIssue = newFormData?.yearOfIssue;
  });

  function add() {
    useFetch('http://localhost:80/group', 'POST', toRaw(groupData));
  }

</script>

<style></style>