import { Users, UserCheck, UserPlus, TrendingDown, Moon } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { CampaignPerformance } from "@/components/dashboard/CampaignPerformance";
import { ChurnRiskWidget } from "@/components/dashboard/ChurnRiskWidget";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of customer engagement metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="7d">
            <SelectTrigger className="w-40 rounded-none">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard
          title="Total Customers"
          value="2.4M"
          change={5.2}
          changeLabel="from last month"
          icon={<Users className="w-5 h-5 text-accent-foreground" />}
          className="rounded-none"
        />
        <MetricCard
          title="Active Customers"
          value="1.8M"
          change={3.1}
          changeLabel="from last week"
          icon={<UserCheck className="w-5 h-5 text-accent-foreground" />}
          className="rounded-none"
        />
        <MetricCard
          title="New Registered"
          value="52K"
          change={12.5}
          changeLabel="from last month"
          icon={<UserPlus className="w-5 h-5 text-accent-foreground" />}
          className="rounded-none"
        />
        <MetricCard
          title="Churner Rate"
          value="4.2%"
          change={-0.8}
          changeLabel="from last month"
          icon={<TrendingDown className="w-5 h-5 text-accent-foreground" />}
          className="rounded-none"
        />
        <MetricCard
          title="Dormant"
          value="420K"
          change={-2.4}
          changeLabel="from last month"
          icon={<Moon className="w-5 h-5 text-accent-foreground" />}
          className="rounded-none"
        />
      </div>

      {/* Full Width Activity Chart */}
      <ActivityChart />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignPerformance />
        <ChurnRiskWidget />
      </div>
    </div>
  );
}
