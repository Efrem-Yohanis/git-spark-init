import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ChefTask, TaskType, TaskStatus } from '@/types/restaurant';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ChefTasksSectionProps {
  tasks: ChefTask[];
  onAddTask: (task: Partial<ChefTask>) => void;
  onUpdateTask: (taskId: string, status: TaskStatus) => void;
}

const taskTypeLabels: Record<TaskType, string> = {
  meal_preparation: 'Meal Preparation',
  cleaning: 'Cleaning',
  ingredient_preprocessing: 'Ingredient Pre-processing',
  food_serving_supervision: 'Food Serving Supervision',
  inventory_checks: 'Inventory Checks',
};

const statusIcons: Record<TaskStatus, typeof CheckCircle> = {
  pending: AlertCircle,
  in_progress: Clock,
  completed: CheckCircle,
};

const statusColors: Record<TaskStatus, string> = {
  pending: 'bg-status-pending/20 text-status-pending border-status-pending/30',
  in_progress: 'bg-primary/20 text-primary border-primary/30',
  completed: 'bg-status-success/20 text-status-success border-status-success/30',
};

export const ChefTasksSection = ({ tasks, onAddTask, onUpdateTask }: ChefTasksSectionProps) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | ''>('');

  const handleAddTask = () => {
    if (!selectedTaskType) {
      toast({ title: 'Please select a task type', variant: 'destructive' });
      return;
    }
    onAddTask({
      taskType: selectedTaskType,
      status: 'pending',
      assignedDate: new Date(),
    });
    setAddDialogOpen(false);
    setSelectedTaskType('');
    toast({ title: 'Task assigned successfully' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Assigned Tasks</h3>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No tasks assigned</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const StatusIcon = statusIcons[task.status];
            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-5 w-5 ${
                    task.status === 'completed' ? 'text-status-success' :
                    task.status === 'in_progress' ? 'text-primary' : 'text-status-pending'
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">{taskTypeLabels[task.taskType]}</p>
                    <p className="text-xs text-muted-foreground">
                      Assigned: {format(new Date(task.assignedDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusColors[task.status]}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                  {task.status !== 'completed' && (
                    <Select
                      value={task.status}
                      onValueChange={(v) => onUpdateTask(task.id, v as TaskStatus)}
                    >
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={selectedTaskType} onValueChange={(v) => setSelectedTaskType(v as TaskType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(taskTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
