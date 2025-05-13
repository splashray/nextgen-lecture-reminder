
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useTimetable } from '@/context/timetable-context';
import { Button } from '@/components/ui/button';
import { AddCourseDialog } from '@/components/courses/add-course-dialog';
import { Plus } from 'lucide-react';

const LecturerCourses: React.FC = () => {
  const { user } = useAuth();
  const { getLecturerSchedule, unconfirmLecture, confirmLecture } = useTimetable();
  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
  
  // Get all courses for this lecturer
  const schedule = getLecturerSchedule(user?.id || '');
  
  // Group by course ID to avoid duplicates
  const courseMap = new Map();
  schedule.forEach(slot => {
    const courseId = slot.course.id;
    if (!courseMap.has(courseId)) {
      courseMap.set(courseId, {
        code: slot.course.code,
        name: slot.course.name,
        department: slot.department,
        level: slot.level,
        classes: []
      });
    }
    courseMap.get(courseId).classes.push({
      id: slot.id,
      day: slot.day,
      time: `${slot.startTime}-${slot.endTime}`,
      venue: slot.venue,
      confirmed: slot.confirmed
    });
  });
  
  // Convert map to array for rendering
  const courses = Array.from(courseMap.values());

  const handleToggleConfirmation = (slotId: string, isCurrentlyConfirmed: boolean) => {
    if (isCurrentlyConfirmed) {
      unconfirmLecture(slotId);
    } else {
      confirmLecture(slotId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Courses</h2>
          <p className="text-muted-foreground">
            View and manage your assigned courses
          </p>
        </div>
        <Button onClick={() => setAddCourseDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex justify-between items-center">
                <span>{course.code}</span>
                <span className="text-sm font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {course.level} • {course.department}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <h3 className="text-lg font-medium mb-2">{course.name}</h3>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Classes:</h4>
                {course.classes.map((cls, clsIdx) => (
                  <div key={clsIdx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{cls.day}, {cls.time}</div>
                      <div className="text-sm text-muted-foreground">{cls.venue}</div>
                    </div>
                    <Button
                      size="sm"
                      variant={cls.confirmed ? "outline" : "default"}
                      onClick={() => handleToggleConfirmation(cls.id, cls.confirmed)}
                    >
                      {cls.confirmed ? "Cancel Confirmation" : "Confirm Availability"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {courses.length === 0 && (
          <div className="col-span-2 text-center p-8">
            <p className="text-muted-foreground">No courses assigned yet. Click the "Add Course" button to get started.</p>
          </div>
        )}
      </div>
      
      <AddCourseDialog 
        open={addCourseDialogOpen} 
        onOpenChange={setAddCourseDialogOpen} 
      />
    </div>
  );
};

export default LecturerCourses;
