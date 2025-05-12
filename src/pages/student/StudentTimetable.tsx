
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimetableGrid } from '@/components/timetable/timetable-grid';
import { useAuth } from '@/context/auth-context';
import { useTimetable } from '@/context/timetable-context';

const StudentTimetable: React.FC = () => {
  const { user } = useAuth();
  const { getClassSchedule } = useTimetable();
  
  // Get class schedule for this student based on their department and level
  const schedule = user?.department && user?.level 
    ? getClassSchedule({ 
        department: user.department, 
        level: user.level as any
      }) 
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Weekly Timetable</h2>
        <p className="text-muted-foreground">
          Your complete class schedule for {user?.level} {user?.department}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {schedule.length > 0 ? (
            <TimetableGrid timetableData={schedule} />
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">No classes have been scheduled for your level yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Confirmed Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {schedule.filter(slot => slot.confirmed).length > 0 ? (
            <TimetableGrid timetableData={schedule.filter(slot => slot.confirmed)} />
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">No classes have been confirmed yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentTimetable;
