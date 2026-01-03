import { useState } from "react";
import { Settings, Users, Shield, Key, History, Plus, MoreHorizontal, Mail, Phone, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const users = [
  { id: 1, name: "John Kamau", email: "john.k@mpesa.co.ke", role: "Admin", status: "Active", lastLogin: "2024-01-15 09:30" },
  { id: 2, name: "Sarah Mutua", email: "sarah.m@mpesa.co.ke", role: "Marketing", status: "Active", lastLogin: "2024-01-15 08:45" },
  { id: 3, name: "Peter Omondi", email: "peter.o@mpesa.co.ke", role: "Operations", status: "Active", lastLogin: "2024-01-14 16:20" },
  { id: 4, name: "Grace Njeri", email: "grace.n@mpesa.co.ke", role: "Finance", status: "Active", lastLogin: "2024-01-15 10:00" },
  { id: 5, name: "David Wekesa", email: "david.w@mpesa.co.ke", role: "Viewer", status: "Inactive", lastLogin: "2024-01-10 11:30" },
];

const auditLogs = [
  { id: 1, user: "John Kamau", action: "Created campaign 'Festive Rewards'", timestamp: "2024-01-15 14:30", ip: "192.168.1.100" },
  { id: 2, user: "Sarah Mutua", action: "Approved segment 'High Value Active'", timestamp: "2024-01-15 13:45", ip: "192.168.1.101" },
  { id: 3, user: "System", action: "Reward posting completed - KES 50,000", timestamp: "2024-01-15 12:00", ip: "-" },
  { id: 4, user: "Peter Omondi", action: "Exported MSISDN list", timestamp: "2024-01-15 11:30", ip: "192.168.1.102" },
  { id: 5, user: "Grace Njeri", action: "Updated reward budget allocation", timestamp: "2024-01-15 10:15", ip: "192.168.1.103" },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "Marketing":
      return "bg-primary/10 text-primary border-primary/20";
    case "Operations":
      return "bg-info/10 text-info border-info/20";
    case "Finance":
      return "bg-warning/10 text-warning border-warning/20";
    case "Viewer":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Admin() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin & Settings</h1>
          <p className="text-muted-foreground">Manage users, permissions, and system configuration</p>
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="channels" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Channel Settings
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <History className="w-4 h-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Users</h2>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Last Login</TableHead>
                  <TableHead className="font-semibold w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium", getRoleColor(user.role))}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "font-medium",
                          user.status === "Active" 
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Permissions Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Role Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Configure role-based access control for each feature module.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channel Settings Tab */}
        <TabsContent value="channels" className="space-y-4">
          <h2 className="text-lg font-semibold">Channel Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  SMS Gateway
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <span className="font-medium">Africa's Talking</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-success/10 text-success border-success/20">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sender ID</span>
                  <span className="font-medium">M-PESA</span>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Key className="w-4 h-4" />
                  Configure API Keys
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  USSD Gateway
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <span className="font-medium">Internal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-success/10 text-success border-success/20">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Short Code</span>
                  <span className="font-medium">*234#</span>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Settings className="w-4 h-4" />
                  Configure Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <span className="font-medium">Firebase</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-warning/10 text-warning border-warning/20">Warning</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Project</span>
                  <span className="font-medium">mpesa-engage-prod</span>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Key className="w-4 h-4" />
                  Update Credentials
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <span className="font-medium">SendGrid</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-success/10 text-success border-success/20">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">From Email</span>
                  <span className="font-medium">noreply@mpesa.co.ke</span>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Settings className="w-4 h-4" />
                  Configure Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Audit Trail</h2>
            <Button variant="outline" className="gap-2">
              Export Logs
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Timestamp</TableHead>
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                  <TableHead className="font-semibold">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{log.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
