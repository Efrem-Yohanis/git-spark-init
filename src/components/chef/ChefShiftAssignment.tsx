import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkShift } from '@/types/restaurant';
import { Clock, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChefShiftAssignmentProps {
  currentShift: WorkShift;
  onUpdateShift: (shift: WorkShift) => void;
}

const shiftLabels: Record<WorkShift, string> = {
  morning: 'Morning (6AM - 2PM)',
  afternoon: 'Afternoon (2PM - 10PM)',
  evening: 'Evening (10PM - 6AM)',
  rotational: 'Rotational',
};

export const ChefShiftAssignment = ({ currentShift, onUpdateShift }: ChefShiftAssignmentProps) => {
  const [selectedShift, setSelectedShift] = useState<WorkShift>(currentShift);

  const handleSave = () => {
    onUpdateShift(selectedShift);
    toast({ title: 'Shift updated successfully' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Shift Assignment</h3>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedShift} onValueChange={(v) => setSelectedShift(v as WorkShift)}>
          <SelectTrigger className="w-[250px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(shiftLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSave} className="gap-2" disabled={selectedShift === currentShift}>
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {Object.entries(shiftLabels).map(([value, label]) => (
          <div
            key={value}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedShift === value
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-muted/30 border-border text-muted-foreground hover:border-primary/50'
            }`}
            onClick={() => setSelectedShift(value as WorkShift)}
          >
            <p className="text-sm font-medium">{label.split(' (')[0]}</p>
            <p className="text-xs opacity-70">{label.match(/\(([^)]+)\)/)?.[1] || ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
