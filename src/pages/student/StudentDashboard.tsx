
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TimetableGrid } from '@/components/timetable/timetable-grid';
import { useAuth } from '@/context/auth-context';
import { useTimetable } from '@/context/timetable-context';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getClassSchedule } = useTimetable();
  
  // Get class schedule for this student based on their department and level
  const schedule = user?.department && user?.level 
    ? getClassSchedule({ 
        department: user.department, 
        level: user.level as any
      }) 
    : [];
  
  // Get today's schedule
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
  const todaysSchedule = schedule.filter(lecture => lecture.day === todayName);
  // Show lectures that have been confirmed in the last 24 hours
  const recentlyConfirmed = schedule.filter(lecture => {
    if (!lecture.confirmedAt) return false;
    const hoursSinceConfirmation = (Date.now() - lecture.confirmedAt) / (1000 * 60 * 60);
    return lecture.confirmed && hoursSinceConfirmation < 24;
  });

  // Get confirmed lectures
  const confirmedLectures = schedule.filter(lecture => lecture.confirmed);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h2>
        <p className="text-muted-foreground">
          Here's an overview of your class schedule
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedule.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(schedule.map(l => l.course.id)).size} courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysSchedule.length}</div>
            <p className="text-xs text-muted-foreground">
              {todaysSchedule.filter(l => l.confirmed).length} confirmed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.level || '-'}</div>
            <p className="text-xs text-muted-foreground">
              {user?.department || 'No department set'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {todaysSchedule.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your lectures for today</CardDescription>
          </CardHeader>
          <CardContent>
            <TimetableGrid timetableData={todaysSchedule} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You have no classes scheduled for today.</p>
          </CardContent>
        </Card>
      )}

      {recentlyConfirmed.length > 0 && (
        <Card className="border-green-500">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700">Recently Confirmed Lectures</CardTitle>
            <CardDescription>These lectures have been confirmed in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <TimetableGrid timetableData={recentlyConfirmed} />
          </CardContent>
        </Card>
      )}

      {confirmedLectures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Confirmed Lectures</CardTitle>
            <CardDescription>These lectures have been confirmed by lecturers</CardDescription>
          </CardHeader>
          <CardContent>
            <TimetableGrid timetableData={confirmedLectures} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;
