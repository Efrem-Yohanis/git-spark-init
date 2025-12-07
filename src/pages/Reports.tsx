import { MainLayout } from '@/components/layout/MainLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Users, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/dashboard/MetricCard';

const weeklyData = [
  { day: 'Mon', orders: 145, revenue: 8420 },
  { day: 'Tue', orders: 132, revenue: 7650 },
  { day: 'Wed', orders: 168, revenue: 9820 },
  { day: 'Thu', orders: 178, revenue: 10450 },
  { day: 'Fri', orders: 215, revenue: 13200 },
  { day: 'Sat', orders: 245, revenue: 15800 },
  { day: 'Sun', orders: 198, revenue: 12100 },
];

const monthlyTrend = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 45000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 52000 },
  { month: 'May', revenue: 58000 },
  { month: 'Jun', revenue: 62000 },
];

const menuPopularity = [
  { name: 'Grilled Salmon', orders: 245, color: 'hsl(35, 100%, 55%)' },
  { name: 'Ribeye Steak', orders: 198, color: 'hsl(142, 76%, 45%)' },
  { name: 'Margherita Pizza', orders: 176, color: 'hsl(217, 91%, 60%)' },
  { name: 'Caesar Salad', orders: 154, color: 'hsl(280, 80%, 60%)' },
  { name: 'Tiramisu', orders: 132, color: 'hsl(45, 100%, 55%)' },
];

const Reports = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Business intelligence and decision support</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-border">
              <Calendar className="h-4 w-4" />
              This Week
            </Button>
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Weekly Revenue"
            value="$77,440"
            icon={DollarSign}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Weekly Orders"
            value="1,281"
            icon={BarChart3}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Avg Order Value"
            value="$60.45"
            icon={TrendingUp}
            variant="delivered"
          />
          <MetricCard
            title="Unique Customers"
            value="892"
            icon={Users}
            variant="pending"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Orders */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Orders</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="orders" fill="hsl(35, 100%, 55%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend (6 Months)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="revenueLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(142, 76%, 45%)"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(142, 76%, 45%)', strokeWidth: 2 }}
                    fill="url(#revenueLine)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Popularity */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Menu Items</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={menuPopularity}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="orders"
                  >
                    {menuPopularity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {menuPopularity.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.orders}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Revenue */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">Daily Revenue Breakdown</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <defs>
                    <linearGradient id="revenueBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="url(#revenueBar)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
