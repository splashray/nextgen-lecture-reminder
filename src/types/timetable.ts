
export type ClassLevel = 'ND1' | 'ND2' | 'HND1' | 'HND2';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  lecturerId: string;
  lecturerName: string;
}

export interface TimeSlot {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  course: Course;
  venue: string;
  confirmed: boolean;
  level: ClassLevel;
  department: string;
}

export interface ClassScheduleParams {
  level: ClassLevel;
  department: string;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  levels: ClassLevel[];
}
