import { Plug, CheckCircle, AlertCircle, Clock, RefreshCw, Settings, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const integrations = [
  {
    id: 1,
    name: "M-Pesa Core API",
    description: "Transaction and customer data feed",
    status: "Connected",
    lastSync: "2024-01-15 14:45:32",
    health: 100,
    type: "Data Feed",
  },
  {
    id: 2,
    name: "SMS Gateway (Africa's Talking)",
    description: "Outbound SMS messaging",
    status: "Connected",
    lastSync: "2024-01-15 14:44:12",
    health: 98,
    type: "Messaging",
  },
  {
    id: 3,
    name: "USSD Gateway",
    description: "Push USSD messaging",
    status: "Connected",
    lastSync: "2024-01-15 14:43:00",
    health: 100,
    type: "Messaging",
  },
  {
    id: 4,
    name: "App Push (Firebase)",
    description: "Mobile app notifications",
    status: "Warning",
    lastSync: "2024-01-15 12:30:00",
    health: 75,
    type: "Messaging",
  },
  {
    id: 5,
    name: "Email Service (SendGrid)",
    description: "Email communications",
    status: "Connected",
    lastSync: "2024-01-15 14:40:00",
    health: 100,
    type: "Messaging",
  },
  {
    id: 6,
    name: "Reward Engine",
    description: "Incentive posting system",
    status: "Connected",
    lastSync: "2024-01-15 14:42:00",
    health: 100,
    type: "Reward",
  },
];

const recentLogs = [
  { id: 1, time: "14:45:32", level: "info", message: "Data sync completed - 45,230 records processed" },
  { id: 2, time: "14:44:12", level: "info", message: "SMS batch delivered - 12,500 messages sent" },
  { id: 3, time: "14:30:00", level: "warning", message: "Firebase connection latency high - 850ms" },
  { id: 4, time: "14:15:00", level: "error", message: "Push notification retry failed for batch #4521" },
  { id: 5, time: "14:00:00", level: "info", message: "Hourly health check passed - all systems nominal" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Connected":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "Warning":
      return <AlertCircle className="w-4 h-4 text-warning" />;
    case "Error":
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Connected":
      return "bg-success/10 text-success border-success/20";
    case "Warning":
      return "bg-warning/10 text-warning border-warning/20";
    case "Error":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getHealthColor = (health: number) => {
  if (health >= 90) return "[&>div]:bg-success";
  if (health >= 70) return "[&>div]:bg-warning";
  return "[&>div]:bg-destructive";
};

const getLogLevelColor = (level: string) => {
  switch (level) {
    case "info":
      return "text-info";
    case "warning":
      return "text-warning";
    case "error":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};

export default function Integrations() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Plug className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Integrations</h1>
            <p className="text-muted-foreground">Monitor and manage system connections</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Sync All
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-success/20 bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-3xl font-bold text-success">5</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-3xl font-bold text-warning">1</p>
              </div>
              <AlertCircle className="w-8 h-8 text-warning/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <AlertCircle className="w-8 h-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Health</p>
                <p className="text-3xl font-bold text-success">96%</p>
              </div>
              <Plug className="w-8 h-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integration List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Connected Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        <p className="font-semibold">{integration.name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className={cn("font-medium", getStatusColor(integration.status))}>
                        {integration.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Sync</span>
                      <span className="font-medium">{integration.lastSync}</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Health</span>
                        <span className="font-medium">{integration.health}%</span>
                      </div>
                      <Progress value={integration.health} className={cn("h-2", getHealthColor(integration.health))} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <span className="text-muted-foreground font-mono">{log.time}</span>
                  <span className={cn("font-medium uppercase text-xs", getLogLevelColor(log.level))}>
                    [{log.level}]
                  </span>
                  <span className="text-muted-foreground flex-1">{log.message}</span>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-4 p-0 h-auto gap-1">
              View all logs <ExternalLink className="w-3 h-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
