import { createServerManager } from '@service/serverManager'

export const studentsService = createServerManager('student')
export const getStudentGroups = createServerManager('group')
export const getTeachersGroupsService = createServerManager('studentUserGroups')
export { getLessonAttendanceReport } from '@service/getLessonAttendanceReport'
export { getLessonPlan } from '@service/getLessonPlan'
