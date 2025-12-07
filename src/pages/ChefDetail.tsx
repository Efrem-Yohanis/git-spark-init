import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, ClipboardList, Calendar, Clock } from 'lucide-react';
import { mockChefs } from '@/data/mockData';
import { ChefProfileInfo } from '@/components/chef/ChefProfileInfo';
import { ChefTasksSection } from '@/components/chef/ChefTasksSection';
import { ChefOrderAssignments } from '@/components/chef/ChefOrderAssignments';
import { ChefShiftAssignment } from '@/components/chef/ChefShiftAssignment';
import { ChefAttendanceSection } from '@/components/chef/ChefAttendanceSection';
import { ChefTask, TaskStatus, WorkShift } from '@/types/restaurant';

const ChefDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chef = mockChefs.find(c => c.id === id);

  const [tasks, setTasks] = useState<ChefTask[]>(chef?.tasks || []);
  const [currentShift, setCurrentShift] = useState<WorkShift>(chef?.workShift || 'morning');

  if (!chef) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Chef not found</p>
        </div>
      </MainLayout>
    );
  }

  const handleAddTask = (task: Partial<ChefTask>) => {
    const newTask: ChefTask = {
      id: `T-${Date.now()}`,
      chefId: chef.id,
      taskType: task.taskType!,
      status: task.status || 'pending',
      assignedDate: task.assignedDate || new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, status, completedDate: status === 'completed' ? new Date() : undefined } 
        : t
    ));
  };

  const handleUpdateShift = (shift: WorkShift) => {
    setCurrentShift(shift);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/chefs')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Chef Profile</h1>
        </div>

        {/* Profile Info */}
        <div className="rounded-xl border border-border bg-card p-6">
          <ChefProfileInfo chef={chef} />
        </div>

        {/* Tabbed Sections */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <User className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="shift" className="gap-2">
              <Clock className="h-4 w-4" />
              Shift
            </TabsTrigger>
            <TabsTrigger value="attendance" className="gap-2">
              <Calendar className="h-4 w-4" />
              Attendance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <ChefTasksSection 
                tasks={tasks} 
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
              />
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <ChefOrderAssignments assignments={chef.orderAssignments || []} />
            </div>
          </TabsContent>

          <TabsContent value="shift" className="mt-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <ChefShiftAssignment 
                currentShift={currentShift} 
                onUpdateShift={handleUpdateShift}
              />
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <ChefAttendanceSection 
                attendanceLogs={chef.attendanceLogs || []}
                leaveRequests={chef.leaveRequests || []}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ChefDetail;
