import { ServerManager } from '@service/serverManager.js';

class GroupsService  extends ServerManager {
    constructor() {
        super('groups');
    }
}

export const groupsService = new GroupsService();