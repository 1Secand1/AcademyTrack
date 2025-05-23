import { ServerManager } from '@service/serverManager.js';

/**
 * @typedef {Object} ScheduleLesson
 * @property {string} id - ID занятия
 * @property {string} date - Дата в формате YYYY-MM-DD
 * @property {string} dayOfWeek - День недели
 * @property {number} lessonNumber - Номер пары
 * @property {string} subjectName - Название предмета
 * @property {string} teacherName - ФИО преподавателя
 * @property {string} teachingAssignmentId - ID связи преподаватель-группа
 * @property {boolean} isException - Является ли исключением
 * @property {string|null} exceptionDate - Дата исключения
 */

/**
 * @typedef {Object} GroupScheduleResponse
 * @property {string} groupId - ID группы
 * @property {string} groupName - Название группы
 * @property {ScheduleLesson[]} schedule - Массив занятий
 */

class ScheduleService extends ServerManager {
    constructor() {
        super('schedule');
    }

    /**
     * Получение расписания группы
     * @param {string|number} groupId - ID группы
     * @param {string} [month] - Месяц в формате YYYY-MM
     * @param {string} [year] - Год в формате YYYY
     * @returns {Promise<GroupScheduleResponse>}
     */
    async getGroupSchedule(groupId, month, year) {
        const params = new URLSearchParams();
        if (month) params.append('month', month);
        if (year) params.append('year', year);
        
        const response = await this.get(`groups/${groupId}?${params.toString()}`);
        // ServerManager.get оборачивает ответ в массив, берем первый элемент
        return response[0] || { schedule: [] };
    }
}

export const scheduleService = new ScheduleService();