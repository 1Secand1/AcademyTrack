<template>
  <div class="schedule-management">
    <h2>Управление расписанием</h2>
    
    <Card class="filters-card">
      <template #content>
        <div class="filters">
          <div class="filter-group">
            <label>Группа:</label>
            <Dropdown 
              v-model="selectedGroup" 
              :options="groups" 
              option-label="groupCode" 
              option-value="groupId" 
              placeholder="Выберите группу" 
              class="w-full"
              @change="loadGroupSchedule"
            />
          </div>
          
          <div class="filter-group">
            <label>Предмет:</label>
            <Dropdown 
              v-model="selectedSubject" 
              :options="filteredSubjects" 
              option-label="name" 
              option-value="subjectId" 
              placeholder="Выберите предмет" 
              class="w-full"
              @change="loadSubjectSchedule"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card class="schedule-card">
      <template #title>
        <div class="card-header">
          <span>Расписание</span>
          <Button 
            icon="pi pi-plus" 
            label="Добавить занятие" 
            @click="showAddDialog = true"
            :disabled="!canAddLesson"
          />
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="schedule" 
          edit-mode="row" 
          dataKey="id"
          class="p-datatable-sm"
          v-if="schedule.length > 0"
        >
          <Column field="date" header="Дата">
            <template #body="{ data }">
              {{ formatDate(data.date) }}
            </template>
            <template #editor="{ data, field }">
              <Calendar 
                v-model="data[field]" 
                dateFormat="yy-mm-dd"
                :minDate="new Date()"
                showIcon
              />
            </template>
          </Column>
          <Column field="lessonNumber" header="Пара">
            <template #body="{ data }">
              {{ getLessonNumberLabel(data.lessonNumber) }}
            </template>
            <template #editor="{ data, field }">
              <Dropdown
                v-model="data[field]"
                :options="lessonNumbers"
                option-label="label"
                option-value="value"
                placeholder="Выберите пару"
              />
            </template>
          </Column>
          <Column field="subject" header="Предмет">
            <template #body="{ data }">
              {{ data.subject.name }}
            </template>
          </Column>
          <Column field="teacher" header="Преподаватель">
            <template #body="{ data }">
              {{ data.teacher.surname }} {{ data.teacher.name }}
            </template>
          </Column>
          <Column field="actions" header="Действия">
            <template #body="{ data, index }">
              <div class="actions">
                <Button 
                  icon="pi pi-calendar" 
                  class="p-button-rounded p-button-text"
                  @click="openMoveDialog(data, index)"
                />
                <Button 
                  icon="pi pi-trash" 
                  class="p-button-rounded p-button-text p-button-danger"
                  @click="confirmDelete(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
        <div v-else class="no-data">
          <p>Нет данных для отображения</p>
        </div>
      </template>
    </Card>

    <!-- Диалог добавления занятия -->
    <Dialog
      v-model:visible="showAddDialog"
      header="Добавление занятия"
      :modal="true"
      class="add-dialog"
    >
      <div class="p-fluid">
        <div class="p-field">
          <label for="newDate">Дата</label>
          <Calendar
            id="newDate"
            v-model="newLesson.date"
            dateFormat="yy-mm-dd"
            :minDate="new Date()"
            showIcon
          />
        </div>
        <div class="p-field">
          <label for="newLessonNumber">Номер пары</label>
          <Dropdown
            id="newLessonNumber"
            v-model="newLesson.lessonNumber"
            :options="lessonNumbers"
            option-label="label"
            option-value="value"
            placeholder="Выберите пару"
          />
        </div>
        <div class="p-field">
          <label for="teacher">Преподаватель</label>
          <Dropdown
            id="teacher"
            v-model="newLesson.teacherId"
            :options="filteredTeachers"
            option-label="fullName"
            option-value="id"
            placeholder="Выберите преподавателя"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Отмена"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeAddDialog"
        />
        <Button
          label="Добавить"
          icon="pi pi-check"
          @click="addLesson"
        />
      </template>
    </Dialog>

    <!-- Диалог перемещения занятия -->
    <Dialog
      v-model:visible="isMoveDialogVisible"
      header="Перемещение занятия"
      :modal="true"
      class="move-dialog"
    >
      <div class="p-fluid">
        <div class="p-field">
          <label for="moveDate">Новая дата</label>
          <Calendar
            id="moveDate"
            v-model="moveData.newDate"
            dateFormat="yy-mm-dd"
            :minDate="new Date()"
            showIcon
          />
        </div>
        <div class="p-field">
          <label for="moveLessonNumber">Номер пары</label>
          <Dropdown
            id="moveLessonNumber"
            v-model="moveData.newLessonNumber"
            :options="lessonNumbers"
            option-label="label"
            option-value="value"
            placeholder="Выберите пару"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Отмена"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeMoveDialog"
        />
        <Button
          label="Переместить"
          icon="pi pi-check"
          @click="moveLesson"
        />
      </template>
    </Dialog>

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import { groupsService } from '@service/api-endpoints/groups.js';
import { subjectsService } from '@service/api-endpoints/subjects.js';
import { scheduleService } from '@service/api-endpoints/schedule.js';
import { teachingAssignmentsService } from '@service/api-endpoints/teaching-assignments.js';

