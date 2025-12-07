import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChefOrderAssignment, MealType, TaskType, TaskStatus } from '@/types/restaurant';
import { format } from 'date-fns';

interface ChefOrderAssignmentsProps {
  assignments: ChefOrderAssignment[];
}

const mealTypeLabels: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
};

const taskTypeLabels: Record<TaskType, string> = {
  meal_preparation: 'Meal Prep',
  cleaning: 'Cleaning',
  ingredient_preprocessing: 'Ingredient Prep',
  food_serving_supervision: 'Serving',
  inventory_checks: 'Inventory',
};

const statusColors: Record<TaskStatus, string> = {
  pending: 'bg-status-pending/20 text-status-pending border-status-pending/30',
  in_progress: 'bg-primary/20 text-primary border-primary/30',
  completed: 'bg-status-success/20 text-status-success border-status-success/30',
};

export const ChefOrderAssignments = ({ assignments }: ChefOrderAssignmentsProps) => {
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [mealTypeFilter, setMealTypeFilter] = useState<string>('all');
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>('all');

  const filteredAssignments = assignments.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (mealTypeFilter !== 'all' && a.mealType !== mealTypeFilter) return false;
    if (taskTypeFilter !== 'all' && a.taskType !== taskTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Order Assignments</h3>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Meal Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meals</SelectItem>
            {Object.entries(mealTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={taskTypeFilter} onValueChange={setTaskTypeFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Task Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            {Object.entries(taskTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredAssignments.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No order assignments found</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Meal Type</TableHead>
                <TableHead>Task Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.orderId}</TableCell>
                  <TableCell>{format(new Date(assignment.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{mealTypeLabels[assignment.mealType]}</TableCell>
                  <TableCell>{taskTypeLabels[assignment.taskType]}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[assignment.status]}>
                      {assignment.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {assignment.notes || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
