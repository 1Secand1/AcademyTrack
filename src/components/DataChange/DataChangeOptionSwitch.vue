<template>
  <section class="settings__options">
    <SelectButton
      v-model="categoryNameValue"
      pt:root:class="settings__select-button"
      :options="Object.values(userRoleNames)"
      aria-labelledby="basic"
      :allow-empty="false"
      :unselectable="false"
    />

    <SelectButton
      v-model="dataChangeTypeNamesValue"
      pt:root:class="settings__select-button"
      :options="Object.values(dataChangeTypeNames)"
      aria-labelledby="basic"
      :allow-empty="false"
      :unselectable="false"
    />

    <SelectButton
      v-if="dataChangeTypeNamesValue === dataChangeTypeNames.adding"
      v-model="additionMethodNameValue"
      pt:root:class="settings__select-button"
      :options="Object.values(namesOfDataAdditionMethods)"
      aria-labelledby="basic"
      :allow-empty="false"
      :unselectable="false"
    />
  </section>
</template>

<script setup>
  import SelectButton from 'primevue/selectbutton';
  import { watch } from 'vue';

  import { dataChangeTypeNames, namesOfDataAdditionMethods, userRoleNames } from '@constants/localization';

  // TODO добавить тип и значения по умолчанию
  const categoryNameValue = defineModel('category');
  const additionMethodNameValue = defineModel('additionMethod');
  const dataChangeTypeNamesValue = defineModel('dataChangeType');

  watch(dataChangeTypeNamesValue, (additionMethod) => {
    if (additionMethod === dataChangeTypeNames.modify) {
      additionMethodNameValue.value = namesOfDataAdditionMethods.manually;
    }
  });

</script>

<style scoped>
.settings__select-button {
	display: flex;
}

.settings__options {
	display: grid;
	gap: 10px;
	margin-bottom: 20px;
	margin-top: auto;
}

:deep(.p-button) {
	flex: 1 1 auto;
}
</style>