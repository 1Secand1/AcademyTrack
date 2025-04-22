import { ServerManager } from '@service/serverManager.js';

class ScheduleService  extends ServerManager {
    constructor() {
        super('schedule');
    }
}

export const scheduleService = new ScheduleService();