import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Wallet, 
  Download, 
  Users,
  MessageSquare,
  Gift,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

// Mock campaign assignment data (merged header + assignment summary)
const campaignData = {
  campaignName: "Festive Season Rewards",
  campaignId: "CMP-2024-001",
  status: "Active" as "Active" | "Completed" | "Stopped",
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  assignedSegment: "High Value Active",
  segmentSize: 45000,
  campaignObjective: "Activation",
  channelsUsed: ["SMS", "Push", "Email"],
  rewardType: "Cashback",
  rewardAccount: "Main Reward Pool",
  expectedOutcome: "Engagement & Conversion",
};

// Performance KPIs - removed Engagement Rate and ROI
const performanceKPIs = [
  { label: "Targeted Customers", value: 45000, icon: Users, color: "primary" },
  { label: "Reached Customers", value: 42300, icon: MessageSquare, color: "info" },
  { label: "Conversion Rate", value: "12.4%", icon: TrendingUp, color: "success" },
  { label: "Drop-off Rate", value: "31.5%", icon: XCircle, color: "destructive" },
  { label: "Avg TXN Increase", value: "+24%", icon: BarChart3, color: "info" },
];

// Channel performance data - removed engaged and converted
const channelPerformanceData = [
  { 
    channel: "SMS", 
    targeted: 45000, 
    sent: 44200, 
    delivered: 42300, 
    successRate: 94.1 
  },
  { 
    channel: "Push", 
    targeted: 38500, 
    sent: 37200, 
    delivered: 35200, 
    successRate: 91.4 
  },
  { 
    channel: "Email", 
    targeted: 42000, 
    sent: 41500, 
    delivered: 39800, 
    successRate: 94.8 
  },
];

// Reward utilization data
const rewardUtilization = {
  rewardAccount: "Main Reward Pool",
  openingBalance: 1500000,
  totalIssued: 385000,
  failedRewards: 12500,
  remainingBalance: 1102500,
};

// Single reward type as per most campaigns
const rewardDistribution = {
  type: "Cashback",
  count: 28900,
  amount: 289000,
};

// Daily trend data - showing targeted vs activated (back to activity)
const dailyTrendData = [
  { date: "Jan 1", targeted: 5000, activated: 2900 },
  { date: "Jan 2", targeted: 4500, activated: 2700 },
  { date: "Jan 3", targeted: 5200, activated: 3100 },
  { date: "Jan 4", targeted: 4800, activated: 2800 },
  { date: "Jan 5", targeted: 5500, activated: 3400 },
  { date: "Jan 6", targeted: 6000, activated: 3800 },
  { date: "Jan 7", targeted: 5800, activated: 3600 },
];

export function PerformanceTab() {
  const isRunning = campaignData.status === "Active";

  return (
    <div className="space-y-6">
      {/* Warning Banner for Running Campaign */}
      {isRunning && (
        <div className="bg-warning/10 border border-warning/20 p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <span className="text-warning font-medium">
            Campaign is still running. Data shown is real-time and may change.
          </span>
        </div>
      )}

      {/* Merged: Campaign Header + Assignment Summary */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">{campaignData.campaignName}</CardTitle>
              <Badge 
                className={cn(
                  campaignData.status === "Active" && "bg-success/10 text-success border-success/20",
                  campaignData.status === "Completed" && "bg-info/10 text-info border-info/20",
                  campaignData.status === "Stopped" && "bg-destructive/10 text-destructive border-destructive/20"
                )}
              >
                {campaignData.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <span className="text-sm text-muted-foreground">Campaign ID</span>
              <p className="font-medium">{campaignData.campaignId}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Campaign Period</span>
              <p className="font-medium">{campaignData.startDate} – {campaignData.endDate}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Assigned Segment</span>
              <p className="font-medium">{campaignData.assignedSegment}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Segment Size</span>
              <p className="font-medium">{campaignData.segmentSize.toLocaleString()} customers</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Campaign Objective</span>
              <p className="font-medium">{campaignData.campaignObjective}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Channels Used</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaignData.channelsUsed.map(channel => (
                  <Badge key={channel} variant="outline" className="text-xs">{channel}</Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Reward Type</span>
              <p className="font-medium">{campaignData.rewardType}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Reward Account</span>
              <p className="font-medium">{campaignData.rewardAccount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance KPIs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance KPIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {performanceKPIs.map((kpi) => (
              <div key={kpi.label} className="bg-muted/30 border p-4 text-center">
                <div className={cn(
                  "mx-auto w-10 h-10 flex items-center justify-center mb-2",
                  kpi.color === "primary" && "bg-primary/10",
                  kpi.color === "info" && "bg-info/10",
                  kpi.color === "warning" && "bg-warning/10",
                  kpi.color === "success" && "bg-success/10",
                  kpi.color === "destructive" && "bg-destructive/10"
                )}>
                  <kpi.icon className={cn(
                    "w-5 h-5",
                    kpi.color === "primary" && "text-primary",
                    kpi.color === "info" && "text-info",
                    kpi.color === "warning" && "text-warning",
                    kpi.color === "success" && "text-success",
                    kpi.color === "destructive" && "text-destructive"
                  )} />
                </div>
                <p className="text-xl font-bold">
                  {typeof kpi.value === "number" ? kpi.value.toLocaleString() : kpi.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Channel Performance - removed Engaged and Converted columns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Channel Performance
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Targeted</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead className="text-right">Success %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelPerformanceData.map((row) => (
                <TableRow key={row.channel}>
                  <TableCell className="font-medium">{row.channel}</TableCell>
                  <TableCell className="text-right">{row.targeted.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.sent.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.delivered.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={cn(
                      row.successRate >= 90 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    )}>
                      {row.successRate}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Daily Trend Chart - Targeted vs Activated (back to activity) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Daily Performance Trend (Targeted vs Activated)
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString(), ""]}
                  contentStyle={{ borderRadius: 0 }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="targeted" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Targeted"
                />
                <Line 
                  type="monotone" 
                  dataKey="activated" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Activated (Back to Activity)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Reward Utilization */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Reward Utilization
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-muted/30 border p-4">
              <p className="text-sm text-muted-foreground">Reward Account</p>
              <p className="font-semibold">{rewardUtilization.rewardAccount}</p>
            </div>
            <div className="bg-muted/30 border p-4">
              <p className="text-sm text-muted-foreground">Opening Balance</p>
              <p className="font-semibold">{rewardUtilization.openingBalance.toLocaleString()} ETB</p>
            </div>
            <div className="bg-muted/30 border p-4">
              <p className="text-sm text-muted-foreground">Total Issued</p>
              <p className="font-semibold text-success">{rewardUtilization.totalIssued.toLocaleString()} ETB</p>
            </div>
            <div className="bg-muted/30 border p-4">
              <p className="text-sm text-muted-foreground">Failed Rewards</p>
              <p className="font-semibold text-destructive">{rewardUtilization.failedRewards.toLocaleString()} ETB</p>
            </div>
            <div className="bg-muted/30 border p-4">
              <p className="text-sm text-muted-foreground">Remaining Balance</p>
              <p className="font-semibold">{rewardUtilization.remainingBalance.toLocaleString()} ETB</p>
            </div>
          </div>

          {/* Single Reward Type Distribution */}
          <div>
            <h4 className="font-medium mb-3">Reward Distribution</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reward Type</TableHead>
                  <TableHead className="text-right">Reward Receivers</TableHead>
                  <TableHead className="text-right">Total Amount (ETB)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{rewardDistribution.type}</TableCell>
                  <TableCell className="text-right">{rewardDistribution.count.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{rewardDistribution.amount.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