const toast = useToast();
const confirm = useConfirm();

const groups = ref([]);
const subjects = ref([]);
const teachingAssignments = ref([]);
const schedule = ref([]);
const selectedGroup = ref(null);
const selectedSubject = ref(null);
const isMoveDialogVisible = ref(false);
const showAddDialog = ref(false);

const moveData = ref({
  index: null,
  lesson: null,
  newDate: null,
  newLessonNumber: null
});

const newLesson = ref({
  date: null,
  lessonNumber: null,
  teacherId: null
});

const lessonNumbers = [
  { label: '1 пара', value: 1 },
  { label: '2 пара', value: 2 },
  { label: '3 пара', value: 3 },
  { label: '4 пара', value: 4 },
  { label: '5 пара', value: 5 },
  { label: '6 пара', value: 6 }
];

const filteredSubjects = computed(() => {
  if (!selectedGroup.value || !Array.isArray(subjects.value) || !Array.isArray(teachingAssignments.value)) return [];
  
  const assignmentsForGroup = teachingAssignments.value.filter(a => a.group.groupId === selectedGroup.value);
  const subjectIds = [...new Set(assignmentsForGroup.map(a => a.subject.subjectId))];
  return subjects.value.filter(s => subjectIds.includes(s.subjectId));
});

const filteredTeachers = computed(() => {
  if (!selectedGroup.value || !selectedSubject.value || !Array.isArray(teachingAssignments.value)) return [];
  
  return teachingAssignments.value
    .filter(a => a.group.groupId === selectedGroup.value && a.subject.subjectId === selectedSubject.value)
    .map(a => ({
      id: a.teacher.teacherId,
      fullName: `${a.teacher.surname} ${a.teacher.name}`
    }));
});

const canAddLesson = computed(() => {
  return selectedGroup.value && selectedSubject.value;
});

onMounted(async () => {
  try {
    const [groupsData, subjectsResponse, assignmentsData] = await Promise.all([
      groupsService.getAll(),
      subjectsService.getAll().then(response => response.json()),
      teachingAssignmentsService.get()
    ]);
    
    console.log('Loaded groups:', groupsData);
    console.log('Loaded subjects:', subjectsResponse);
    console.log('Loaded assignments:', assignmentsData);
    
    groups.value = Array.isArray(groupsData) ? groupsData : [];
    subjects.value = Array.isArray(subjectsResponse) ? subjectsResponse : [];
    teachingAssignments.value = Array.isArray(assignmentsData) ? assignmentsData : [];
  } catch (error) {
    console.error('Error loading initial data:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить данные',
      life: 3000
    });
  }
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function getLessonNumberLabel(number) {
  const lesson = lessonNumbers.find(l => l.value === number);
  return lesson ? lesson.label : `Пара ${number}`;
}

async function loadGroupSchedule() {
  if (!selectedGroup.value) return;
  try {
    console.log('Loading schedule for group:', selectedGroup.value);
    const scheduleData = await scheduleService.getGroupSchedule(selectedGroup.value);
    console.log('Loaded schedule:', scheduleData);
    schedule.value = scheduleData.schedule.map(lesson => ({
      ...lesson,
      date: new Date(lesson.date)
    }));
  } catch (error) {
    console.error('Error loading group schedule:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить расписание группы',
      life: 3000
    });
  }
}

