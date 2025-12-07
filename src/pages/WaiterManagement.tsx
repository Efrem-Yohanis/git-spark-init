import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StaffCard } from '@/components/staff/StaffCard';
import { StaffList } from '@/components/staff/StaffList';
import { CreateStaffDialog } from '@/components/staff/CreateStaffDialog';
import { mockWaiters } from '@/data/mockData';
import { Users, TrendingUp, DollarSign, Star, LayoutGrid, List, Plus } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const WaiterManagement = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const totalOrders = mockWaiters.reduce((acc, w) => acc + w.ordersServedToday, 0);
  const avgRating = mockWaiters.reduce((acc, w) => acc + w.rating, 0) / mockWaiters.length;
  const totalTips = mockWaiters.reduce((acc, w) => acc + w.tipsToday, 0);
  const activeWaiters = mockWaiters.filter((w) => w.status !== 'offline').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Waiter Management</h1>
            <p className="text-muted-foreground mt-1">Monitor waitstaff performance and assignments</p>
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
              Add Waiter
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Active Waiters"
              value={activeWaiters}
              icon={Users}
              subtitle={`of ${mockWaiters.length} total`}
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Orders Served Today"
              value={totalOrders}
              icon={TrendingUp}
              trend={{ value: 15, isPositive: true }}
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Team Avg Rating"
              value={avgRating.toFixed(1)}
              icon={Star}
              variant="pending"
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Total Tips Today"
              value={`$${totalTips.toFixed(0)}`}
              icon={DollarSign}
              variant="delivered"
            />
          </div>
        </div>

        {/* Waiter View */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">All Waiters</h2>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockWaiters.map((waiter) => (
                <StaffCard key={waiter.id} staff={waiter} />
              ))}
            </div>
          ) : (
            <StaffList staff={mockWaiters} type="waiter" />
          )}
        </div>

        {/* Create Waiter Dialog */}
        <CreateStaffDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          type="waiter"
        />
      </div>
    </MainLayout>
  );
};

export default WaiterManagement;
