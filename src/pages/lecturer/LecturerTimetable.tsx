
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimetableGrid } from '@/components/timetable/timetable-grid';
import { ClassSelector } from '@/components/timetable/class-selector';
import { useTimetable } from '@/context/timetable-context';
import { ClassLevel, TimeSlot } from '@/types/timetable';
import { useAuth } from '@/context/auth-context';

const LecturerTimetable: React.FC = () => {
  const { user } = useAuth();
  const { departments, levels, getClassSchedule, getLecturerSchedule, confirmLecture, unconfirmLecture } = useTimetable();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<ClassLevel | ''>('');
  const [viewMode, setViewMode] = useState<'all' | 'byClass'>('all');
  const [timetableData, setTimetableData] = useState<TimeSlot[]>(
    getLecturerSchedule(user?.id || '')
  );

  const handleClassSelect = (department: string, level: ClassLevel) => {
    setSelectedDepartment(department);
    setSelectedLevel(level);
    setViewMode('byClass');
    
    // Filter timetable data to show only selected class AND lectures by this lecturer
    const classSchedule = getClassSchedule({ department, level });
    const lecturerSchedule = getLecturerSchedule(user?.id || '');
    
    // Find the intersection - classes taught by this lecturer in the selected class
    const filteredSchedule = classSchedule.filter(
      slot => lecturerSchedule.some(ls => ls.id === slot.id)
    );
    
    setTimetableData(filteredSchedule);
  };

  const handleViewAll = () => {
    setViewMode('all');
    setTimetableData(getLecturerSchedule(user?.id || ''));
  };

  const handleConfirmLecture = (timeSlotId: string) => {
    confirmLecture(timeSlotId);
    // Update the local timetable data to reflect the confirmation
    setTimetableData(prev => 
      prev.map(slot => 
        slot.id === timeSlotId ? { ...slot, confirmed: true } : slot
      )
    );
  };

  const handleUnconfirmLecture = (timeSlotId: string) => {
    unconfirmLecture(timeSlotId);
    // Update the local timetable data to reflect the unconfirmation
    setTimetableData(prev => 
      prev.map(slot => 
        slot.id === timeSlotId ? { ...slot, confirmed: false } : slot
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Timetable Management</h2>
        <p className="text-muted-foreground">View and manage your teaching schedule</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={handleViewAll}
          >
            All My Classes
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'byClass' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setViewMode('byClass')}
          >
            View By Class
          </button>
        </div>

        {viewMode === 'byClass' && (
          <ClassSelector 
            departments={departments}
            levels={levels}
            onSelect={handleClassSelect}
            initialDepartment={selectedDepartment}
            initialLevel={selectedLevel as ClassLevel}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              {viewMode === 'all' 
                ? 'All Classes' 
                : `${selectedLevel} ${selectedDepartment} Classes`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimetableGrid 
              timetableData={timetableData} 
              onConfirmLecture={handleConfirmLecture}
              onUnconfirmLecture={handleUnconfirmLecture}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LecturerTimetable;
