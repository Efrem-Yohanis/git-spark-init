import { Users, Send, CheckCircle, Gift, Activity, Wallet, TrendingUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignKPIsProps {
  kpis: {
    targeted: number;
    sent: number;
    delivered: number;
    rewarded: number;
    activated: number;
    cost: number;
    roi: number;
  };
  isRunning?: boolean;
}

export function CampaignKPIs({ kpis, isRunning }: CampaignKPIsProps) {
  const kpiCards = [
    {
      label: "Targeted Customers",
      value: kpis.targeted.toLocaleString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Messages Sent",
      value: kpis.sent.toLocaleString(),
      icon: Send,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      label: "Delivered",
      value: kpis.delivered.toLocaleString(),
      subValue: `${((kpis.delivered / kpis.sent) * 100).toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Rewarded Customers",
      value: kpis.rewarded.toLocaleString(),
      subValue: `${((kpis.rewarded / kpis.targeted) * 100).toFixed(1)}%`,
      icon: Gift,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Activated Customers",
      value: kpis.activated.toLocaleString(),
      subValue: `${((kpis.activated / kpis.targeted) * 100).toFixed(1)}%`,
      icon: Activity,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Campaign Cost",
      value: `${kpis.cost.toLocaleString()} ETB`,
      icon: Wallet,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "ROI",
      value: `${kpis.roi}x`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Campaign Performance</h3>
        {isRunning && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Auto-refreshing
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-card border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className={cn("p-2", kpi.bgColor)}>
                <kpi.icon className={cn("w-4 h-4", kpi.color)} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              {kpi.subValue && (
                <p className="text-sm text-muted-foreground">{kpi.subValue}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
