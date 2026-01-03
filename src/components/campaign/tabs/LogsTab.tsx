import { useState } from "react";
import { Download, Clock, User, AlertCircle, CheckCircle, Pause, Play, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const systemLogs = [
  { timestamp: "2024-01-15 10:00:00", type: "info", message: "Campaign started successfully" },
  { timestamp: "2024-01-15 10:05:23", type: "info", message: "Batch 1 of 10 messages sent (4,500 SMS)" },
  { timestamp: "2024-01-15 10:10:45", type: "info", message: "Batch 2 of 10 messages sent (4,420 SMS)" },
  { timestamp: "2024-01-15 10:15:12", type: "warning", message: "High delivery failure rate detected (4.2%)" },
  { timestamp: "2024-01-15 10:20:33", type: "info", message: "Batch 3 of 10 messages sent (4,380 SMS)" },
  { timestamp: "2024-01-15 10:25:01", type: "error", message: "SMS gateway timeout - retrying batch 4" },
  { timestamp: "2024-01-15 10:26:45", type: "info", message: "Batch 4 retry successful" },
  { timestamp: "2024-01-15 10:30:00", type: "info", message: "Reward disbursement started" },
  { timestamp: "2024-01-15 10:35:22", type: "warning", message: "Reward account balance below 50%" },
  { timestamp: "2024-01-15 10:40:00", type: "info", message: "Daily message cap reached - pausing until tomorrow" },
];

const auditTrail = [
  { timestamp: "2024-01-01 09:00:00", user: "Sarah M.", action: "Campaign Created", details: "Initial draft created" },
  { timestamp: "2024-01-01 11:30:00", user: "Sarah M.", action: "Configuration Updated", details: "Updated reward value from 5 ETB to 10 ETB" },
  { timestamp: "2024-01-01 14:00:00", user: "John K.", action: "Campaign Approved", details: "Approved for launch" },
  { timestamp: "2024-01-01 15:00:00", user: "System", action: "Campaign Activated", details: "Scheduled for Jan 15, 2024" },
  { timestamp: "2024-01-15 10:00:00", user: "System", action: "Campaign Started", details: "Auto-triggered by schedule" },
  { timestamp: "2024-01-16 08:00:00", user: "Sarah M.", action: "Campaign Paused", details: "Paused for message review" },
  { timestamp: "2024-01-16 10:30:00", user: "Sarah M.", action: "Campaign Resumed", details: "Review completed" },
];

const getLogTypeIcon = (type: string) => {
  switch (type) {
    case "info":
      return CheckCircle;
    case "warning":
      return AlertCircle;
    case "error":
      return AlertCircle;
    default:
      return FileText;
  }
};

const getLogTypeColor = (type: string) => {
  switch (type) {
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

const getActionIcon = (action: string) => {
  if (action.includes("Paused")) return Pause;
  if (action.includes("Resumed") || action.includes("Started")) return Play;
  return FileText;
};

export function LogsTab() {
  const [activeTab, setActiveTab] = useState("system");

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="system" className="data-[state=active]:bg-background">
            System Logs
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-background">
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="mt-4">
          <div className="bg-card border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold w-48">Timestamp</TableHead>
                  <TableHead className="font-semibold w-24">Type</TableHead>
                  <TableHead className="font-semibold">Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemLogs.map((log, index) => {
                  const Icon = getLogTypeIcon(log.type);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {log.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4", getLogTypeColor(log.type))} />
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "font-medium capitalize",
                              log.type === "info" && "bg-info/10 text-info border-info/20",
                              log.type === "warning" && "bg-warning/10 text-warning border-warning/20",
                              log.type === "error" && "bg-destructive/10 text-destructive border-destructive/20"
                            )}
                          >
                            {log.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <div className="bg-card border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold w-48">Timestamp</TableHead>
                  <TableHead className="font-semibold w-32">User</TableHead>
                  <TableHead className="font-semibold w-48">Action</TableHead>
                  <TableHead className="font-semibold">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditTrail.map((entry, index) => {
                  const Icon = getActionIcon(entry.action);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {entry.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{entry.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" />
                          {entry.action}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{entry.details}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