async function loadSubjectSchedule() {
  if (!selectedGroup.value || !selectedSubject.value) return;
  try {
    console.log('Filtering schedule for group:', selectedGroup.value, 'and subject:', selectedSubject.value);
    const scheduleData = await scheduleService.getGroupSchedule(selectedGroup.value);
    schedule.value = scheduleData.schedule
      .filter(lesson => lesson.subject.subjectId === selectedSubject.value)
      .map(lesson => ({
        ...lesson,
        date: new Date(lesson.date)
      }));
  } catch (error) {
    console.error('Error filtering schedule:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось отфильтровать расписание',
      life: 3000
    });
  }
}

function openMoveDialog(lesson, index) {
  moveData.value = {
    index,
    lesson,
    newDate: new Date(lesson.date),
    newLessonNumber: lesson.lessonNumber
  };
  isMoveDialogVisible.value = true;
}

function closeMoveDialog() {
  isMoveDialogVisible.value = false;
  moveData.value = {
    index: null,
    lesson: null,
    newDate: null,
    newLessonNumber: null
  };
}

function confirmDelete(lesson) {
  confirm.require({
    message: 'Вы уверены, что хотите удалить это занятие?',
    header: 'Подтверждение удаления',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteLesson(lesson)
  });
}

async function deleteLesson(lesson) {
  try {
    await scheduleService.delete(lesson.id);
    schedule.value = schedule.value.filter(l => l.id !== lesson.id);
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Занятие успешно удалено',
      life: 3000
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось удалить занятие',
      life: 3000
    });
  }
}

function closeAddDialog() {
  showAddDialog.value = false;
  newLesson.value = {
    date: null,
    lessonNumber: null,
    teacherId: null
  };
}

async function addLesson() {
  if (!newLesson.value.date || !newLesson.value.lessonNumber || !newLesson.value.teacherId) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Заполните все поля',
      life: 3000
    });
    return;
  }

  try {
    const assignment = teachingAssignments.value.find(a => 
      a.group.groupId === selectedGroup.value && 
      a.subject.subjectId === selectedSubject.value &&
      a.teacher.teacherId === newLesson.value.teacherId
    );

    if (!assignment) {
      throw new Error('Teaching assignment not found');
    }

    const lessonData = {
      date: new Date(newLesson.value.date).toISOString().slice(0, 10),
      lessonNumber: newLesson.value.lessonNumber,
      teacherGroupSubjectId: assignment.id
    };

    const newLessonData = await scheduleService.create(lessonData);
    schedule.value.push(newLessonData);
    
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Занятие успешно добавлено',
      life: 3000
    });
    
    closeAddDialog();
  } catch (error) {
    console.error('Error adding lesson:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось добавить занятие',
      life: 3000
    });
  }
}

async function moveLesson() {
  if (!moveData.value.newDate || !moveData.value.newLessonNumber) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Заполните все поля',
      life: 3000
    });
    return;
  }

  try {
    const newDate = new Date(moveData.value.newDate).toISOString().slice(0, 10);
    
    // Проверяем, не пересекается ли новое время с существующими занятиями
    const hasConflict = schedule.value.some(lesson => 
      lesson.id !== moveData.value.lesson.id &&
      lesson.date === newDate &&
      lesson.lessonNumber === moveData.value.newLessonNumber
    );

    if (hasConflict) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'В это время уже есть занятие',
        life: 3000
      });
      return;
    }

    const updatedLesson = await scheduleService.update(moveData.value.lesson.id, {
      date: newDate,
      lessonNumber: moveData.value.newLessonNumber
    });

    schedule.value = schedule.value.map(lesson => 
      lesson.id === updatedLesson.id ? updatedLesson : lesson
    );

    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Занятие успешно перемещено',
      life: 3000
    });

    closeMoveDialog();
  } catch (error) {
    console.error('Error moving lesson:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось переместить занятие',
      life: 3000
    });
  }
}
</script>

<style scoped>
.schedule-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.filters-card {
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 20px;
}

.filter-group {
  flex: 1;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
}

.schedule-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 8px;
}

.add-dialog,
.move-dialog {
  min-width: 450px;
}

.p-field {
  margin-bottom: 1rem;
}

.p-field label {
  display: block;
  margin-bottom: 0.5rem;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: var(--text-color-secondary);
}
</style> 