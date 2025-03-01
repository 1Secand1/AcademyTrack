import { ServerManager } from '@service/serverManager.js';

class TeachingAssignmentsService  extends ServerManager {
    constructor() {
        super('teaching-assignments');
    }
}

export const teachingAssignmentsService = new TeachingAssignmentsService();