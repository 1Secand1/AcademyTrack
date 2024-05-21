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
      class="settings__input-search"
      placeholder="Фамилия"
    />
    <InputText
      v-model="studentData.name"
      class="settings__input-search"
      placeholder="Имя"
    />
    <InputText
      v-model="studentData.patronymic"
      class="settings__input-search"
      placeholder="Отчество"
    />
    <InputText
      v-model="studentData.groupCode"
      class="settings__input-search"
      placeholder="Код группы"
    />

    <Button
      label="Изменить"
      @click="studentsService.add(studentData)"
    />
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

import { studentsService } from '@service/apiFunctions'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const studentData = reactive({
	surname: "",
	name: "",
	patronymic: "",
	groupCode: "",
})

const formData = defineModel()

watch(formData, (newFormData) => {
	studentData.surname = newFormData?.surname
	studentData.name = newFormData?.name
	studentData.patronymic = newFormData?.patronymic
	studentData.groupCode = newFormData?.groupCode
})

</script>

<style></style>