import { createServerManager } from '@service/serverManager'

export const studentsService = createServerManager('student')
export const getStudentGroups = createServerManager('group')
export const studentUserGroupsService = createServerManager('studentUserGroups')
export const getTeachersGroupsService = createServerManager('studentUserGroups')
