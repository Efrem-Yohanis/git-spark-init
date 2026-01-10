import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Power, MoreVertical, RefreshCw, Plus, CheckCircle2, XCircle, Clock, Activity, Shield, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface ConfigSummary {
  configurationName: string;
  versionId: string;
  environment: string;
  status: "ACTIVE" | "INACTIVE" | "ERROR";
  createdBy: string;
  lastUpdated: string;
}

interface AuditInfo {
  createdBy: string;
  createdDate: string;
  lastUpdatedBy: string;
  lastUpdatedDate: string;
}

interface Connection {
  id: string;
  name: string;
  environment: "PROD" | "UAT" | "Sandbox";
  status: "Connected" | "Failed" | "Disabled";
  endpoint?: string;
  lastTested?: string;
}

interface Version {
  version: string;
  status: "Active" | "Deprecated";
  releaseNotes: string;
  activatedOn: string;
}

interface LogEntry {
  timestamp: string;
  connectionName: string;
  requestId: string;
  statusCode: number;
  errorMessage?: string;
}

interface HealthInfo {
  uptime: string;
  lastSuccessfulCall: string;
  errorRate24h: string;
}

interface Permission {
  role: string;
  level: "View" | "Edit" | "Admin";
}

interface ConfigDetailLayoutProps {
  serviceName: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | "ERROR";
  summary: ConfigSummary;
  audit: AuditInfo;
  children: ReactNode;
  // New props for enhanced UI
  connections?: Connection[];
  versions?: Version[];
  logs?: LogEntry[];
  health?: HealthInfo;
  permissions?: Permission[];
  supportsMultipleConnections?: boolean;
  serviceType?: "api" | "smsc" | "ussd" | "email" | "database" | "push" | "ivr" | "reward";
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
  onTestConnection?: (connectionId?: string) => void;
  onAddConnection?: () => void;
}

