<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="header-content">
        <div class="header-main">
          <h2 class="titlePage">Профиль группы</h2>
          <div class="group-info" v-if="groupDetails">
            <div class="group-code">
              <i class="pi pi-users"></i>
              {{ groupDetails.groupCode }}
            </div>
            <div class="group-details">
              <div class="course">
                <i class="pi pi-calendar"></i>
                {{ groupDetails.yearOfEntry }} г. поступления
              </div>
            </div>
          </div>
        </div>
        <div class="profile-stats" v-if="groupDetails">
          <div class="stat-item">
            <i class="pi pi-users"></i>
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
        <transition name="fade" mode="out-in">
          <component
            :is="currentCategoryComponent"
            v-if="currentCategoryComponent && groupDetails"
            :group-details="groupDetails"
          />
        </transition>
        <div v-if="!groupDetails && !isLoading" class="no-data">
          <i class="pi pi-exclamation-circle" style="font-size: 2rem"></i>
          <p>Данные о группе не найдены</p>
        </div>
        <div class="loading-overlay" v-if="isLoading">
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
  schedule: []
});
const isLoading = ref(false);
const toast = useToast();

console.log('GroupProfilePage: groupId from route', groupId.value);

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

onMounted(async () => {
  if (groupId.value) {
    isLoading.value = true;
    try {
      console.log('Fetching group details for ID:', groupId.value);
      
      // Используем новый метод для получения детальной информации о группе
      const groupDetailsData = await groupsService.getDetails(groupId.value);
      
      console.log('Group details received:', groupDetailsData);
      
      if (!groupDetailsData) {
        console.error('No data received from the server');
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось получить данные о группе',
          life: 3000
        });
        return;
      }

      // Обрабатываем данные в соответствии с новым форматом
      const processedResult = {
        id: groupDetailsData.id || null,
        groupCode: groupDetailsData.code || '',
        yearOfEntry: groupDetailsData.yearOfEntry || '',
        students: Array.isArray(groupDetailsData.students) ? groupDetailsData.students.map(student => ({
          id: student.id,
          fullName: student.fullName || '',
          attendance: groupDetailsData.attendanceStats || {},
          percentage: groupDetailsData.attendanceStats?.average || 0
        })) : [],
        teachers: Array.isArray(groupDetailsData.teachers) ? groupDetailsData.teachers.map(teacher => ({
          id: teacher.id,
          fullName: teacher.fullName || '',
          subjects: teacher.subjects || []
        })) : [],
        schedule: Array.isArray(groupDetailsData.teachingAssignments) ? groupDetailsData.teachingAssignments : []
      };
      
      groupDetails.value = processedResult;
      console.log('Processed group details:', groupDetails.value);
    } catch (error) {
      console.error('Ошибка при загрузке данных о группе:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось загрузить данные о группе',
        life: 3000
      });
    } finally {
      isLoading.value = false;
    }
  }
});

// Добавляем watch для отслеживания изменений
watch([currentCategory, groupDetails], ([newCategory, newDetails]) => {
  console.log('Category changed:', newCategory);
  console.log('Group details changed:', newDetails);
  console.log('Component should be visible:', currentCategoryComponent.value && newDetails && newDetails.id);
}, { immediate: true });
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
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
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.tabs-container {
  margin-bottom: 24px;
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1px;
}

.category-selector {
  display: flex;
  background: transparent;
  border: none;
  padding: 0;
}

.category-content {
  min-height: 400px;
  position: relative;
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
  z-index: 1000;
}

/* Стили для табов */
:deep(.p-selectbutton) {
  display: flex;
  background: transparent;
  border: none;
  padding: 0;
}

:deep(.p-selectbutton .p-button) {
  flex: 1;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 16px 24px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color-secondary);
  transition: all 0.2s ease;
  position: relative;
  margin: 0;
}

:deep(.p-selectbutton .p-button:not(.p-highlight):hover) {
  background: var(--surface-hover);
  color: var(--text-color);
}

:deep(.p-selectbutton .p-button.p-highlight) {
  background: transparent;
  color: var(--primary-color);
  font-weight: 600;
}

:deep(.p-selectbutton .p-button.p-highlight::after) {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  border-radius: 2px 2px 0 0;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
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

  .profile-stats {
    flex-direction: column;
    gap: 12px;
  }

  .stat-item {
    padding: 6px 0;
  }

  :deep(.p-selectbutton .p-button) {
    padding: 10px 14px;
    font-size: 13px;
  }
}

.no-data {
  text-align: center;
  padding: 40px;
  color: var(--text-color-secondary);
}

.no-data i {
  margin-bottom: 16px;
  color: var(--primary-color);
}

.no-data p {
  font-size: 1.1rem;
  margin: 0;
}
</style>