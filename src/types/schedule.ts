export interface Schedule {
  id: string;
  date: string;
  dayOfWeek: string;
  lessonNumber: number;
  subjectName: string;
  teacherName: string;
  teachingAssignmentId: string;
  isException: boolean;
  exceptionDate: string | null;
}

export interface ScheduleCreate {
  teachingAssignmentId: string;
  date: string;
  lessonNumber: number;
  isException: boolean;
  exceptionDate?: string;
}

export interface ScheduleUpdate {
  id: string;
  date?: string;
  lessonNumber?: number;
  isException?: boolean;
  exceptionDate?: string;
} 