export function ConfigDetailLayout({
  serviceName,
  description,
  status,
  summary,
  audit,
  children,
  connections = [],
  versions = [],
  logs = [],
  health,
  permissions = [],
  supportsMultipleConnections = false,
  serviceType,
  onEdit,
  onDelete,
  onActivate,
  onTestConnection,
  onAddConnection,
}: ConfigDetailLayoutProps) {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(status === "ACTIVE");

  const handleToggleService = () => {
    setIsEnabled(!isEnabled);
    toast.success(`Service ${!isEnabled ? "enabled" : "disabled"}`);
  };

  const handleTestConnection = (connectionId?: string) => {
    if (onTestConnection) {
      onTestConnection(connectionId);
    } else {
      toast.success("Connection test successful", {
        description: "Response time: 45ms",
      });
    }
  };

  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "active":
      case "connected":
        return "bg-success/10 text-success border-success/20";
      case "inactive":
      case "disabled":
      case "deprecated":
        return "bg-muted text-muted-foreground";
      case "error":
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer" onClick={() => navigate("/configuration")}>
          Settings
        </span>
        <span className="mx-2">›</span>
        <span className="hover:text-foreground cursor-pointer" onClick={() => navigate("/configuration")}>
          Connected Services
        </span>
        <span className="mx-2">›</span>
        <span className="text-foreground font-medium">{serviceName}</span>
      </nav>

      {/* Service Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{serviceName}</h1>
              <Badge variant="outline" className={getStatusColor(status)}>
                {status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Enable Service</span>
            <Switch checked={isEnabled} onCheckedChange={handleToggleService} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Metadata
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Metadata Row */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Active Version:</span>
          <Badge variant="secondary">{summary.versionId}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Environment:</span>
          <Badge variant="outline">{summary.environment}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Created By:</span>
          <span>{summary.createdBy}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Last Updated:</span>
          <span>{summary.lastUpdated}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections" className="gap-2">
            <Activity className="w-4 h-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="configuration" className="gap-2">
            <Edit className="w-4 h-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="versions" className="gap-2">
            <History className="w-4 h-4" />
            Versions
          </TabsTrigger>
          <TabsTrigger value="health" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Health & Logs
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Shield className="w-4 h-4" />
            Access & Permissions
          </TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          {supportsMultipleConnections ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Connection Configurations</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Refreshing status...")}>
                    <RefreshCw className="w-4 h-4" />
                    Refresh Status
                  </Button>
                  <Button size="sm" className="gap-2" onClick={onAddConnection}>
                    <Plus className="w-4 h-4" />
                    Add Connection
                  </Button>
                </div>
              </div>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Connection Name</TableHead>
                      <TableHead>Environment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Endpoint / Host</TableHead>
                      <TableHead>Last Tested</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {connections.length > 0 ? (
                      connections.map((conn) => (
                        <TableRow key={conn.id}>
                          <TableCell className="font-medium">{conn.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{conn.environment}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(conn.status)}>
                              {conn.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{conn.endpoint || "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{conn.lastTested || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={() => toast.info("View connection details")}>
                                View
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleTestConnection(conn.id)}>
                                Test
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => toast.info("Disable connection")}>
                                Disable
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No connections configured. Click "Add Connection" to create one.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </>
          ) : (
            <ConnectionDetailPanel
              summary={summary}
              onTest={() => handleTestConnection()}
              onEdit={onEdit}
            >
              {children}
            </ConnectionDetailPanel>
          )}
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service-Level Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {children}
              
              {/* Common configuration sections */}
              <Separator />
              <DetailSection title="Retry Policy">
                <DetailField label="Max Retries" value={3} />
                <DetailField label="Backoff Strategy" value="Exponential" />
                <DetailField label="Initial Delay" value="1000ms" />
                <DetailField label="Max Delay" value="30000ms" />
              </DetailSection>
              
              <DetailSection title="Rate Limits">
                <DetailField label="Requests per Second" value={100} />
                <DetailField label="Burst Limit" value={150} />
                <DetailField label="Daily Quota" value="Unlimited" />
              </DetailSection>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Versions Tab */}
        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Release Notes</TableHead>
                    <TableHead>Activated On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(versions.length > 0 ? versions : defaultVersions).map((v, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{v.version}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(v.status)}>
                          {v.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{v.releaseNotes}</TableCell>
                      <TableCell className="text-muted-foreground">{v.activatedOn}</TableCell>
                      <TableCell>
                        {v.status === "Deprecated" && (
                          <Button variant="ghost" size="sm" onClick={() => toast.info("Rollback initiated")}>
                            Rollback
                          </Button>
                        )}
                        {v.status === "Active" && (
                          <span className="text-sm text-muted-foreground">Current</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health & Logs Tab */}
        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="text-xl font-semibold">{health?.uptime || "99.9%"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Successful Call</p>
                    <p className="text-xl font-semibold">{health?.lastSuccessfulCall || "2 min ago"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Error Rate (24h)</p>
                    <p className="text-xl font-semibold">{health?.errorRate24h || "0.1%"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Logs</CardTitle>
              <Button variant="outline" size="sm">Export Logs</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Connection</TableHead>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Status Code</TableHead>
                    <TableHead>Error Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(logs.length > 0 ? logs : defaultLogs).map((log, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                      <TableCell>{log.connectionName}</TableCell>
                      <TableCell className="font-mono text-sm">{log.requestId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={log.statusCode < 400 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                          {log.statusCode}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{log.errorMessage || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access & Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Permission Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(permissions.length > 0 ? permissions : defaultPermissions).map((perm, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{perm.role}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{perm.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Edit permissions")}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Token Scope</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">Read Access</p>
                    <p className="text-sm text-muted-foreground">View configuration and status</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">Write Access</p>
                    <p className="text-sm text-muted-foreground">Modify configuration settings</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">Admin Access</p>
                    <p className="text-sm text-muted-foreground">Full control including delete</p>
                  </div>
                  <Badge variant="outline">Restricted</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Audit Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Created By</p>
              <p className="font-medium">{audit.createdBy}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created Date</p>
              <p className="font-medium">{audit.createdDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated By</p>
              <p className="font-medium">{audit.lastUpdatedBy}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated Date</p>
              <p className="font-medium">{audit.lastUpdatedDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="flex justify-start">
        <Button variant="outline" onClick={() => navigate("/configuration")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Connected Services
        </Button>
      </div>
    </div>
  );
}

// Connection Detail Panel for single connection services
function ConnectionDetailPanel({ 
  summary, 
  children, 
  onTest, 
  onEdit 
}: { 
  summary: ConfigSummary; 
  children: ReactNode; 
  onTest: () => void; 
  onEdit?: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Connection Configuration</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Single connection configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onTest}>
            Test Connection
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Basic Info</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Connection Name</p>
              <p className="font-medium">{summary.configurationName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Environment</p>
              <Badge variant="outline">{summary.environment}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline" className={summary.status === "ACTIVE" ? "bg-success/10 text-success" : "bg-muted"}>
                {summary.status === "ACTIVE" ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Version</p>
              <p className="font-medium">{summary.versionId}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        {children}
      </CardContent>
    </Card>
  );
}

// Default data for tabs
const defaultVersions: Version[] = [
  { version: "v2.0.0", status: "Active", releaseNotes: "Added OAuth2 support", activatedOn: "2024-01-12" },
  { version: "v1.5.0", status: "Deprecated", releaseNotes: "Performance improvements", activatedOn: "2023-10-05" },
  { version: "v1.0.0", status: "Deprecated", releaseNotes: "Initial release", activatedOn: "2023-06-01" },
];

const defaultLogs: LogEntry[] = [
  { timestamp: "2024-01-15 10:30:15", connectionName: "Primary", requestId: "req-abc123", statusCode: 200 },
  { timestamp: "2024-01-15 10:28:42", connectionName: "Primary", requestId: "req-def456", statusCode: 200 },
  { timestamp: "2024-01-15 10:25:18", connectionName: "Primary", requestId: "req-ghi789", statusCode: 500, errorMessage: "Timeout" },
  { timestamp: "2024-01-15 10:22:05", connectionName: "Primary", requestId: "req-jkl012", statusCode: 200 },
];

const defaultPermissions: Permission[] = [
  { role: "System Admin", level: "Admin" },
  { role: "IT Operations", level: "Edit" },
  { role: "Support Team", level: "View" },
];

interface DetailFieldProps {
  label: string;
  value: string | number | boolean | string[];
  masked?: boolean;
}

export function DetailField({ label, value, masked }: DetailFieldProps) {
  const [revealed, setRevealed] = useState(false);

  const displayValue = () => {
    if (masked && typeof value === "string" && !revealed) {
      return (
        <span className="flex items-center gap-2">
          ••••••••••••
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setRevealed(true)}>
            Reveal
          </Button>
        </span>
      );
    }
    if (masked && typeof value === "string" && revealed) {
      return (
        <span className="flex items-center gap-2">
          {value}
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setRevealed(false)}>
            Hide
          </Button>
        </span>
      );
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{displayValue()}</p>
    </div>
  );
}

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{title}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{children}</div>
      <Separator className="my-4" />
    </div>
  );
}

// Custom Parameters Table Component
export function CustomParametersTable({ parameters }: { parameters: { name: string; value: string; type: string }[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Custom Parameters</h4>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Parameter
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parameter Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parameters.map((param, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{param.name}</TableCell>
              <TableCell>{param.type === "Secret" ? "••••••••" : param.value}</TableCell>
              <TableCell>
                <Badge variant="outline">{param.type}</Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
