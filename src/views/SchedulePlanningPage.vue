<template>
  <div class="schedule-planning">
    <h2>Планирование расписания</h2>
    <div class="stepper">
      <div
        v-for="(step, idx) in steps"
        :key="step.label"
        :class="['step', {active: currentStep === idx}]"
      >
        <span class="step-number">{{ idx + 1 }}</span> {{ step.label }}
      </div>
    </div>
    <Card
      v-if="currentStep === 0"
      class="step-card"
    >
      <template #title>
        Выбор группы и предмета
      </template>
      <template #content>
        <div class="form-block">
          <label class="form-label">Группа</label>
          <Dropdown
            v-model="selectedGroup"
            :options="groups"
            option-label="groupCode"
            option-value="groupId"
            placeholder="Выберите группу"
            class="w-full"
          />
        </div>
        <div class="form-block">
          <label class="form-label">Предмет</label>
          <Dropdown
            v-model="selectedSubject"
            :options="filteredSubjects"
            option-label="name"
            option-value="subjectId"
            placeholder="Выберите предмет"
            class="w-full"
          />
        </div>
        <div
          v-if="filteredAssignments.length > 1"
          class="form-block"
        >
          <label class="form-label">Преподаватель</label>
          <Dropdown
            v-model="selectedAssignment"
            :options="filteredAssignments"
            option-label="teacher.surname"
            option-value="teachingAssignmentId"
            placeholder="Выберите преподавателя"
            class="w-full"
          />
        </div>
        <div
          v-else-if="filteredAssignments.length === 1"
          class="form-block"
        >
          <label class="form-label">Преподаватель</label>
          <div class="selected-teacher">
            {{ filteredAssignments[0].teacher.surname }} {{ filteredAssignments[0].teacher.name }}
          </div>
        </div>
        <div class="step-actions">
          <Button
            label="Далее"
            :disabled="!canSelectAssignment"
            class="w-full"
            @click="nextStep"
          />
        </div>
      </template>
    </Card>

    <Card
      v-if="currentStep === 1"
      class="step-card"
    >
      <template #title>
        Параметры генерации
      </template>
      <template #content>
        <div class="form-block">
          <label class="form-label">Дни недели:</label>
          <div class="weekdays">
            <div
              v-for="(day, idx) in weekdays"
              :key="day.value"
              class="weekday-item"
            >
              <Checkbox
                v-model="selectedWeekdays"
                :input-id="String(day.value)"
                :value="day.value"
                class="weekday-checkbox"
              />
              <label
                :for="String(day.value)"
                class="weekday-label"
              >{{ day.label }}</label>
            </div>
          </div>
        </div>
        <div class="form-block">
          <label class="form-label">С какой даты:</label>
          <Calendar
            v-model="dateFrom"
            placeholder="С"
            class="w-full"
            :show-icon="true"
            date-format="dd.mm.yy"
          />
        </div>
        <div class="form-block">
          <label class="form-label">По какую дату:</label>
          <Calendar
            v-model="dateTo"
            placeholder="По"
            class="w-full"
            :show-icon="true"
            date-format="dd.mm.yy"
          />
        </div>
        <div class="form-block">
          <label class="form-label">Пары:</label>
          <Dropdown
            v-model="selectedLessonNumbers"
            :options="lessonNumbers"
            option-label="label"
            option-value="value"
            placeholder="Выберите пары"
            multiple
            class="w-full"
          />
        </div>
        <div class="step-actions">
          <Button
            label="Назад"
            class="p-button-text w-full"
            @click="prevStep"
          />
          <Button
            label="Далее"
            :disabled="!canGenerate"
            class="w-full"
            @click="nextStep"
          />
        </div>
      </template>
    </Card>

    <Card
      v-if="currentStep === 2"
      class="step-card"
    >
      <template #title>
        Исключения
      </template>
      <template #content>
        <div class="form-block">
          <label>Исключить даты:</label>
          <Calendar
            v-model="excludeDates"
            selection-mode="multiple"
            placeholder="Выберите даты"
          />
          <Button
            label="Добавить"
            :disabled="!excludeDates.length"
            @click="addExcludeDates"
          />
          <div class="excluded-list">
            <span
              v-for="(date, idx) in excludedDates"
              :key="date"
            >
              {{ date }} <Button
                icon="pi pi-times"
                text
                @click="removeExcludeDate(idx)"
              />
            </span>
          </div>
        </div>
        <div class="step-actions">
          <Button
            label="Назад"
            class="p-button-text"
            @click="prevStep"
          />
          <Button
            label="Далее"
            :disabled="!canGenerate"
            @click="generateLessonsAndNext"
          />
        </div>
      </template>
    </Card>

    <Card
      v-if="currentStep === 3"
      class="step-card"
    >
      <template #title>
        Итоговое расписание
      </template>
      <template #content>
        <!-- Десктопная версия -->
        <DataTable
          v-if="!isMobile"
          :value="lessons"
          edit-mode="row"
          data-key="date"
          class="mb-2"
        >
          <Column
            field="date"
            header="Дата"
          >
            <template #editor="{ data, field }">
              <Calendar
                v-model="data[field]"
                date-format="yy-mm-dd"
                :min-date="new Date()"
                show-icon
              />
            </template>
          </Column>
          <Column
            field="lessonNumber"
            header="Пара"
            :editor="lessonNumberEditor"
          />
          <Column
            field="actions"
            header="Действия"
          >
            <template #body="{ data, index }">
              <div class="actions">
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text p-button-danger"
                  @click="confirmDeleteLesson(data, index)"
                />
                <Button
                  icon="pi pi-calendar"
                  class="p-button-rounded p-button-text"
                  @click="openMoveDialog(data, index)"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <!-- Мобильная версия -->
        <div
          v-else
          class="lessons-list"
        >
          <div
            v-for="(lesson, index) in lessons"
            :key="index"
            class="lesson-card"
          >
            <div class="lesson-card__header">
              <div class="lesson-card__date">
                <Calendar
                  v-model="lesson.date"
                  date-format="yy-mm-dd"
                  :min-date="new Date()"
                  show-icon
                  class="lesson-card__calendar"
                />
              </div>
              <div class="lesson-card__number">
                <Dropdown
                  v-model="lesson.lessonNumber"
                  :options="lessonNumbers"
                  option-label="label"
                  option-value="value"
                  class="lesson-card__dropdown"
                />
              </div>
            </div>
            <div class="lesson-card__actions">
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text p-button-danger"
                @click="confirmDeleteLesson(lesson, index)"
              />
              <Button
                icon="pi pi-calendar"
                class="p-button-rounded p-button-text"
                @click="openMoveDialog(lesson, index)"
              />
            </div>
          </div>
        </div>

        <div class="step-actions">
          <Button
            label="Назад"
            class="p-button-text"
            @click="prevStep"
          />
          <Button
            label="Сохранить расписание"
            :disabled="!lessons.length"
            @click="saveSchedule"
          />
          <Button
            label="Очистить всё"
            class="p-button-danger"
            @click="clearAll"
          />
        </div>
      </template>
    </Card>

    <!-- Диалог перемещения занятия -->
    <Dialog
      v-model:visible="isMoveDialogVisible"
      header="Перемещение занятия"
      :modal="true"
      class="move-dialog"
      :style="{ width: isMobile ? '90vw' : '450px' }"
    >
      <div class="p-fluid">
        <div class="p-field">
          <label for="newDate">Новая дата</label>
          <Calendar
            id="newDate"
            v-model="moveData.newDate"
            date-format="yy-mm-dd"
            :min-date="new Date()"
            show-icon
            class="w-full"
          />
        </div>
        <div class="p-field">
          <label for="newLessonNumber">Номер пары</label>
          <Dropdown
            id="newLessonNumber"
            v-model="moveData.newLessonNumber"
            :options="lessonNumbers"
            option-label="label"
            option-value="value"
            placeholder="Выберите пару"
            class="w-full"
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
  import { ref, onMounted, computed, h } from 'vue';
  import { teachingAssignmentsService } from '@service/api-endpoints/teaching-assignments.js';
  import { scheduleService } from '@service/api-endpoints/schedule.js';
  import { groupsService } from '@service/api-endpoints/groups.js';
  import { subjectService } from '@service/api-endpoints/subject.js';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import Checkbox from 'primevue/checkbox';
  import Calendar from 'primevue/calendar';
  import Card from 'primevue/card';
  import InputText from 'primevue/inputtext';
  import Toast from 'primevue/toast';
  import Dropdown from 'primevue/dropdown';
  import { useToast } from 'primevue/usetoast';
  import { useConfirm } from 'primevue/useconfirm';

  const toast = useToast();
  const confirm = useConfirm();
  const steps = [
    { label: 'Назначение' },
    { label: 'Параметры' },
    { label: 'Исключения' },
    { label: 'Расписание' },
  ];
  const currentStep = ref(0);

  const groups = ref([]);
  const subjects = ref([]);
  const teachingAssignments = ref([]);
  const selectedGroup = ref(null);
  const selectedSubject = ref(null);
  const selectedAssignment = ref(null);

  const filteredSubjects = computed(() => {
    if (!selectedGroup.value) return [];
    const assignmentsForGroup = teachingAssignments.value.filter(a => a.group.groupId === selectedGroup.value);
    const subjectIds = [...new Set(assignmentsForGroup.map(a => a.subject.subjectId))];
    return subjects.value.filter(s => subjectIds.includes(s.subjectId));
  });

  const filteredAssignments = computed(() => {
    if (!selectedGroup.value || !selectedSubject.value) return [];

    console.log(teachingAssignments.value);
    return teachingAssignments.value.filter(a =>
      a.group.groupId === selectedGroup.value && a.subject.subjectId === selectedSubject.value,
    );
  });

  const canSelectAssignment = computed(() => {
    if (!selectedGroup.value || !selectedSubject.value) return false;
    if (filteredAssignments.value.length === 1) {
      selectedAssignment.value = filteredAssignments.value[0];
      return true;
    }
    return !!selectedAssignment.value;
  });

  const weekdays = [
    { label: 'Пн', value: 1 },
    { label: 'Вт', value: 2 },
    { label: 'Ср', value: 3 },
    { label: 'Чт', value: 4 },
    { label: 'Пт', value: 5 },
    { label: 'Сб', value: 6 },
  ];
  const selectedWeekdays = ref([]);
  const dateFrom = ref(null);
  const dateTo = ref(null);
  const lessonNumbers = [
    { label: '1 пара', value: 1 },
    { label: '2 пара', value: 2 },
    { label: '3 пара', value: 3 },
    { label: '4 пара', value: 4 },
    { label: '5 пара', value: 5 },
    { label: '6 пара', value: 6 },
  ];
  const selectedLessonNumbers = ref([]);
  const excludeDates = ref([]);
  const excludedDates = ref([]);
  const lessons = ref([]);

  const canGenerate = computed(() => {
    const lessonNumbersArr = Array.isArray(selectedLessonNumbers.value)
      ? selectedLessonNumbers.value
      : selectedLessonNumbers.value != null
        ? [selectedLessonNumbers.value]
        : [];
    return selectedAssignment.value &&
      selectedWeekdays.value.length > 0 &&
      dateFrom.value &&
      dateTo.value &&
      lessonNumbersArr.length > 0 &&
      dateFrom.value <= dateTo.value;
  });

  const isMoveDialogVisible = ref(false);
  const moveData = ref({
    index: null,
    lesson: null,
    newDate: null,
    newLessonNumber: null,
  });

  // Добавляем определение мобильного устройства
  const isMobile = ref(window.innerWidth <= 768);

  // Добавляем слушатель изменения размера окна
  onMounted(() => {
    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 768;
    });
  });

  onMounted(async () => {
    try {
      const [groupsData, subjectsData, assignmentsData] = await Promise.all([
        groupsService.getAll(),
        subjectService.get(),
        teachingAssignmentsService.get(),
      ]);

      groups.value = groupsData;
      subjects.value = subjectsData;
      teachingAssignments.value = assignmentsData;
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось загрузить данные',
        life: 3000,
      });
    }
  });

  function nextStep() {
    if (currentStep.value < steps.length - 1) currentStep.value++;
  }
  function prevStep() {
    if (currentStep.value > 0) currentStep.value--;
  }
  function clearAll() {
    lessons.value = [];
    selectedWeekdays.value = [];
    dateFrom.value = null;
    dateTo.value = null;
    selectedLessonNumbers.value = [];
    excludedDates.value = [];
    excludeDates.value = [];
    currentStep.value = 0;
    selectedGroup.value = null;
    selectedSubject.value = null;
    selectedAssignment.value = null;
  }

  function addExcludeDates() {
    excludeDates.value.forEach(date => {
      const dateStr = new Date(date).toISOString().slice(0, 10);
      if (!excludedDates.value.includes(dateStr)) {
        excludedDates.value.push(dateStr);
      }
    });
    excludeDates.value = [];
  }
  function removeExcludeDate(idx) {
    excludedDates.value.splice(idx, 1);
  }

  function generateLessonsAndNext() {
    generateLessons();
    nextStep();
  }

  function generateLessons() {
    if (!canGenerate.value) return;
    const startDate = new Date(dateFrom.value);
    const endDate = new Date(dateTo.value);
    const days = [];
    const lessonNumbersArr = Array.isArray(selectedLessonNumbers.value)
      ? selectedLessonNumbers.value
      : selectedLessonNumbers.value != null
        ? [selectedLessonNumbers.value]
        : [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const weekday = d.getDay();
      if (selectedWeekdays.value.includes(weekday === 0 ? 7 : weekday)) {
        const dateStr = d.toISOString().slice(0, 10);
        if (!excludedDates.value.includes(dateStr)) {
          lessonNumbersArr.forEach(ln => {
            days.push({ date: dateStr, lessonNumber: ln });
          });
        }
      }
    }
    lessons.value = days;
  }

  function lessonNumberEditor(slotProps) {
    return h('input', {
      type: 'number',
      min: 1,
      value: slotProps.data.lessonNumber,
      onInput: e => slotProps.data.lessonNumber = parseInt(e.target.value) || 1,
    });
  }

  function confirmDeleteLesson(lesson, index) {
    confirm.require({
      message: 'Вы уверены, что хотите удалить это занятие?',
      header: 'Подтверждение удаления',
      icon: 'pi pi-exclamation-triangle',
      accept: () => removeLesson(index),
    });
  }

  function openMoveDialog(lesson, index) {
    moveData.value = {
      index,
      lesson,
      newDate: new Date(lesson.date),
      newLessonNumber: lesson.lessonNumber,
    };
    isMoveDialogVisible.value = true;
  }

  function closeMoveDialog() {
    isMoveDialogVisible.value = false;
    moveData.value = {
      index: null,
      lesson: null,
      newDate: null,
      newLessonNumber: null,
    };
  }

  function moveLesson() {
    if (!moveData.value.newDate || !moveData.value.newLessonNumber) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Заполните все поля',
        life: 3000,
      });
      return;
    }

    const newDate = new Date(moveData.value.newDate).toISOString().slice(0, 10);

    // Проверяем, не пересекается ли новое время с существующими занятиями
    const hasConflict = lessons.value.some((lesson, index) =>
      index !== moveData.value.index &&
      lesson.date === newDate &&
      lesson.lessonNumber === moveData.value.newLessonNumber,
    );

    if (hasConflict) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'В это время уже есть занятие',
        life: 3000,
      });
      return;
    }

    // Обновляем занятие
    lessons.value[moveData.value.index] = {
      ...moveData.value.lesson,
      date: newDate,
      lessonNumber: moveData.value.newLessonNumber,
    };

    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Занятие успешно перемещено',
      life: 3000,
    });

    closeMoveDialog();
  }

  function removeLesson(idx) {
    lessons.value.splice(idx, 1);
  }

  async function saveSchedule() {
    if (!selectedAssignment.value) return;
    try {
      for (const lesson of lessons.value) {
        await scheduleService.create({
          lessonNumber: lesson.lessonNumber,
          date: lesson.date,
          teacherGroupSubjectId: selectedAssignment.value.teachingAssignmentId,
        });
      }
      toast.add({ severity: 'success', summary: 'Успех', detail: 'Расписание успешно сохранено', life: 3000 });
      lessons.value = [];
      currentStep.value = 0;
      selectedGroup.value = null;
      selectedSubject.value = null;
      selectedAssignment.value = null;
    } catch (e) {
      toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сохранить расписание', life: 4000 });
    }
  }

  async function loadGroupDetails(groupId) {
    try {
      const group = await groupsService.getById(groupId);
    // ... rest of the function
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось загрузить информацию о группе',
        life: 3000,
      });
    }
  }
</script>

<style scoped>
.schedule-planning {
  padding: 2rem;
}

.stepper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  background: var(--surface-card);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 150px;
}

.step.active {
  background: var(--primary-color);
  color: white;
}

.step-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--surface-card);
  color: var(--text-color);
}

.step.active .step-number {
  background: white;
  color: var(--primary-color);
}

.step-card {
  margin-bottom: 2rem;
}

.form-block {
  margin-bottom: 1rem;
}

.weekdays {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.excluded-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lesson-card {
  background: var(--surface-card);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.lesson-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.lesson-card__date,
.lesson-card__number {
  width: 100%;
}

.lesson-card__calendar,
.lesson-card__dropdown {
  width: 100%;
}

.lesson-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.move-dialog {
  max-width: 90vw;
}

.w-full {
  width: 100%;
}

@media (max-width: 768px) {
  .schedule-planning {
    padding: 1rem;
  }

  .stepper {
    flex-direction: column;
  }

  .step {
    width: 100%;
  }
}
</style>