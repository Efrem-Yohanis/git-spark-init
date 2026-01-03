import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Gift, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const campaigns = [
  {
    id: 1,
    name: "Festive Season Rewards",
    type: "Incentive",
    status: "Running",
    targeted: 45000,
    delivered: 42300,
    icon: Gift,
  },
  {
    id: 2,
    name: "Win-back December",
    type: "Win-back",
    status: "Running",
    targeted: 28000,
    delivered: 25600,
    icon: RefreshCw,
  },
  {
    id: 3,
    name: "Transaction Alert",
    type: "Info",
    status: "Completed",
    targeted: 150000,
    delivered: 148500,
    icon: MessageSquare,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Running":
      return "bg-success/10 text-success border-success/20";
    case "Completed":
      return "bg-info/10 text-info border-info/20";
    case "Scheduled":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function RecentCampaigns() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Campaigns</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View all <ArrowRight className="ml-1 w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const Icon = campaign.icon;
            return (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-accent">
                    <Icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.delivered.toLocaleString()} / {campaign.targeted.toLocaleString()} delivered
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={cn("font-medium", getStatusColor(campaign.status))}>
                    {campaign.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
