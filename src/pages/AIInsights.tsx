import { Brain, TrendingUp, AlertTriangle, Target, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const insights = [
  {
    id: 1,
    segment: "High Value Dormant 45 Days",
    churnProbability: 78,
    customerCount: 12400,
    recommendedAction: "Win-back Campaign with 20% Bonus",
    bestChannel: "SMS + USSD Push",
    suggestedReward: "KES 50 Cashback",
    expectedUplift: 35,
    priority: "high",
  },
  {
    id: 2,
    segment: "New Users First Week",
    churnProbability: 45,
    customerCount: 8900,
    recommendedAction: "Onboarding Journey + Reward",
    bestChannel: "Push Notification",
    suggestedReward: "KES 20 Bonus",
    expectedUplift: 52,
    priority: "medium",
  },
  {
    id: 3,
    segment: "Declining Transaction Users",
    churnProbability: 62,
    customerCount: 23500,
    recommendedAction: "Loyalty Tier Upgrade Offer",
    bestChannel: "SMS",
    suggestedReward: "Tier Points Multiplier",
    expectedUplift: 28,
    priority: "high",
  },
  {
    id: 4,
    segment: "Sunday Low Activity",
    churnProbability: 35,
    customerCount: 156000,
    recommendedAction: "Sunday Special Promotion",
    bestChannel: "App Push",
    suggestedReward: "Weekend Bonus",
    expectedUplift: 18,
    priority: "low",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium":
      return "bg-warning/10 text-warning border-warning/20";
    case "low":
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getChurnColor = (probability: number) => {
  if (probability >= 70) return "text-destructive";
  if (probability >= 50) return "text-warning";
  return "text-success";
};

export default function AIInsights() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-primary">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Insights</h1>
            <p className="text-muted-foreground">AI-powered recommendations for customer engagement</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Refresh Insights
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Churn Risk</p>
                <p className="text-3xl font-bold text-destructive">35.9K</p>
                <p className="text-sm text-muted-foreground mt-1">customers identified</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-destructive/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/20 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth Opportunity</p>
                <p className="text-3xl font-bold text-success">156K</p>
                <p className="text-sm text-muted-foreground mt-1">activation potential</p>
              </div>
              <TrendingUp className="w-12 h-12 text-success/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-info/20 bg-info/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expected ROI</p>
                <p className="text-3xl font-bold text-info">320%</p>
                <p className="text-sm text-muted-foreground mt-1">if recommendations applied</p>
              </div>
              <Target className="w-12 h-12 text-info/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insight Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recommended Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{insight.segment}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.customerCount.toLocaleString()} customers
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("font-medium", getPriorityColor(insight.priority))}>
                    {insight.priority} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Churn Probability */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Churn Probability</span>
                    <span className={cn("font-bold", getChurnColor(insight.churnProbability))}>
                      {insight.churnProbability}%
                    </span>
                  </div>
                  <Progress 
                    value={insight.churnProbability} 
                    className={cn(
                      "h-2",
                      insight.churnProbability >= 70 ? "[&>div]:bg-destructive" :
                      insight.churnProbability >= 50 ? "[&>div]:bg-warning" : "[&>div]:bg-success"
                    )}
                  />
                </div>

                {/* Recommendation Details */}
                <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recommended Action</span>
                    <span className="font-medium">{insight.recommendedAction}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Best Channel</span>
                    <span className="font-medium">{insight.bestChannel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Suggested Reward</span>
                    <span className="font-medium">{insight.suggestedReward}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expected Uplift</span>
                    <span className="font-medium text-success">+{insight.expectedUplift}%</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full gap-2">
                  Create Campaign from Insight
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
