<template>
  <div class="teachers-container">
    <div class="teachers-header">
      <h3>Преподаватели группы</h3>
      <div class="teachers-actions">
        <div class="search-container">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              placeholder="Поиск преподавателей..."
              class="search-input"
            />
          </span>
        </div>
        <div class="filters">
          <Dropdown
            v-model="selectedFilter"
            :options="filterOptions"
            placeholder="Фильтр"
            class="filter-dropdown"
          />
        </div>
        <Button
          icon="pi pi-download"
          label="Экспорт"
          class="export-button"
          @click="exportData"
        />
      </div>
    </div>

    <div class="teachers-grid">
      <div
        v-for="teacher in filteredTeachers"
        :key="teacher.id"
        class="teacher-card"
      >
        <div class="teacher-card__avatar">
          <i
            class="pi pi-user"
            style="font-size: 1.5rem"
          />
        </div>
        <div class="teacher-card__content">
          <div class="teacher-card__header">
            <div class="teacher-card__name">
              {{ teacher.fullName }}
            </div>
            <div class="teacher-card__role">
              <i
                class="pi pi-briefcase"
                style="font-size: 0.9rem"
              />
              {{ teacher.role }}
            </div>
          </div>
          <div class="teacher-card__subjects">
            <div class="subjects-header">
              <i
                class="pi pi-book"
                style="font-size: 0.9rem"
              />
              <span>Предметы:</span>
            </div>
            <div class="subjects-list">
              <div
                v-for="subject in getGroupSubjects(teacher)"
                :key="subject.id"
                class="subject-tag"
              >
                {{ subject.name }}
              </div>
            </div>
          </div>
          <div class="teacher-card__actions">
            <Button
              v-tooltip.top="'Связаться'"
              icon="pi pi-envelope"
              class="p-button-rounded p-button-text"
              @click="contactTeacher(teacher)"
            />
            <Button
              v-tooltip.top="'Расписание'"
              icon="pi pi-calendar"
              class="p-button-rounded p-button-text"
              @click="viewTeacherSchedule(teacher)"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="filteredTeachers.length === 0"
      class="no-results"
    >
      <i
        class="pi pi-search"
        style="font-size: 2rem"
      />
      <p>Преподаватели не найдены</p>
    </div>

    <Toast />
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import Dropdown from 'primevue/dropdown';
  import Toast from 'primevue/toast';
  import { useToast } from 'primevue/usetoast';
  import { exportService } from '@service/exportService';
  import { useRouter } from 'vue-router';

  const props = defineProps({
    groupDetails: { type: Object, required: true },
  });

  const emit = defineEmits(['update:stats']);

  const toast = useToast();
  const router = useRouter();
  const searchQuery = ref('');
  const selectedFilter = ref('all');

  const filterOptions = [
    { label: 'Все преподаватели', value: 'all' },
    { label: 'Основные преподаватели', value: 'main' },
    { label: 'Ассистенты', value: 'assistant' },
  ];

  const teachers = computed(() => {
    return props.groupDetails.teachers || [];
  });

  const filteredTeachers = computed(() => {
    let result = teachers.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(teacher =>
        teacher.fullName.toLowerCase().includes(query),
      );
    }

    if (selectedFilter.value !== 'all') {
      result = result.filter(teacher =>
        teacher.role.toLowerCase() === selectedFilter.value,
      );
    }

    return result;
  });

  const getGroupSubjects = (teacher) => {
    if (!teacher.subjects || !props.groupDetails.subjects) {
      return [];
    }

    const groupSubjects = teacher.subjects.filter(teacherSubject =>
      props.groupDetails.subjects.some(groupSubject =>
        groupSubject.id === teacherSubject.id,
      ),
    );

    return groupSubjects;
  };

  const contactTeacher = (teacher) => {
    toast.add({
      severity: 'info',
      summary: 'Связь с преподавателем',
      detail: `Функция связи с ${teacher.fullName} будет реализована позже`,
      life: 3000,
    });
  };

  const viewTeacherSchedule = (teacher) => {
    router.push({
      name: 'teacherSchedule',
      params: { teacherId: teacher.id },
    });
  };

  async function exportData() {
    try {
      if (!filteredTeachers.value.length) {
        toast.add({
          severity: 'warn',
          summary: 'Предупреждение',
          detail: 'Нет данных для экспорта',
          life: 3000,
        });
        return;
      }
      const data = filteredTeachers.value.map(teacher => ({
        'ФИО': teacher.fullName,
        'Предметы': getGroupSubjects(teacher).map(s => s.name).join(', '),
        'Роль': teacher.role,
      }));
      const filename = exportService.generateFilename('teachers', props.groupDetails.id);
      await exportService.exportToExcel(data, filename, {
        sheetName: 'Преподаватели',
        headers: ['ФИО', 'Предметы', 'Роль'],
      });
      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Данные экспортированы',
        life: 3000,
      });
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: error.message || 'Не удалось экспортировать данные',
        life: 3000,
      });
    }
  }

  watch(() => props.groupDetails.teachers, (newVal) => {
    emit('update:stats', { teachersCount: newVal?.length || 0 });
  }, { immediate: true });
</script>

<style scoped>
.teachers-container {
  padding: 20px 0;
}

.teachers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.teachers-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.teachers-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-container {
  width: 300px;
}

.search-input {
  width: 100%;
}

.filter-dropdown {
  width: 200px;
}

.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.teacher-card {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  transition: all 0.3s ease;
  border: 1px solid var(--surface-border);
  position: relative;
  overflow: hidden;
}

.teacher-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.teacher-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-50);
  color: var(--primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.teacher-card__content {
  flex: 1;
  min-width: 0;
}

.teacher-card__header {
  margin-bottom: 12px;
}

.teacher-card__name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
}

.teacher-card__role {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.teacher-card__subjects {
  margin-bottom: 16px;
}

.subjects-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.subjects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.subject-tag {
  background: var(--primary-50);
  color: var(--primary-700);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.teacher-card__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: var(--text-color-secondary);
  background: var(--surface-card);
  border-radius: 12px;
  margin-top: 20px;
}

.no-results i {
  margin-bottom: 16px;
  color: var(--primary-400);
}

@media (max-width: 768px) {
  .teachers-header {
    flex-direction: column;
    gap: 12px;
  }

  .teachers-actions {
    flex-direction: column;
    width: 100%;
  }

  .search-container,
  .filter-dropdown {
    width: 100%;
  }

  .export-button {
    width: 100%;
  }

  .teachers-grid {
    grid-template-columns: 1fr;
  }

  .teacher-card {
    padding: 12px;
  }
}
</style>