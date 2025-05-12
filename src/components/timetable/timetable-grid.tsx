
import React from 'react';
import { Check, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeSlot, DayOfWeek } from '@/types/timetable';
import { useAuth } from '@/context/auth-context';

interface TimetableGridProps {
  timetableData: TimeSlot[];
  onConfirmLecture?: (timeSlotId: string) => void;
  onUnconfirmLecture?: (timeSlotId: string) => void;
}

const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '08:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
];

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  timetableData,
  onConfirmLecture,
  onUnconfirmLecture,
}) => {
  const { user } = useAuth();
  const isLecturer = user?.role === 'lecturer';

  // Group timetable data by day and time for easier rendering
  const timetableByDayAndTime: Record<string, Record<string, TimeSlot>> = {};
  
  daysOfWeek.forEach(day => {
    timetableByDayAndTime[day] = {};
    timeSlots.forEach(timeSlot => {
      const [startTime, endTime] = timeSlot.split('-');
      const slot = timetableData.find(
        slot => slot.day === day && slot.startTime === startTime && slot.endTime === endTime
      );
      if (slot) {
        timetableByDayAndTime[day][timeSlot] = slot;
      }
    });
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-6 gap-2">
          {/* Header row with days of the week */}
          <div className="bg-muted rounded-md p-2 font-medium">Time</div>
          {daysOfWeek.map(day => (
            <div key={day} className="bg-muted rounded-md p-2 font-medium text-center">
              {day}
            </div>
          ))}
          
          {/* Time slots rows */}
          {timeSlots.map(timeSlot => (
            <React.Fragment key={timeSlot}>
              {/* Time column */}
              <div className="p-2 border-t flex items-center justify-center">
                <span className="font-medium">{timeSlot}</span>
              </div>
              
              {/* Day columns */}
              {daysOfWeek.map(day => {
                const slot = timetableByDayAndTime[day][timeSlot];
                return (
                  <div key={`${day}-${timeSlot}`} className="p-1 border-t min-h-[120px]">
                    {slot ? (
                      <Card className={slot.confirmed ? 'border-green-500 shadow-sm' : 'shadow-sm'}>
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm font-medium">{slot.course.code}</CardTitle>
                          <CardDescription className="text-xs">
                            {slot.course.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 pt-0 text-xs space-y-1">
                          <p><strong>Venue:</strong> {slot.venue}</p>
                          <p><strong>Lecturer:</strong> {slot.course.lecturerName}</p>
                          {isLecturer && onConfirmLecture && (
                            <div className="mt-2">
                              {slot.confirmed ? (
                                <div className="flex flex-col space-y-1">
                                  <div className="flex items-center text-green-600">
                                    <Check className="h-4 w-4 mr-1" />
                                    <span>Confirmed</span>
                                  </div>
                                  {onUnconfirmLecture && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="w-full text-red-500"
                                      onClick={() => onUnconfirmLecture(slot.id)}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <Button 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => onConfirmLecture(slot.id)}
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  Confirm
                                </Button>
                              )}
                            </div>
                          )}
                          {!isLecturer && slot.confirmed && (
                            <div className="flex items-center text-green-600 mt-2">
                              <Check className="h-4 w-4 mr-1" />
                              <span>Confirmed</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="h-full w-full"></div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
