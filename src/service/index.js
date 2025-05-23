export * from './auth.js';
export * from './apiClient.js';
export * from './serverManager.js';
export * from './exportService.js';
export * from './api-endpoints/teachers.js';
export * from './api-endpoints/students.js';
export * from './api-endpoints/groups.js';
export * from './api-endpoints/subject.js';
export * from './api-endpoints/teaching-assignments.js';

export { attendanceService  } from '@service/api-endpoints/attendance.js';
export { subjectService  } from '@service/api-endpoints/subject.js';
export { teachingAssignmentsService } from '@service/api-endpoints/teaching-assignments.js';
export { scheduleService } from '@service/api-endpoints/schedule.js';

export { getLessonAttendanceReport } from '@service/api-endpoints/getLessonAttendanceReport.js';
export { getLessonPlan } from '@service/api-endpoints/getLessonPlan.js';