import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { OrdersSection } from '@/components/dashboard/OrdersSection';
import { mockDashboardMetrics } from '@/data/mockData';
import { ChefHat, Truck, Clock } from 'lucide-react';

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time overview of your restaurant operations</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-delivered/10 border border-status-delivered/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-delivered opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-delivered"></span>
            </span>
            <span className="text-sm font-medium text-status-delivered">Live</span>
          </div>
        </div>

        {/* Metrics Grid - Only 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Orders in Kitchen"
              value={mockDashboardMetrics.ordersInKitchen}
              icon={ChefHat}
              variant="kitchen"
              subtitle="Active cooking"
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Delivered Today"
              value={mockDashboardMetrics.ordersDeliveredToday}
              icon={Truck}
              variant="delivered"
              trend={{ value: 12, isPositive: true }}
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="New (Last Hour)"
              value={mockDashboardMetrics.newOrdersLastHour}
              icon={Clock}
              variant="new"
              subtitle="Awaiting processing"
            />
          </div>
        </div>

        {/* Orders Section */}
        <OrdersSection />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
