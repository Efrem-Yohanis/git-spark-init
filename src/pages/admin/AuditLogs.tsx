import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, History, Search, Filter, Download, User, Shield, Key, Settings, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const mockAuditLogs = [
  { id: 1, user: "Abebe Kebede", action: "Created user", target: "Sara Mohammed", category: "user", timestamp: "2024-01-15 14:30:22", ip: "192.168.1.100" },
  { id: 2, user: "Abebe Kebede", action: "Assigned role", target: "Marketing → Sara Mohammed", category: "role", timestamp: "2024-01-15 14:31:05", ip: "192.168.1.100" },
  { id: 3, user: "Tigist Haile", action: "Reset password", target: "Dawit Gebre", category: "password", timestamp: "2024-01-15 13:45:18", ip: "192.168.1.101" },
  { id: 4, user: "Abebe Kebede", action: "Revoked role", target: "Viewer → Bekele Tadesse", category: "role", timestamp: "2024-01-15 12:20:33", ip: "192.168.1.100" },
  { id: 5, user: "System", action: "Auto-deactivated user", target: "Inactive for 90 days", category: "system", timestamp: "2024-01-15 00:00:00", ip: "-" },
  { id: 6, user: "Abebe Kebede", action: "Updated user profile", target: "Meron Assefa", category: "user", timestamp: "2024-01-14 16:55:12", ip: "192.168.1.100" },
  { id: 7, user: "Tigist Haile", action: "Created user", target: "Yonas Tesfaye", category: "user", timestamp: "2024-01-14 15:30:45", ip: "192.168.1.101" },
  { id: 8, user: "Abebe Kebede", action: "Modified permissions", target: "Marketing role", category: "permission", timestamp: "2024-01-14 14:22:08", ip: "192.168.1.100" },
  { id: 9, user: "System", action: "Failed login attempt", target: "unknown@email.com (5 attempts)", category: "security", timestamp: "2024-01-14 11:05:33", ip: "203.45.67.89" },
  { id: 10, user: "Abebe Kebede", action: "Deleted user", target: "Former Employee", category: "user", timestamp: "2024-01-13 10:15:00", ip: "192.168.1.100" },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "user":
      return <User className="w-4 h-4" />;
    case "role":
      return <Shield className="w-4 h-4" />;
    case "password":
      return <Key className="w-4 h-4" />;
    case "permission":
      return <Shield className="w-4 h-4" />;
    case "system":
      return <Settings className="w-4 h-4" />;
    case "security":
      return <Shield className="w-4 h-4" />;
    default:
      return <History className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "user":
      return "bg-primary/10 text-primary border-primary/20";
    case "role":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case "password":
      return "bg-warning/10 text-warning border-warning/20";
    case "permission":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "system":
      return "bg-muted text-muted-foreground border-muted";
    case "security":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function AuditLogs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/admin/users")}
            className="rounded-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-none bg-primary/10">
              <History className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Audit Logs</h1>
              <p className="text-muted-foreground">Track all user management activities</p>
            </div>
          </div>
        </div>
        <Button variant="outline" className="gap-2 rounded-none">
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 rounded-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-none">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold">{mockAuditLogs.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 rounded-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-none">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User Actions</p>
              <p className="text-2xl font-bold">{mockAuditLogs.filter(l => l.category === "user").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 rounded-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-none">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role Changes</p>
              <p className="text-2xl font-bold">{mockAuditLogs.filter(l => l.category === "role").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 rounded-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-none">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Security Events</p>
              <p className="text-2xl font-bold">{mockAuditLogs.filter(l => l.category === "security").length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 rounded-none">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, action, or target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-none"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] rounded-none">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="password">Password</SelectItem>
                <SelectItem value="permission">Permission</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[160px] rounded-none">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="rounded-none">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold w-[180px]">Timestamp</TableHead>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">Target</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {log.timestamp}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {log.user !== "System" && (
                      <div className="w-7 h-7 rounded-none bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {log.user.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                    )}
                    <span className={log.user === "System" ? "text-muted-foreground italic" : "font-medium"}>
                      {log.user}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell className="text-muted-foreground">{log.target}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn("rounded-none gap-1.5", getCategoryColor(log.category))}
                  >
                    {getCategoryIcon(log.category)}
                    {log.category.charAt(0).toUpperCase() + log.category.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {log.ip}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
