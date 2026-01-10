import { TrendingUp, TrendingDown, UserPlus, Wallet, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SegmentKPIsProps {
  kpis: {
    activeRate: number;
    activeRateTrend: number;
    newUsers: number;
    newUsersPercent: number;
    highValue: number;
    mediumValue: number;
    lowValue: number;
    churnRiskCount: number;
    avgChurnProbability: number;
  };
  hideActiveRate?: boolean;
}

export function SegmentKPICards({ kpis, hideActiveRate = false }: SegmentKPIsProps) {
  return (
    <div className={cn(
      "grid gap-4",
      hideActiveRate 
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    )}>
      {/* Active Rate Card */}
      {!hideActiveRate && (
        <Card className="border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Rate</p>
                <p className="text-2xl font-bold">{kpis.activeRate}%</p>
                <div className="flex items-center gap-1 text-sm">
                  {kpis.activeRateTrend >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <span className={cn(
                    "font-medium",
                    kpis.activeRateTrend >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {kpis.activeRateTrend >= 0 ? "+" : ""}{kpis.activeRateTrend}%
                  </span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Newly Registered Users Card */}
      <Card className="border-l-4 border-l-info">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">New Users (30D)</p>
              <p className="text-2xl font-bold">{kpis.newUsers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {kpis.newUsersPercent}% of segment
              </p>
            </div>
            <div className="p-2 rounded-lg bg-info/10">
              <UserPlus className="w-5 h-5 text-info" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Value Distribution Card */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Value Distribution</p>
              <div className="space-y-1.5 mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span>High: {kpis.highValue}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span>Medium: {kpis.mediumValue}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                  <span>Low: {kpis.lowValue}%</span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Churn Risk Card */}
      <Card className="border-l-4 border-l-warning">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Churn Risk</p>
              <p className="text-2xl font-bold">{kpis.churnRiskCount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Avg probability: {(kpis.avgChurnProbability * 100).toFixed(0)}%
              </p>
            </div>
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
