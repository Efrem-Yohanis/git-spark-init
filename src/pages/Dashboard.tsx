import { Users, UserCheck, UserMinus, Megaphone, Wallet, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { CampaignPerformance } from "@/components/dashboard/CampaignPerformance";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import { ChurnRiskWidget } from "@/components/dashboard/ChurnRiskWidget";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter } from "lucide-react";

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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="nairobi">Nairobi</SelectItem>
              <SelectItem value="mombasa">Mombasa</SelectItem>
              <SelectItem value="kisumu">Kisumu</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Total Customers"
          value="2.4M"
          change={5.2}
          changeLabel="from last month"
          icon={<Users className="w-5 h-5 text-accent-foreground" />}
        />
        <MetricCard
          title="Active (7 days)"
          value="1.8M"
          change={3.1}
          changeLabel="from last week"
          icon={<UserCheck className="w-5 h-5 text-accent-foreground" />}
        />
        <MetricCard
          title="Dormant (30+ days)"
          value="420K"
          change={-2.4}
          changeLabel="from last month"
          icon={<UserMinus className="w-5 h-5 text-accent-foreground" />}
        />
        <MetricCard
          title="Campaigns Running"
          value="12"
          icon={<Megaphone className="w-5 h-5 text-accent-foreground" />}
        />
        <MetricCard
          title="Reward Balance"
          value="KES 4.2M"
          change={-15}
          changeLabel="usage rate up"
          icon={<Wallet className="w-5 h-5 text-accent-foreground" />}
        />
        <MetricCard
          title="Activation Rate"
          value="68%"
          change={8.3}
          changeLabel="improvement"
          icon={<TrendingUp className="w-5 h-5 text-accent-foreground" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityChart />
        <ChurnRiskWidget />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignPerformance />
        <RecentCampaigns />
      </div>
    </div>
  );
}
