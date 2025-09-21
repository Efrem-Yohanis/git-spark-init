import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Stream Data - Professional Dashboard
const streamsData = [
  {
    id: "stream-001",
    name: "SFC_ETH_6D_BSS_TO_NOKIA_DWH_STREAM",
    errors: 22067,
    warnings: 0,
    instances: 1,
    status: "RUNNING",
    uptime: "14d 8h 23m",
    lastActivity: "2 seconds ago",
    throughput: "3.2K/sec"
  },
  {
    id: "stream-002", 
    name: "SFC_ETH_COLLAB_TO_DWH_STREAM",
    errors: 0,
    warnings: 12,
    instances: 1,
    status: "STOPPED",
    uptime: "0h",
    lastActivity: "45 minutes ago",
    throughput: "0/sec"
  },
  {
    id: "stream-003",
    name: "BILLING_MEDIATION_CORE_STREAM",
    errors: 156,
    warnings: 89,
    instances: 1,
    status: "PARTIAL",
    uptime: "6d 12h 45m",
    lastActivity: "1 second ago",
    throughput: "1.8K/sec"
  },
  {
    id: "stream-004",
    name: "CDR_PROCESSING_MAIN_STREAM",
    errors: 8,
    warnings: 156,
    instances: 1,
    status: "RUNNING",
    uptime: "22d 3h 12m",
    lastActivity: "1 second ago",
    throughput: "5.6K/sec"
  },
  {
    id: "stream-005",
    name: "NETWORK_EVENTS_COLLECTOR_STREAM",
    errors: 0,
    warnings: 3,
    instances: 1,
    status: "RUNNING",
    uptime: "8d 15h 32m",
    lastActivity: "3 seconds ago",
    throughput: "2.1K/sec"
  }
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    const variant = status === "RUNNING" ? "default" :
                   status === "PARTIAL" ? "secondary" : 
                   "destructive";
    
    return (
      <Badge variant={variant} className="text-xs font-medium">
        {status}
      </Badge>
    );
  };

  const totalErrors = streamsData.reduce((sum, stream) => sum + stream.errors, 0);
  const totalWarnings = streamsData.reduce((sum, stream) => sum + stream.warnings, 0);
  const runningStreams = streamsData.filter(stream => stream.status === "RUNNING").length;
  const stoppedStreams = streamsData.filter(stream => stream.status === "STOPPED").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Monitor and manage your data streams</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {currentTime.toLocaleTimeString()}
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Key Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Active Streams</p>
                  <div className="text-3xl font-bold text-success mt-2">{runningStreams}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((runningStreams / streamsData.length) * 100).toFixed(1)}% operational
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Critical Issues</p>
                  <div className="text-3xl font-bold text-destructive mt-2">{totalErrors.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across {streamsData.filter(s => s.errors > 0).length} streams
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Warnings</p>
                  <div className="text-3xl font-bold text-warning mt-2">{totalWarnings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requires attention
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Throughput</p>
                  <div className="text-3xl font-bold text-primary mt-2">12.7K/s</div>
                  <p className="text-xs text-success mt-1">
                    +15% from last hour
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stream Management Section */}
        <Card className="professional-card">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Stream Management
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor and control your data processing streams
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <select 
                  className="h-10 border border-input bg-background px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  defaultValue="all"
                >
                  <option value="all">All Status</option>
                  <option value="RUNNING">Running</option>
                  <option value="STOPPED">Stopped</option>
                  <option value="PARTIAL">Partial</option>
                </select>
                <input
                  type="text"
                  placeholder="Search streams..."
                  className="h-10 w-full sm:w-64 border border-input bg-background px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left font-semibold text-muted-foreground px-6 py-4 text-xs uppercase tracking-wider">
                      Stream Details
                    </th>
                    <th className="text-left font-semibold text-muted-foreground px-6 py-4 text-xs uppercase tracking-wider">
                      Health Status
                    </th>
                    <th className="text-left font-semibold text-muted-foreground px-6 py-4 text-xs uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="text-left font-semibold text-muted-foreground px-6 py-4 text-xs uppercase tracking-wider">
                      Uptime
                    </th>
                    <th className="text-right font-semibold text-muted-foreground px-6 py-4 text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {streamsData.map((stream) => (
                    <tr 
                      key={stream.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${
                            stream.status === 'RUNNING' ? 'bg-success animate-pulse' : 
                            stream.status === 'PARTIAL' ? 'bg-warning' : 'bg-muted'
                          }`} />
                          <div>
                            <div 
                              className="font-semibold text-foreground hover:text-primary cursor-pointer transition-colors"
                              onClick={() => navigate(`/streams/${stream.id}`)}
                            >
                              {stream.name}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Instance {stream.instances} • Last activity: {stream.lastActivity}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          {getStatusBadge(stream.status)}
                          <div className="flex items-center gap-3 text-sm">
                            {stream.errors > 0 && (
                              <span className="flex items-center gap-1 text-destructive">
                                <XCircle className="h-3 w-3" />
                                {stream.errors.toLocaleString()} errors
                              </span>
                            )}
                            {stream.warnings > 0 && (
                              <span className="flex items-center gap-1 text-warning">
                                <AlertTriangle className="h-3 w-3" />
                                {stream.warnings} warnings
                              </span>
                            )}
                            {stream.errors === 0 && stream.warnings === 0 && (
                              <span className="flex items-center gap-1 text-success">
                                <CheckCircle className="h-3 w-3" />
                                Healthy
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            <span className="font-medium text-foreground">{stream.throughput}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Processing rate
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-foreground">{stream.uptime}</div>
                        <div className="text-xs text-muted-foreground">Continuous operation</div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/streams/${stream.id}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing <span className="font-medium">{streamsData.length}</span> streams</span>
                <span>•</span>
                <span className="text-success">{runningStreams} active</span>
                <span>•</span>
                <span className="text-muted-foreground">{stoppedStreams} stopped</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Auto-refresh: 30s
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}