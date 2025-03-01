import { ServerManager } from '@service/serverManager.js';

class StudentsService  extends ServerManager {
    constructor() {
        super('students');
    }
}

export const studentsService = new StudentsService();