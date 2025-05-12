
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useTimetable } from '@/context/timetable-context';
import { Button } from '@/components/ui/button';
import { ClassLevel } from '@/types/timetable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const LecturerClasses: React.FC = () => {
  const { user } = useAuth();
  const { departments, levels, getLecturerSchedule, addLecturerToCourse, removeLecturerFromCourse } = useTimetable();
  
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departments[0].name);
  const [selectedLevel, setSelectedLevel] = useState<ClassLevel>(levels[0]);
  
  // Get all classes for this lecturer
  const lecturerClasses = getLecturerSchedule(user?.id || '');
  
  // Group classes by department and level
  const classesByDeptLevel: Record<string, any> = {};
  
  lecturerClasses.forEach(cls => {
    const key = `${cls.department}-${cls.level}`;
    if (!classesByDeptLevel[key]) {
      classesByDeptLevel[key] = {
        department: cls.department,
        level: cls.level,
        classes: []
      };
    }
    
    // Add class if not already in the array
    const courseExists = classesByDeptLevel[key].classes.some(
      (c: any) => c.courseId === cls.course.id
    );
    
    if (!courseExists) {
      classesByDeptLevel[key].classes.push({
        courseId: cls.course.id,
        courseCode: cls.course.code,
        courseName: cls.course.name,
        venue: cls.venue,
        day: cls.day,
        time: `${cls.startTime}-${cls.endTime}`
      });
    }
  });
  
  const classGroups = Object.values(classesByDeptLevel);

  const handleRemoveFromClass = (courseId: string) => {
    if (user?.id) {
      removeLecturerFromCourse(user.id, courseId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Classes</h2>
        <p className="text-muted-foreground">
          Manage the classes you are assigned to teach
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {classGroups.map((group: any, index) => (
          <Card key={index}>
            <CardHeader className="bg-blue-50">
              <CardTitle className="font-medium">
                {group.level} • {group.department}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {group.classes.map((cls: any, clsIdx: number) => (
                  <div key={clsIdx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{cls.courseCode}: {cls.courseName}</div>
                      <div className="text-xs text-muted-foreground">
                        {cls.day}, {cls.time} • {cls.venue}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveFromClass(cls.courseId)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {classGroups.length === 0 && (
          <div className="col-span-2 text-center p-8">
            <p className="text-muted-foreground">You are not assigned to any classes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerClasses;
