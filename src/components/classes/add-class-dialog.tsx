
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTimetable } from '@/context/timetable-context';
import { useAuth } from '@/context/auth-context';
import { DayOfWeek } from '@/types/timetable';
import { toast } from '@/components/ui/use-toast';

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = [
  '08:00-10:00', 
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00'
];

const formSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  day: z.string().min(1, "Day is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  level: z.string().min(1, "Level is required"),
  department: z.string().min(1, "Department is required"),
});

export const AddClassDialog: React.FC<AddClassDialogProps> = ({ open, onOpenChange }) => {
  const { departments, levels, timetableData, addTimeSlot } = useTimetable();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      day: "Monday",
      time: times[0],
      venue: "",
      level: levels[0] || "",
      department: departments[0]?.name || "",
    },
  });

  // Get all courses taught by this lecturer
  const lecturerCourses = React.useMemo(() => {
    if (!user) return [];
    
    const uniqueCourses = new Map();
    
    timetableData.forEach(slot => {
      if (slot.course.lecturerId === user.id) {
        uniqueCourses.set(slot.course.id, {
          id: slot.course.id,
          code: slot.course.code,
          name: slot.course.name
        });
      }
    });
    
    return Array.from(uniqueCourses.values());
  }, [timetableData, user]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    // Find the selected course
    const selectedCourse = timetableData.find(slot => 
      slot.course.id === values.courseId
    )?.course;
    
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Selected course not found",
        variant: "destructive"
      });
      return;
    }
    
    // Parse the time string
    const [startTime, endTime] = values.time.split('-');
    
    // Create a new class
    const newClass = {
      day: values.day as DayOfWeek,
      startTime,
      endTime,
      course: selectedCourse,
      venue: values.venue,
      confirmed: false,
      level: values.level as any,
      department: values.department
    };
    
    // Add the class to the timetable
    addTimeSlot(newClass);
    
    toast({
      title: "Class Added",
      description: `${selectedCourse.code}: ${selectedCourse.name} has been scheduled for ${values.day} at ${values.time}.`,
    });
    
    // Reset form and close dialog
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Schedule a new class for one of your courses.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lecturerCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code}: {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {times.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input placeholder="Room 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add Class</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
