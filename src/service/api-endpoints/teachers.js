import { ServerManager } from '@service/serverManager.js';

class TeachersService  extends ServerManager {
    constructor() {
        super('teachers');
    }
}

export const teachersService = new TeachersService();