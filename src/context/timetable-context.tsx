
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
  getLecturerCourses: (lecturerId: string) => string[];
  confirmLecture: (timeSlotId: string) => void;
  unconfirmLecture: (timeSlotId: string) => void;
  updateTimeSlot: (timeSlotId: string, updates: Partial<TimeSlot>) => void;
  addTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => void;
  removeTimeSlot: (timeSlotId: string) => void;
  addLecturerToCourse: (lecturerId: string, courseId: string, department: string, level: ClassLevel) => void;
  removeLecturerFromCourse: (lecturerId: string, courseId: string) => void;
}

const mockDepartments: DepartmentInfo[] = [
  { id: 'csc', name: 'Computer Science', levels: ['ND1', 'ND2', 'HND1', 'HND2'] },
  { id: 'mc', name: 'Mass Communication', levels: ['ND1', 'ND2', 'HND1', 'HND2'] },
  { id: 'ba', name: 'Business Administration', levels: ['ND1', 'ND2', 'HND1', 'HND2'] },
  { id: 'acc', name: 'Accountancy', levels: ['ND1', 'ND2', 'HND1', 'HND2'] },
];

// Enhanced timetable data with updated course codes
const initialTimetableData: TimeSlot[] = [
  {
    id: '1',
    day: 'Monday',
    startTime: '08:00',
    endTime: '10:00',
    course: {
      id: 'com101',
      code: 'COM101',
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
      id: 'com203',
      code: 'COM203',
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
      id: 'com111',
      code: 'COM111',
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
      id: 'com401',
      code: 'COM401',
      name: 'Database Systems',
      department: 'Computer Science',
      lecturerId: 'STAFF001',
      lecturerName: 'Dr. John Smith'
    },
    venue: 'Room 203',
    confirmed: false,
    level: 'HND1',
    department: 'Computer Science'
  },
  {
    id: '6',
    day: 'Wednesday',
    startTime: '08:00',
    endTime: '10:00',
    course: {
      id: 'com411',
      code: 'COM411',
      name: 'Advanced Programming',
      department: 'Computer Science',
      lecturerId: 'STAFF001',
      lecturerName: 'Dr. John Smith'
    },
    venue: 'Lab 1',
    confirmed: false,
    level: 'HND2',
    department: 'Computer Science'
  },
  {
    id: '7',
    day: 'Friday',
    startTime: '10:00',
    endTime: '12:00',
    course: {
      id: 'com201',
      code: 'COM201',
      name: 'Data Structures',
      department: 'Computer Science',
      lecturerId: 'STAFF001',
      lecturerName: 'Dr. John Smith'
    },
    venue: 'Room 105',
    confirmed: false,
    level: 'ND2',
    department: 'Computer Science'
  },
  {
    id: '8',
    day: 'Tuesday',
    startTime: '14:00',
    endTime: '16:00',
    course: {
      id: 'com211',
      code: 'COM211',
      name: 'Media Production',
      department: 'Mass Communication',
      lecturerId: 'STAFF002',
      lecturerName: 'Prof. Sarah Williams'
    },
    venue: 'Studio A',
    confirmed: false,
    level: 'ND2',
    department: 'Mass Communication'
  },
  {
    id: '9',
    day: 'Friday',
    startTime: '14:00',
    endTime: '16:00',
    course: {
      id: 'com311',
      code: 'COM311',
      name: 'Systems Analysis',
      department: 'Computer Science',
      lecturerId: 'STAFF001',
      lecturerName: 'Dr. John Smith'
    },
    venue: 'Room 201',
    confirmed: false,
    level: 'HND1',
    department: 'Computer Science'
  },
  {
    id: '10',
    day: 'Thursday',
    startTime: '14:00',
    endTime: '16:00',
    course: {
      id: 'com321',
      code: 'COM321',
      name: 'Software Engineering',
      department: 'Computer Science',
      lecturerId: 'STAFF001',
      lecturerName: 'Dr. John Smith'
    },
    venue: 'Room 302',
    confirmed: false,
    level: 'HND1',
    department: 'Computer Science'
  },
  {
    id: '11',
    day: 'Monday',
    startTime: '16:00',
    endTime: '18:00',
    course: {
      id: 'com221',
      code: 'COM221',
      name: 'Journalism Ethics',
      department: 'Mass Communication',
      lecturerId: 'STAFF002',
      lecturerName: 'Prof. Sarah Williams'
    },
    venue: 'Media Lab 2',
    confirmed: false,
    level: 'ND2',
    department: 'Mass Communication'
  },
  {
    id: '12',
    day: 'Wednesday',
    startTime: '10:00',
    endTime: '12:00',
    course: {
      id: 'com412',
      code: 'COM412',
      name: 'Artificial Intelligence',
      department: 'Computer Science',
      lecturerId: 'STAFF001',
      lecturerName: 'Dr. John Smith'
    },
    venue: 'Computer Lab 3',
    confirmed: false,
    level: 'HND2',
    department: 'Computer Science'
  },
  // Additional classes to make a total of 15+
  {
    id: '13',
    day: 'Friday',
    startTime: '08:00',
    endTime: '10:00',
    course: {
      id: 'com421',
      code: 'COM421',
      name: 'Machine Learning',
      department: 'Computer Science',
      lecturerId: 'STAFF001',
      lecturerName: 'Dr. John Smith'
    },
    venue: 'Computer Lab 2',
    confirmed: false,
    level: 'HND2',
    department: 'Computer Science'
  },
  {
    id: '14',
    day: 'Tuesday',
    startTime: '08:00',
    endTime: '10:00',
    course: {
      id: 'com121',
      code: 'COM121',
      name: 'Introduction to Programming',
      department: 'Computer Science',
      lecturerId: 'STAFF001',
      lecturerName: 'Dr. John Smith'
    },
    venue: 'Room 102',
    confirmed: false,
    level: 'ND1',
    department: 'Computer Science'
  },
  {
    id: '15',
    day: 'Thursday',
    startTime: '12:00',
    endTime: '14:00',
    course: {
      id: 'com231',
      code: 'COM231',
      name: 'Broadcast Media',
      department: 'Mass Communication',
      lecturerId: 'STAFF002',
      lecturerName: 'Prof. Sarah Williams'
    },
    venue: 'Studio B',
    confirmed: false,
    level: 'ND2',
    department: 'Mass Communication'
  },
  {
    id: '16',
    day: 'Monday',
    startTime: '10:00',
    endTime: '12:00',
    course: {
      id: 'com331',
      code: 'COM331',
      name: 'Media Ethics',
      department: 'Mass Communication',
      lecturerId: 'STAFF002',
      lecturerName: 'Prof. Sarah Williams'
    },
    venue: 'Lecture Hall B',
    confirmed: false,
    level: 'HND1',
    department: 'Mass Communication'
  },
  {
    id: '17',
    day: 'Wednesday',
    startTime: '16:00',
    endTime: '18:00',
    course: {
      id: 'com431',
      code: 'COM431',
      name: 'Media Management',
      department: 'Mass Communication',
      lecturerId: 'STAFF002',
      lecturerName: 'Prof. Sarah Williams'
    },
    venue: 'Room 301',
    confirmed: false,
    level: 'HND2',
    department: 'Mass Communication'
  }
];

