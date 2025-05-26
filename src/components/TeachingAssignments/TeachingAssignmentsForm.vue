<template>
  <div class="teaching-assignments-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="teacher">Преподаватель</label>
        <Dropdown
          v-model="selectedTeacher"
          :options="teachers"
          option-label="fullName"
          option-value="teacherId"
          placeholder="Выберите преподавателя"
          class="w-full"
          :class="{ 'p-invalid': !isTeacherValid }"
        />
        <small
          v-if="!isTeacherValid"
          class="p-error"
        >Выберите преподавателя</small>
      </div>

      <div class="form-group">
        <label for="group">Группа</label>
        <Dropdown
          v-model="selectedGroup"
          :options="groups"
          option-label="groupCode"
          option-value="groupId"
          placeholder="Выберите группу"
          class="w-full"
          :class="{ 'p-invalid': !isGroupValid }"
        />
        <small
          v-if="!isGroupValid"
          class="p-error"
        >Выберите группу</small>
      </div>

      <div class="form-group">
        <label for="subject">Предмет</label>
        <Dropdown
          v-model="selectedSubject"
          :options="subjects"
          option-label="name"
          option-value="subjectId"
          placeholder="Выберите предмет"
          class="w-full"
          :class="{ 'p-invalid': !isSubjectValid }"
        />
        <small
          v-if="!isSubjectValid"
          class="p-error"
        >Выберите предмет</small>
      </div>

      <Button
        type="submit"
        label="Назначить"
        :disabled="!isFormValid || disabled"
        class="w-full"
      />
    </form>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useToast } from 'primevue/usetoast';
  import { teachersService } from '@service/api-endpoints/teachers.js';
  import { groupsService } from '@service/api-endpoints/groups.js';
  import { subjectService } from '@service/api-endpoints/subject.js';
  import { teachingAssignmentsService } from '@service/api-endpoints/teaching-assignments.js';
  import Dropdown from 'primevue/dropdown';
  import Button from 'primevue/button';

  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['assignmentCreated']);

  const toast = useToast();

  const teachers = ref([]);
  const groups = ref([]);
  const subjects = ref([]);
  const selectedTeacher = ref(null);
  const selectedGroup = ref(null);
  const selectedSubject = ref(null);
  const selectedSemester = ref(1);

  const isTeacherValid = computed(() => selectedTeacher.value !== null);
  const isGroupValid = computed(() => selectedGroup.value !== null);
  const isSubjectValid = computed(() => selectedSubject.value !== null);
  const isFormValid = computed(() => isTeacherValid.value && isGroupValid.value && isSubjectValid.value);

  const fetchTeachers = async () => {
    try {
      const response = await teachersService.get();
      teachers.value = response.map(teacher => ({
        ...teacher,
        fullName: `${teacher.surname} ${teacher.name} ${teacher.patronymic || ''}`,
      }));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось загрузить список преподавателей',
        life: 3000,
      });
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await groupsService.getAll();
      groups.value = response;
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось загрузить список групп',
        life: 3000,
      });
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await subjectService.get();
      subjects.value = response;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось загрузить список предметов',
        life: 3000,
      });
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid.value) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Заполните все обязательные поля',
        life: 3000,
      });
      return;
    }

    try {
      const assignmentData = {
        teacherId: selectedTeacher.value,
        groupId: selectedGroup.value,
        subjectId: selectedSubject.value,
        semester: selectedSemester.value,
      };

      const response = await teachingAssignmentsService.create(assignmentData);

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Преподаватель успешно назначен',
        life: 3000,
      });

      emit('assignmentCreated', response);

      // Сброс формы
      selectedTeacher.value = null;
      selectedGroup.value = null;
      selectedSubject.value = null;
      selectedSemester.value = 1;
    } catch (error) {
      console.error('Error creating teaching assignment:', error);
      let errorMessage = 'Не удалось назначить преподавателя';

      if (error.response?.status === 409) {
        errorMessage = 'Такое назначение уже существует';
      } else if (error.response?.status === 404) {
        errorMessage = 'Преподаватель, группа или предмет не найдены';
      }

      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 3000,
      });
    }
  };

  onMounted(() => {
    fetchTeachers();
    fetchGroups();
    fetchSubjects();
  });
</script>

<style scoped>
.teaching-assignments-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>