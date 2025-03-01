import { ServerManager } from '@service/serverManager.js';

class AttendanceService  extends ServerManager {
    constructor() {
        super('attendance');
    }
}

export const attendanceService = new AttendanceService();