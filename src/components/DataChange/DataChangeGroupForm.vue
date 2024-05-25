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
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';

  const groupData = defineModel({
    type:Object,
    default:{
      groupCode: '',
      yearOfEntry: '',
      yearOfIssue: '',
    },
  });
  
</script>

<style></style>