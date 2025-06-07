<template>
  <div class="day-schedule">
    <div class="day-schedule__options">
      <Checkbox
        v-model="hideEmptyDays"
        input-id="hideEmptyDays"
        :binary="true"
      />
      <label
        for="hideEmptyDays"
        style="margin-left: 8px; cursor:pointer;"
      >Скрывать пустые дни</label>
    </div>

    <div
      v-if="loading"
      class="loading"
    >
      <ProgressSpinner />
      <p>Загрузка расписания...</p>
    </div>
    <div
      v-else-if="schedule.length === 0"
      class="no-schedule"
    >
      <i
        class="pi pi-calendar-times"
        style="font-size: 2rem"
      />
      <p>Расписание не найдено</p>
    </div>
    <div
      v-else
      class="day-schedule__day-cards"
    >
      <GroupProfileDayScheduleCards
        v-for="schedule in filteredScheduleCardGroup"
        :key="schedule.weekdayTextName"
        :weekday-name="schedule.weekdayTextName"
        :lessons-for-the-day="schedule.lessonsByPair"
      />
    </div>
  </div>
</template>

<script setup>
  import GroupProfileDayScheduleCards from '@components/GroupProfile/GroupProfileDaySchedule.vue';
  import Checkbox from 'primevue/checkbox';
  import ProgressSpinner from 'primevue/progressspinner';
  import { computed, ref, watch, onMounted } from 'vue';
  import { scheduleService } from '@service/api-endpoints/schedule.js';
  import { useToast } from 'primevue/usetoast';

  const props = defineProps({
    groupDetails: { type: Object, required: true },
  });

  const schedule = ref([]);
  const hideEmptyDays = ref(localStorage.getItem('hideEmptyDays') === 'true');
  const loading = ref(false);
  const toast = useToast();

  // Следим за изменением состояния чекбокса и сохраняем в localStorage
  watch(hideEmptyDays, (newValue) => {
    localStorage.setItem('hideEmptyDays', newValue);
  });

  const loadSchedule = async () => {
    try {
      loading.value = true;

      const response = await scheduleService.getGroupSchedule(props.groupDetails.id);
      const scheduleData = response?.schedule || [];
      schedule.value = scheduleData.map(lesson => ({
        ...lesson,
        date: new Date(lesson.date),
        exceptionDate: lesson.exceptionDate ? new Date(lesson.exceptionDate) : null,
      }));

    } catch (error) {
      console.error('Ошибка при загрузке расписания:', error);
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось загрузить расписание',
        life: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  const currentScheduleCardGroup = computed(() => {
    const byWeekday = {};
    for (let i = 1; i <= 6; i++) {
      byWeekday[i] = { weekdayTextName: getWeekdayName(i), lessonsByPair: [] };
      for (let pair = 1; pair <= 7; pair++) {
        byWeekday[i].lessonsByPair.push({
          lessonNumber: pair,
          lessons: [],
        });
      }
    }
    for (const lesson of schedule.value) {
      const date = new Date(lesson.date);
      let weekday = date.getDay();
      if (weekday === 0) weekday = 7;
      if (!byWeekday[weekday]) continue;
      const pairObj = byWeekday[weekday].lessonsByPair[lesson.lessonNumber - 1];
      if (pairObj) pairObj.lessons.push(lesson);
    }
    return Object.values(byWeekday);
  });

  const filteredScheduleCardGroup = computed(() => {
    if (!hideEmptyDays.value) return currentScheduleCardGroup.value;
    return currentScheduleCardGroup.value.filter(day =>
      day.lessonsByPair.some(pair => pair.lessons.length > 0),
    );
  });

  function getWeekdayName(day) {
    const weekdays = [null, 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return weekdays[day];
  }

  onMounted(loadSchedule);
  watch(() => props.groupDetails.id, (newId) => {
    loadSchedule();
  }, { immediate: true });
</script>

<style scoped>
.day-schedule {
  width: 100%;
}

.day-schedule__options {
  margin-bottom: 20px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.day-schedule__day-cards {
  width: 100%;
  display: flex;
  overflow: auto;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  gap: 10px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.no-schedule {
  text-align: center;
  padding: 40px;
  color: var(--text-color-secondary);
}

.no-schedule i {
  margin-bottom: 16px;
}
</style>