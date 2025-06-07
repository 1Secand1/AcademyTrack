<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="header-content">
        <div class="header-main">
          <h2 class="titlePage">
            Профиль группы
          </h2>
          <div
            v-if="groupDetails"
            class="group-info"
          >
            <div class="group-code">
              <i class="pi pi-users" />
              {{ groupDetails.groupCode }}
            </div>
            <div class="group-details">
              <div class="course">
                <i class="pi pi-calendar" />
                {{ groupDetails.yearOfEntry }} г. поступления
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="groupDetails"
          class="profile-stats"
        >
          <div class="stat-item">
            <i class="pi pi-users" />
            <div class="stat-content">
              <span class="stat-value">{{ groupDetails.students?.length || 0 }}</span>
              <span class="stat-label">студентов</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="tabs-container">
        <SelectButton
          v-model="currentCategory"
          class="category-selector"
          :options="buttonsOptions"
          aria-labelledby="basic"
        />
      </div>
      <div class="category-content">
        <transition
          name="fade"
          mode="out-in"
        >
          <component
            :is="currentCategoryComponent"
            v-if="currentCategoryComponent && groupDetails"
            :group-details="groupDetails"
          />
        </transition>
        <div
          v-if="!groupDetails && !isLoading"
          class="no-data"
        >
          <i
            class="pi pi-exclamation-circle"
            style="font-size: 2rem"
          />
          <p>Данные о группе не найдены</p>
        </div>
        <div
          v-if="isLoading"
          class="loading-overlay"
        >
          <ProgressSpinner />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import SelectButton from 'primevue/selectbutton';
  import ProgressSpinner from 'primevue/progressspinner';
  import GroupProfileSchedule from '@components/GroupProfile/GroupProfileSchedule.vue';
  import GroupProfileStudents from '@components/GroupProfile/GroupProfileStudents.vue';
  import GroupProfileTeachers from '@components/GroupProfile/GroupProfileTeachers.vue';
  import GroupProfileAttendance from '@components/GroupProfile/GroupProfileAttendance.vue';
  import { computed, markRaw, ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { groupsService } from '@service/api-endpoints/groups.js';
  import { useToast } from 'primevue/usetoast';

  const route = useRoute();
  const groupId = ref(route.params.groupId);
  const groupDetails = ref({
    id: null,
    groupCode: '',
    yearOfEntry: '',
    students: [],
    teachers: [],
    schedule: [],
  });
  const isLoading = ref(false);
  const toast = useToast();

  const mapCategoryComponent = {
    'Студенты': markRaw(GroupProfileStudents),
    'Расписание': markRaw(GroupProfileSchedule),
    'Учителя': markRaw(GroupProfileTeachers),
    'Посещаемость': markRaw(GroupProfileAttendance),
  };

  const currentCategory = ref(route.query?.category ?? 'Студенты');
  const currentCategoryComponent = computed(() => {
    if (!currentCategory.value || !mapCategoryComponent[currentCategory.value]) {
      return markRaw(GroupProfileStudents);
    }
    return mapCategoryComponent[currentCategory.value];
  });
  const buttonsOptions = ref(['Студенты', 'Расписание', 'Учителя', 'Посещаемость']);

  const loadGroupDetails = async () => {
    try {
      isLoading.value = true;
      const response = await groupsService.getDetails(groupId.value);
      groupDetails.value = processGroupDetails(response);
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load group details',
        life: 3000,
      });
    } finally {
      isLoading.value = false;
    }
  };

  const processGroupDetails = (data) => {
    if (!data) return null;
    return {
      ...data,
      students: data.students || [],
      teachers: data.teachers || [],
      subjects: data.subjects || [],
      schedule: data.schedule || [],
    };
  };

  onMounted(async () => {
    if (groupId.value) {
      await loadGroupDetails();
    }
  });
</script>

<style scoped>
.profile-container {
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  margin-bottom: 30px;
}

.header-content {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-main {
  margin-bottom: 24px;
}

.titlePage {
  font-size: 24px;
  color: var(--text-color);
  margin: 0 0 16px 0;
  padding: 0;
}

.group-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-code {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-code i {
  font-size: 1.2rem;
}

.group-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text-color-secondary);
}

.subject, .specialty, .course {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.subject i, .specialty i, .course i {
  font-size: 1rem;
  color: var(--primary-color);
}

.profile-stats {
  display: flex;
  gap: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--surface-border);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-item i {
  font-size: 1.5rem;
  color: var(--primary-color);
  background: var(--primary-50);
  padding: 12px;
  border-radius: 12px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin-top: 4px;
}

.profile-content {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tabs-container {
  margin-bottom: 24px;
}

.category-selector {
  width: 100%;
}

.category-selector :deep(.p-selectbutton) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-selector :deep(.p-button) {
  flex: 1;
  min-width: 120px;
  white-space: nowrap;
}

.category-content {
  position: relative;
  min-height: 200px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 0;
  color: var(--text-color-secondary);
}

.no-data i {
  color: var(--text-color-secondary);
}

/* Адаптивные стили */
@media (max-width: 768px) {
  .profile-container {
    padding: 12px;
  }

  .header-content {
    padding: 16px;
  }

  .titlePage {
    font-size: 20px;
  }

  .group-code {
    font-size: 18px;
  }

  .profile-stats {
    flex-direction: column;
    gap: 16px;
  }

  .stat-item {
    width: 100%;
  }

  .profile-content {
    padding: 16px;
  }

  .category-selector :deep(.p-selectbutton) {
    flex-direction: column;
  }

  .category-selector :deep(.p-button) {
    width: 100%;
  }

  /* Стили для таблиц на мобильных устройствах */
  :deep(.p-datatable) {
    font-size: 14px;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th) {
    padding: 0.5rem;
  }

  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.5rem;
  }

  /* Стили для карточек на мобильных устройствах */
  :deep(.student-card),
  :deep(.teacher-card),
  :deep(.schedule-card) {
    width: 100%;
  }

  /* Стили для графиков на мобильных устройствах */
  :deep(.chart-container) {
    height: 250px !important;
  }
}

/* Дополнительные стили для очень маленьких экранов */
@media (max-width: 480px) {
  .profile-container {
    padding: 8px;
  }

  .header-content {
    padding: 12px;
  }

  .titlePage {
    font-size: 18px;
  }

  .group-code {
    font-size: 16px;
  }

  .stat-value {
    font-size: 18px;
  }

  .stat-label {
    font-size: 12px;
  }

  .profile-content {
    padding: 12px;
  }
}
</style>