import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StaffCard } from '@/components/staff/StaffCard';
import { StaffList } from '@/components/staff/StaffList';
import { CreateChefDialog } from '@/components/chef/CreateChefDialog';
import { mockChefs } from '@/data/mockData';
import { ChefHat, TrendingUp, Clock, Award, LayoutGrid, List, Plus } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ChefManagement = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const totalOrders = mockChefs.reduce((acc, c) => acc + c.ordersCompletedToday, 0);
  const avgCookTime = mockChefs.reduce((acc, c) => acc + c.avgCookingTime, 0) / mockChefs.length;
  const avgAccuracy = mockChefs.reduce((acc, c) => acc + c.accuracyRate, 0) / mockChefs.length;
  const activeChefs = mockChefs.filter((c) => c.status !== 'offline').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chef Management</h1>
            <p className="text-muted-foreground mt-1">Kitchen staff coordination and performance tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} className="gradient-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              Add Chef
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Active Chefs"
              value={activeChefs}
              icon={ChefHat}
              subtitle={`of ${mockChefs.length} total`}
              variant="kitchen"
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Orders Completed"
              value={totalOrders}
              icon={TrendingUp}
              trend={{ value: 10, isPositive: true }}
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Avg Cook Time"
              value={`${avgCookTime.toFixed(0)}m`}
              icon={Clock}
              variant="pending"
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Avg Accuracy"
              value={`${avgAccuracy.toFixed(1)}%`}
              icon={Award}
              variant="delivered"
            />
          </div>
        </div>

        {/* Kitchen Stations Overview */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Kitchen Stations</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['grill', 'fry', 'salad', 'desserts', 'main'].map((station) => {
              const stationChefs = mockChefs.filter((c) => c.station === station);
              const busyChefs = stationChefs.filter((c) => c.status === 'busy');
              return (
                <div key={station} className="p-4 rounded-lg bg-muted/30 text-center">
                  <p className="text-sm font-medium text-foreground capitalize mb-1">{station}</p>
                  <p className="text-2xl font-bold text-primary">{busyChefs.length}</p>
                  <p className="text-xs text-muted-foreground">
                    of {stationChefs.length} active
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chef View */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">All Chefs</h2>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockChefs.map((chef) => (
                <StaffCard key={chef.id} staff={chef} />
              ))}
            </div>
          ) : (
            <StaffList staff={mockChefs} type="chef" />
          )}
        </div>

        {/* Create Chef Dialog */}
        <CreateChefDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </div>
    </MainLayout>
  );
};

export default ChefManagement;
