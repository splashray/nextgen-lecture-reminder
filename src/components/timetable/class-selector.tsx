
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClassLevel, DepartmentInfo } from '@/types/timetable';

interface ClassSelectorProps {
  departments: DepartmentInfo[];
  levels: ClassLevel[];
  onSelect: (department: string, level: ClassLevel) => void;
  initialDepartment?: string;
  initialLevel?: ClassLevel;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  departments,
  levels,
  onSelect,
  initialDepartment,
  initialLevel,
}) => {
  const [department, setDepartment] = useState<string>(initialDepartment || '');
  const [level, setLevel] = useState<ClassLevel | ''>(initialLevel || '');

  const handleSubmit = () => {
    if (department && level) {
      onSelect(department, level as ClassLevel);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={department}
            onValueChange={setDepartment}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={level}
            onValueChange={(value) => setLevel(value as ClassLevel)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(lvl => (
                <SelectItem key={lvl} value={lvl}>
                  {lvl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={handleSubmit} 
            disabled={!department || !level}
            className="sm:ml-auto"
          >
            View Timetable
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
