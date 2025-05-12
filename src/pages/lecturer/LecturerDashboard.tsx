
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TimetableGrid } from '@/components/timetable/timetable-grid';
import { useAuth } from '@/context/auth-context';
import { useTimetable } from '@/context/timetable-context';

const LecturerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getLecturerSchedule, confirmLecture, unconfirmLecture } = useTimetable();
  
  // Get today's lectures for this lecturer
  const allLectures = getLecturerSchedule(user?.id || '');
  const today = new Date();
  const dayNames: Record<number, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };
  const todayName = dayNames[today.getDay()];
  const todaysLectures = allLectures.filter(lecture => lecture.day === todayName);
  const upcomingLectures = allLectures.filter(lecture => !lecture.confirmed);
  const thisWeeksLectures = allLectures.slice(0, 5); // Just show 5 for the dashboard

  const handleConfirmLecture = (timeSlotId: string) => {
    confirmLecture(timeSlotId);
  };

  const handleUnconfirmLecture = (timeSlotId: string) => {
    unconfirmLecture(timeSlotId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h2>
        <p className="text-muted-foreground">
          Here's an overview of your teaching schedule and today's classes
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allLectures.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(allLectures.map(l => l.course.id)).size} courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysLectures.length}</div>
            <p className="text-xs text-muted-foreground">
              {todaysLectures.filter(l => l.confirmed).length} confirmed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.department || '-'}</div>
            <p className="text-xs text-muted-foreground">
              Teaching multiple levels
            </p>
          </CardContent>
        </Card>
      </div>
      
      {todaysLectures.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
            <CardDescription>Your teaching schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <TimetableGrid 
              timetableData={todaysLectures} 
              onConfirmLecture={handleConfirmLecture} 
              onUnconfirmLecture={handleUnconfirmLecture}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You have no classes scheduled for today.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>This Week's Schedule</CardTitle>
          <CardDescription>Your upcoming classes for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <TimetableGrid 
            timetableData={thisWeeksLectures} 
            onConfirmLecture={handleConfirmLecture}
            onUnconfirmLecture={handleUnconfirmLecture}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
          <CardDescription>Classes that need confirmation</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingLectures.length > 0 ? (
            <TimetableGrid 
              timetableData={upcomingLectures} 
              onConfirmLecture={handleConfirmLecture}
            />
          ) : (
            <p className="text-muted-foreground">All your classes are confirmed.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LecturerDashboard;
