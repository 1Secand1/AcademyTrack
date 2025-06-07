import { ServerManager } from '@service/serverManager.js';

class AttendanceService extends ServerManager {
    constructor() {
        super('attendance');
    }

    async getGroupSummary(groupId) {
        return await this.get(`group/${groupId}/summary`);
    }

    async pos(groupId) {
        return await this.get(`group/${groupId}/summary`);
    }
}

export const attendanceService = new AttendanceService();