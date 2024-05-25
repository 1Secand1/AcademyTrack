import { createServerManager } from '@service/serverManager';

export const StudentsService = createServerManager('student');
export const StudentGroupsService = createServerManager('group');
export const GroupsAssignedToTeacherService = createServerManager('studentUserGroups');
export { getLessonAttendanceReport } from '@service/getLessonAttendanceReport';
export { getLessonPlan } from '@service/getLessonPlan';
