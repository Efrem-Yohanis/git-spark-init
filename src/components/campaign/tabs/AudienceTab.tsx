import { useState } from "react";
import { Search, Download, Users, Activity, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const mockAudienceData = [
  { msisdn: "2519****1234", valueTier: "High", status: "Active", churnRisk: "Low", rewardStatus: "Received" },
  { msisdn: "2519****5678", valueTier: "High", status: "Active", churnRisk: "Low", rewardStatus: "Received" },
  { msisdn: "2519****9012", valueTier: "Medium", status: "Active", churnRisk: "Medium", rewardStatus: "Received" },
  { msisdn: "2519****3456", valueTier: "High", status: "Active", churnRisk: "Low", rewardStatus: "Failed" },
  { msisdn: "2519****7890", valueTier: "Medium", status: "Dormant", churnRisk: "High", rewardStatus: "NA" },
  { msisdn: "2519****2345", valueTier: "Low", status: "Active", churnRisk: "Medium", rewardStatus: "Received" },
  { msisdn: "2519****6789", valueTier: "High", status: "Active", churnRisk: "Low", rewardStatus: "Received" },
  { msisdn: "2519****0123", valueTier: "Medium", status: "Active", churnRisk: "Low", rewardStatus: "Received" },
  { msisdn: "2519****4567", valueTier: "Low", status: "Dormant", churnRisk: "High", rewardStatus: "NA" },
  { msisdn: "2519****8901", valueTier: "High", status: "Active", churnRisk: "Low", rewardStatus: "Received" },
];

const getValueTierColor = (tier: string) => {
  switch (tier) {
    case "High":
      return "bg-success/10 text-success border-success/20";
    case "Medium":
      return "bg-warning/10 text-warning border-warning/20";
    case "Low":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success border-success/20";
    case "Dormant":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getChurnRiskColor = (risk: string) => {
  switch (risk) {
    case "Low":
      return "bg-success/10 text-success border-success/20";
    case "Medium":
      return "bg-warning/10 text-warning border-warning/20";
    case "High":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getRewardStatusColor = (status: string) => {
  switch (status) {
    case "Received":
      return "bg-success/10 text-success border-success/20";
    case "Failed":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "NA":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function AudienceTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const audienceSummary = {
    total: 45000,
    active: 38250,
    dormant: 6750,
    highValue: 18000,
    mediumValue: 15750,
    lowValue: 11250,
  };

  return (
    <div className="space-y-6">
      {/* Audience Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <p className="text-xl font-bold">{audienceSummary.total.toLocaleString()}</p>
        </div>
        <div className="bg-card border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
          <p className="text-xl font-bold">{audienceSummary.active.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{((audienceSummary.active / audienceSummary.total) * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-card border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-destructive" />
            <span className="text-xs text-muted-foreground">Dormant</span>
          </div>
          <p className="text-xl font-bold">{audienceSummary.dormant.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{((audienceSummary.dormant / audienceSummary.total) * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-card border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground">High Value</span>
          </div>
          <p className="text-xl font-bold">{audienceSummary.highValue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{((audienceSummary.highValue / audienceSummary.total) * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-card border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-warning" />
            <span className="text-xs text-muted-foreground">Medium Value</span>
          </div>
          <p className="text-xl font-bold">{audienceSummary.mediumValue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{((audienceSummary.mediumValue / audienceSummary.total) * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-card border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Low Value</span>
          </div>
          <p className="text-xl font-bold">{audienceSummary.lowValue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{((audienceSummary.lowValue / audienceSummary.total) * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Search and Export */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by MSISDN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Audience
        </Button>
      </div>

      {/* Customer Table */}
      <div className="bg-card border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">MSISDN</TableHead>
              <TableHead className="font-semibold">Value Tier</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Churn Risk</TableHead>
              <TableHead className="font-semibold">Reward Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAudienceData.map((customer, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono">{customer.msisdn}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", getValueTierColor(customer.valueTier))}>
                    {customer.valueTier}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", getStatusColor(customer.status))}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", getChurnRiskColor(customer.churnRisk))}>
                    {customer.churnRisk}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", getRewardStatusColor(customer.rewardStatus))}>
                    {customer.rewardStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Showing 10 of 45,000 customers. Export to view full list.
      </p>
    </div>
  );
}
