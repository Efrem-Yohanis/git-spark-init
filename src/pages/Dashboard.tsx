import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface MetricData {
  id: string;
  title: string;
  latestValue: number;
  previousValue: number;
  type: "daily" | "30d" | "90d";
}

const metricsConfig: MetricData[] = [
  { id: "daily-active-customers", title: "Daily Active Customers", latestValue: 217049, previousValue: 268610, type: "daily" },
  { id: "daily-gross-adds", title: "Daily Gross Adds", latestValue: 15234, previousValue: 14890, type: "daily" },
  { id: "daily-non-gross-adds", title: "Daily Non-Gross Adds", latestValue: 8921, previousValue: 9105, type: "daily" },
  { id: "30d-active-total", title: "30D Active Total", latestValue: 1250000, previousValue: 1235000, type: "30d" },
  { id: "30d-active-new", title: "30D Active New", latestValue: 125000, previousValue: 118500, type: "30d" },
  { id: "30d-active-existing", title: "30D Active Existing", latestValue: 1125000, previousValue: 1116500, type: "30d" },
  { id: "30d-active-transacting-total", title: "30D Active Transacting Total", latestValue: 890000, previousValue: 875000, type: "30d" },
  { id: "30d-active-new-txn", title: "30D Active New (txn)", latestValue: 89000, previousValue: 82000, type: "30d" },
  { id: "30d-active-existing-txn", title: "30D Active Existing (txn)", latestValue: 801000, previousValue: 793000, type: "30d" },
  { id: "90d-active-total", title: "90D Active Total", latestValue: 2450000, previousValue: 2420000, type: "90d" },
  { id: "90d-active-new", title: "90D Active New", latestValue: 245000, previousValue: 238000, type: "90d" },
  { id: "90d-active-existing", title: "90D Active Existing", latestValue: 2205000, previousValue: 2182000, type: "90d" },
  { id: "90d-active-transacting-total", title: "90D Active Transacting Total", latestValue: 1780000, previousValue: 1750000, type: "90d" },
  { id: "90d-active-new-txn", title: "90D Active New (txn)", latestValue: 178000, previousValue: 170000, type: "90d" },
  { id: "90d-active-existing-txn", title: "90D Active Existing (txn)", latestValue: 1602000, previousValue: 1580000, type: "90d" },
  { id: "daily-app-downloads", title: "Daily App Downloads", latestValue: 5230, previousValue: 4890, type: "daily" },
  { id: "30d-active-app-users", title: "30D Active App Users", latestValue: 450000, previousValue: 442000, type: "30d" },
  { id: "30d-app-transacting", title: "30D App Transacting", latestValue: 320000, previousValue: 315000, type: "30d" },
  { id: "daily-active-micro-merchants", title: "Daily Active Micro Merchants", latestValue: 12500, previousValue: 12200, type: "daily" },
  { id: "30d-active-micro-merchants", title: "30D Active Micro Merchants", latestValue: 85000, previousValue: 83500, type: "30d" },
  { id: "daily-active-unified-merchants", title: "Daily Active Unified Merchants", latestValue: 3200, previousValue: 3150, type: "daily" },
  { id: "30d-active-unified-merchants", title: "30D Active Unified Merchants", latestValue: 22000, previousValue: 21500, type: "30d" },
  { id: "daily-topup", title: "Daily Topup", latestValue: 45000000, previousValue: 43500000, type: "daily" },
  { id: "30d-topup", title: "30D Topup", latestValue: 1350000000, previousValue: 1320000000, type: "30d" },
];

const typeColors = {
  daily: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
  "30d": "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
  "90d": "from-violet-500/20 to-violet-600/5 border-violet-500/30",
};

const typeAccents = {
  daily: "text-blue-600 dark:text-blue-400",
  "30d": "text-emerald-600 dark:text-emerald-400",
  "90d": "text-violet-600 dark:text-violet-400",
};

const typeBadgeColors = {
  daily: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "30d": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "90d": "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

function getChangeInfo(value: number, previousValue: number) {
  const difference = value - previousValue;
  const percentChange = previousValue !== 0 ? (difference / previousValue) * 100 : null;
  
  if (difference > 0) {
    return { icon: TrendingUp, trend: "up" as const, difference, percentChange };
  } else if (difference < 0) {
    return { icon: TrendingDown, trend: "down" as const, difference, percentChange };
  }
  return { icon: Minus, trend: "neutral" as const, difference, percentChange };
}

interface MetricCardProps {
  metric: MetricData;
  onClick: () => void;
}

function MetricCard({ metric, onClick }: MetricCardProps) {
  const { icon: TrendIcon, trend, difference, percentChange } = getChangeInfo(metric.latestValue, metric.previousValue);
  
  const formatDifference = (diff: number) => {
    const sign = diff > 0 ? "+" : "";
    return `${sign}${diff.toLocaleString()}`;
  };
  
  const formatPercent = (percent: number | null) => {
    if (percent === null) return "—";
    const sign = percent > 0 ? "+" : "";
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
        "bg-gradient-to-br border",
        typeColors[metric.type]
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xs font-medium text-muted-foreground leading-tight line-clamp-2 min-h-[2rem]">
            {metric.title}
          </CardTitle>
          <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase shrink-0", typeBadgeColors[metric.type])}>
            {metric.type === "daily" ? "D" : metric.type === "30d" ? "30D" : "90D"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-3 px-4">
        <div className="space-y-1">
          <p className={cn("text-xl font-bold", typeAccents[metric.type])}>
            {metric.latestValue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5">
            <TrendIcon 
              className={cn(
                "h-3.5 w-3.5",
                trend === "up" && "text-emerald-500",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-muted-foreground"
              )}
            />
            <span 
              className={cn(
                "text-xs font-medium",
                trend === "up" && "text-emerald-500",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {formatDifference(difference)} ({formatPercent(percentChange)})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  }, []);

  const handleCardClick = (metricId: string) => {
    navigate(`/metric/${metricId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Metrics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Last Updated: {format(lastUpdated, "MMM dd, yyyy HH:mm:ss")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsConfig.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            onClick={() => handleCardClick(metric.id)}
          />
        ))}
      </div>
    </div>
  );
}
