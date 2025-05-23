import { ServerManager } from '@service/serverManager.js';

class AttendanceService extends ServerManager {
    constructor() {
        super('attendance');
    }

    // Получить сводную статистику посещаемости по группе
    async getGroupSummary(groupId) {
        return await this.get(`group/${groupId}/summary`);
    }
}

export const attendanceService = new AttendanceService();