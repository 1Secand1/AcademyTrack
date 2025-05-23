<template>
  <div class="group-schedule">
    <div class="schedule-header">
      <h2>Расписание группы {{ groupName }}</h2>
      <div class="schedule-controls">
        <Calendar
          v-model="selectedMonth"
          view="month"
          dateFormat="mm/yy"
          :showIcon="true"
          placeholder="Выберите месяц"
        />
        <div class="hide-empty-days">
          <Checkbox
            v-model="hideEmptyDays"
            :binary="true"
            inputId="hideEmptyDays"
          />
          <label for="hideEmptyDays">Скрывать пустые дни</label>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <ProgressSpinner />
    </div>
    <div v-else class="schedule-content">
      <ScheduleTable
        :schedule="schedule"
        :hideEmptyDays="hideEmptyDays"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { format } from 'date-fns';
import { useToast } from 'primevue/usetoast';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import ProgressSpinner from 'primevue/progressspinner';
import ScheduleTable from '@components/ScheduleTable.vue';
import { scheduleService } from '../services/scheduleService';
import type { Schedule } from '../types/schedule';

const toast = useToast();

const props = defineProps<{
  groupId: string;
  groupName: string;
}>();

const loading = ref(false);
const schedule = ref<Schedule[]>([]);
const selectedMonth = ref<Date | null>(null);
const hideEmptyDays = ref(false);

// Загрузка расписания
const loadSchedule = async () => {
  try {
    loading.value = true;
    const month = selectedMonth.value ? format(selectedMonth.value, 'yyyy-MM') : undefined;
    const year = selectedMonth.value ? format(selectedMonth.value, 'yyyy') : undefined;
    
    // Получаем расписание для всей группы одним запросом
    const scheduleData = await scheduleService.getGroupSchedule(
      props.groupId,
      month,
      year
    );
    
    // Преобразуем данные в нужный формат
    schedule.value = scheduleData.map(lesson => ({
      ...lesson,
      date: new Date(lesson.date),
      exceptionDate: lesson.exceptionDate ? new Date(lesson.exceptionDate) : null
    }));
  } catch (error) {
    console.error('Ошибка при загрузке расписания:', error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить расписание',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Загружаем расписание при монтировании компонента
onMounted(() => {
  loadSchedule();
});

// Следим за изменением месяца
watch(selectedMonth, () => {
  loadSchedule();
});
</script>

<style scoped>
.group-schedule {
  padding: 1rem;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.schedule-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.hide-empty-days {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.schedule-content {
  margin-top: 1rem;
}
</style> 