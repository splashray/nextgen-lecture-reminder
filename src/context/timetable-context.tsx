
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TimeSlot, ClassScheduleParams, DayOfWeek, ClassLevel, DepartmentInfo } from '@/types/timetable';
import { useAuth } from './auth-context';
import { useNotifications } from './notification-context';

interface TimetableContextType {
  timetableData: TimeSlot[];
  departments: DepartmentInfo[];
  levels: ClassLevel[];
  getClassSchedule: (params: ClassScheduleParams) => TimeSlot[];
  getLecturerSchedule: (lecturerId: string) => TimeSlot[];
  confirmLecture: (timeSlotId: string) => void;
  updateTimeSlot: (timeSlotId: string, updates: Partial<TimeSlot>) => void;
  addTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => void;
  removeTimeSlot: (timeSlotId: string) => void;
}

const mockDepartments: DepartmentInfo[] = [
  { id: 'csc', name: 'Computer Science', levels: ['ND1', 'ND2', 'HND1', 'HND2'] },
  { id: 'mc', name: 'Mass Communication', levels: ['ND1', 'ND2', 'HND1', 'HND2'] },
  { id: 'ba', name: 'Business Administration', levels: ['ND1', 'ND2', 'HND1', 'HND2'] },
  { id: 'acc', name: 'Accountancy', levels: ['ND1', 'ND2', 'HND1', 'HND2'] },
];

// Sample timetable data
const initialTimetableData: TimeSlot[] = [
  {
    id: '1',
    day: 'Monday',
    startTime: '08:00',
    endTime: '10:00',
    course: {
      id: 'csc101',
      code: 'CSC101',
      name: 'Introduction to Computer Science',
      department: 'Computer Science',
      lecturerId: 'STAFF001',
      lecturerName: 'Dr. John Smith'
    },
    venue: 'Room 101',
    confirmed: false,
    level: 'ND1',
    department: 'Computer Science'
  },
  {
    id: '2',
    day: 'Tuesday',
    startTime: '10:00',
    endTime: '12:00',
    course: {
      id: 'csc203',
      code: 'CSC203',
      name: 'Web Development',
      department: 'Computer Science',
      lecturerId: 'STAFF001',
      lecturerName: 'Dr. John Smith'
    },
    venue: 'Lab 2',
    confirmed: false,
    level: 'ND2',
    department: 'Computer Science'
  },
  {
    id: '3',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '16:00',
    course: {
      id: 'com101',
      code: 'COM101',
      name: 'Introduction to Mass Communication',
      department: 'Mass Communication',
      lecturerId: 'STAFF002',
      lecturerName: 'Prof. Sarah Williams'
    },
    venue: 'Lecture Hall A',
    confirmed: false,
    level: 'ND1',
    department: 'Mass Communication'
  },
  {
    id: '4',
    day: 'Monday',
    startTime: '12:00',
    endTime: '14:00',
    course: {
      id: 'com301',
      code: 'COM301',
      name: 'Digital Journalism',
      department: 'Mass Communication',
      lecturerId: 'STAFF002',
      lecturerName: 'Prof. Sarah Williams'
    },
    venue: 'Media Lab',
    confirmed: false,
    level: 'HND1',
    department: 'Mass Communication'
  },
  {
    id: '5',
    day: 'Thursday',
    startTime: '08:00',
    endTime: '10:00',
    course: {
      id: 'csc401',
      code: 'CSC401',
      name: 'Database Systems',
      department: 'Computer Science',
      lecturerId: 'STAFF001',
      lecturerName: 'Dr. John Smith'
    },
    venue: 'Room 203',
    confirmed: false,
    level: 'HND1',
    department: 'Computer Science'
  }
];

const TimetableContext = createContext<TimetableContextType>({
  timetableData: [],
  departments: [],
  levels: ['ND1', 'ND2', 'HND1', 'HND2'],
  getClassSchedule: () => [],
  getLecturerSchedule: () => [],
  confirmLecture: () => {},
  updateTimeSlot: () => {},
  addTimeSlot: () => {},
  removeTimeSlot: () => {},
});

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timetableData, setTimetableData] = useState<TimeSlot[]>(initialTimetableData);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const levels: ClassLevel[] = ['ND1', 'ND2', 'HND1', 'HND2'];

  // Load timetable data from localStorage on first render
  useEffect(() => {
    const savedTimetable = localStorage.getItem('timetableData');
    if (savedTimetable) {
      try {
        setTimetableData(JSON.parse(savedTimetable));
      } catch (error) {
        console.error('Error parsing saved timetable:', error);
      }
    }
  }, []);

  // Save timetable data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('timetableData', JSON.stringify(timetableData));
  }, [timetableData]);

  const getClassSchedule = (params: ClassScheduleParams): TimeSlot[] => {
    return timetableData.filter(
      slot => slot.level === params.level && slot.department === params.department
    );
  };

  const getLecturerSchedule = (lecturerId: string): TimeSlot[] => {
    return timetableData.filter(slot => slot.course.lecturerId === lecturerId);
  };

  const confirmLecture = (timeSlotId: string) => {
    const timeSlot = timetableData.find(slot => slot.id === timeSlotId);
    if (!timeSlot) return;

    setTimetableData(prev =>
      prev.map(slot =>
        slot.id === timeSlotId ? { ...slot, confirmed: true } : slot
      )
    );

    // Notify all students in that class about the confirmed lecture
    if (user?.role === 'lecturer') {
      // We'd normally fetch students who should receive this notification
      // For demo purposes, we'll simulate this with a notification
      addNotification({
        title: 'Lecture Confirmed',
        message: `${user.name} has confirmed the ${timeSlot.course.name} lecture on ${timeSlot.day} from ${timeSlot.startTime} to ${timeSlot.endTime} in ${timeSlot.venue}.`,
        type: 'success',
      });
    }
  };

  const updateTimeSlot = (timeSlotId: string, updates: Partial<TimeSlot>) => {
    setTimetableData(prev =>
      prev.map(slot =>
        slot.id === timeSlotId ? { ...slot, ...updates } : slot
      )
    );
  };

  const addTimeSlot = (timeSlot: Omit<TimeSlot, 'id'>) => {
    const newTimeSlot = {
      ...timeSlot,
      id: Date.now().toString(),
    };
    setTimetableData(prev => [...prev, newTimeSlot]);
  };

  const removeTimeSlot = (timeSlotId: string) => {
    setTimetableData(prev => prev.filter(slot => slot.id !== timeSlotId));
  };

  return (
    <TimetableContext.Provider
      value={{
        timetableData,
        departments: mockDepartments,
        levels,
        getClassSchedule,
        getLecturerSchedule,
        confirmLecture,
        updateTimeSlot,
        addTimeSlot,
        removeTimeSlot,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => useContext(TimetableContext);