const TimetableContext = createContext<TimetableContextType>({
  timetableData: [],
  departments: [],
  levels: ['ND1', 'ND2', 'HND1', 'HND2'],
  getClassSchedule: () => [],
  getLecturerSchedule: () => [],
  getLecturerCourses: () => [],
  confirmLecture: () => {},
  unconfirmLecture: () => {},
  updateTimeSlot: () => {},
  addTimeSlot: () => {},
  removeTimeSlot: () => {},
  addLecturerToCourse: () => {},
  removeLecturerFromCourse: () => {},
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

  // Check for lectures that need to be auto-reset (confirmed more than 5 minutes ago)
  useEffect(() => {
    const checkConfirmedLectures = () => {
      const currentTime = Date.now();
      const RESET_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      setTimetableData(prev => 
        prev.map(slot => {
          if (slot.confirmed && slot.confirmedAt && (currentTime - slot.confirmedAt > RESET_TIME)) {
            return { ...slot, confirmed: false, confirmedAt: undefined };
          }
          return slot;
        })
      );
    };

    const interval = setInterval(checkConfirmedLectures, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getClassSchedule = (params: ClassScheduleParams): TimeSlot[] => {
    return timetableData.filter(
      slot => slot.level === params.level && slot.department === params.department
    );
  };

  const getLecturerSchedule = (lecturerId: string): TimeSlot[] => {
    return timetableData.filter(slot => slot.course.lecturerId === lecturerId);
  };

  const getLecturerCourses = (lecturerId: string): string[] => {
    const courses = timetableData
      .filter(slot => slot.course.lecturerId === lecturerId)
      .map(slot => slot.course.code);
    
    // Remove duplicates
    return [...new Set(courses)];
  };

  const confirmLecture = (timeSlotId: string) => {
    const timeSlot = timetableData.find(slot => slot.id === timeSlotId);
    if (!timeSlot) return;

    setTimetableData(prev =>
      prev.map(slot =>
        slot.id === timeSlotId ? { 
          ...slot, 
          confirmed: true,
          confirmedAt: Date.now()
        } : slot
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

  const unconfirmLecture = (timeSlotId: string) => {
    const timeSlot = timetableData.find(slot => slot.id === timeSlotId);
    if (!timeSlot) return;

    setTimetableData(prev =>
      prev.map(slot =>
        slot.id === timeSlotId ? { 
          ...slot, 
          confirmed: false,
          confirmedAt: undefined
        } : slot
      )
    );

    // Notify about the change
    if (user?.role === 'lecturer') {
      addNotification({
        title: 'Lecture Availability Updated',
        message: `${user.name} has updated the availability for ${timeSlot.course.name} lecture on ${timeSlot.day}.`,
        type: 'info',
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

  const addLecturerToCourse = (lecturerId: string, courseId: string, department: string, level: ClassLevel) => {
    const lecturer = lecturerId === 'STAFF001' ? 'Dr. John Smith' : 'Prof. Sarah Williams';
    
    // Find if this course already exists
    const existingSlot = timetableData.find(slot => slot.course.id === courseId);
    
    if (existingSlot) {
      // Just update the lecturer for the course
      setTimetableData(prev =>
        prev.map(slot =>
          slot.course.id === courseId
            ? { 
                ...slot, 
                course: { 
                  ...slot.course, 
                  lecturerId: lecturerId,
                  lecturerName: lecturer
                } 
              }
            : slot
        )
      );
    } else {
      // Create a new timeslot for this course
      // This is simplified - in a real app you'd need more data
      addNotification({
        title: 'Operation Failed',
        message: 'Cannot add lecturer to non-existent course. Please create the course first.',
        type: 'error',
      });
    }
  };

  const removeLecturerFromCourse = (lecturerId: string, courseId: string) => {
    // Find if this lecturer teaches this course
    const courseSlots = timetableData.filter(
      slot => slot.course.id === courseId && slot.course.lecturerId === lecturerId
    );
    
    if (courseSlots.length > 0) {
      // Remove the lecturer from these slots
      setTimetableData(prev =>
        prev.map(slot =>
          slot.course.id === courseId && slot.course.lecturerId === lecturerId
            ? { 
                ...slot, 
                course: { 
                  ...slot.course, 
                  lecturerId: '',
                  lecturerName: 'Unassigned'
                } 
              }
            : slot
        )
      );
      
      addNotification({
        title: 'Lecturer Removed',
        message: `The lecturer has been removed from course ${courseId}.`,
        type: 'info',
      });
    }
  };

  return (
    <TimetableContext.Provider
      value={{
        timetableData,
        departments: mockDepartments,
        levels,
        getClassSchedule,
        getLecturerSchedule,
        getLecturerCourses,
        confirmLecture,
        unconfirmLecture,
        updateTimeSlot,
        addTimeSlot,
        removeTimeSlot,
        addLecturerToCourse,
        removeLecturerFromCourse,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => useContext(TimetableContext);
