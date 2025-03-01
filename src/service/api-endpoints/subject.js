import { ServerManager } from '@service/serverManager.js';

class SubjectService  extends ServerManager {
    constructor() {
        super('subject');
    }
}

export const subjectService = new SubjectService();