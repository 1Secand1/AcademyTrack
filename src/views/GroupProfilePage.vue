<template>
  <h2 class="titlePage">
    Профиль группы {{ groupCode }}
  </h2>

  <SelectButton
    v-model="currentCategory"
    class="row "
    :options="buttonsOptions"
    aria-labelledby="basic"
    @change="linkUpdate"
  />

  <component :is="currentCategoryComponent" />
</template>

<script setup>
  import SelectButton from 'primevue/selectbutton';

  import GroupProfileSchedule from '@components/GroupProfile/GroupProfileSchedule.vue';

  import { computed, markRaw, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const router = useRouter();
  const route = useRoute();

  const groupCode = ref(route.query.codeGroup);

  const mapCategoryComponent = {
    'Расписание': markRaw(GroupProfileSchedule),
  };

  const currentCategory = ref(route.query?.category ?? 'Студенты');

  const currentCategoryComponent = computed(() => {
    return mapCategoryComponent[currentCategory.value];
  });

  const buttonsOptions = ref(['Студенты', 'Расписание', 'Учителя', 'Посещаемость']);

  function linkUpdate({ value = undefined }) {
    if (!value) throw new Error('value not found');
    router.replace({ query: { ...route.query, category: value } });
  }
</script>

<style scoped>
.titlePage {
	margin-top: 20px;
}

.row {
	display: flex;
	width: 100%;
	margin-top: 15px;
}

:deep(.p-button-group),
:deep(.p-button) {
  width: 100%;
}
</style>